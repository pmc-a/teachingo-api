const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const { verifyToken } = require('./middleware/check-auth');
const { decodeToken } = require('./middleware/decode-auth');
const { logOriginalUrl, logMethod } = require('./middleware/server-logging');

const {
    getAccessToken,
    getVideoGrant,
    sendMessageToStudent,
} = require('./twilio');

const saltRounds = 12;
require('dotenv').config();

const { lessons, users, lessonStats } = require('./services');

app.use(bodyParser.json());
app.use(cors());

const publicRoutes = [logOriginalUrl, logMethod];
const privateRoutes = [...publicRoutes, verifyToken];

app.get('/api/status', (req, res) => {
    res.status(200).end();
});

/**
 * Fetch lessons for a particular user
 * User is determined on their access token
 * The JWT contains their user ID & email - this decodes the token and uses the ID to grab lessons
 */
app.get('/api/lessons', privateRoutes, async (req, res) => {
    try {
        // Determine the userID from the userToken that has been submitted with the request
        const { id } = decodeToken(req.headers.authorization);
        const userType = await users.getUserTypeById(id);

        const lessonResult =
            userType[0].type === 'teacher'
                ? await lessons.getTeacherLessonsByUserId(id)
                : await lessons.getStudentLessonsByUserId(id);

        res.status(200).json(lessonResult);
    } catch (error) {
        console.log(error);
        res.status(500).json('Error fetching lessons');
    }
});

app.put(
    '/api/lessons/:lessonId/attendance',
    privateRoutes,
    async (req, res) => {
        try {
            const { id } = decodeToken(req.headers.authorization);
            await lessons.updateLessonAttendance(req.params.lessonId, id);

            res.status(200).json('Successfully updated attendance');
        } catch (error) {
            console.error(error);
            res.status(500).json('Error updating the lesson attendance');
        }
    }
);

app.post('/api/create-account', publicRoutes, async (req, res) => {
    const { email, password, first_name, last_name, mobile, type } = req.body;

    try {
        const hash = await bcrypt.hash(password, saltRounds);
        await users.createUser(
            email,
            hash,
            first_name,
            last_name,
            mobile,
            type
        );

        res.status(200).json('Successfully created user!');
    } catch (error) {
        console.error(error);
        res.status(500).json('Something went wrong');
    }
});

app.post('/api/login', publicRoutes, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await users.findUser(email);

        if (user[0]) {
            const result = await bcrypt.compare(password, user[0].password);
            if (result) {
                const token = jwt.sign(
                    { id: user[0].id, email },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '8hr',
                    }
                );
                res.status(200).json({ type: user[0].type, token });
            } else {
                console.log('Incorrect password');
                res.status(400).json('Incorrect username or password');
            }
        } else {
            console.log('No user found');
            res.status(400).json('Incorrect username or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Something went wrong');
    }
});

app.get('/api/token', privateRoutes, async (req, res) => {
    try {
        const { lessonId } = req.query;
        const { id } = decodeToken(req.headers.authorization);
        const user = await users.getUserById(id);

        // This will be used to form the identity
        const firstName = user[0].first_name;
        const lastName = user[0].last_name;

        const classInformation = await lessons.getClassInformationByLessonId(
            lessonId
        );
        const className = classInformation[0].name;

        // Format will be lessonId-userId-firstName-lastName
        const identity = `${lessonId}-${id}-${firstName}-${lastName}`;

        // Combination of class name && lessonID to make up the roomName
        // Format will be lessonId-className
        const roomName = `${lessonId}-${className}`;

        const token = getAccessToken();

        token.identity = identity;
        const videoGrant = getVideoGrant(roomName);
        token.addGrant(videoGrant);

        console.log(
            `Issued Twilio Video token for ${identity} in room ${roomName}`
        );

        res.send(token.toJwt());
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong fetching the video token!');
    }
});

const fetchUser = async (id) => {
    const result = await users.getUserNameById(id);
    return result[0];
};

app.get('/api/lessons/:lessonId/stats', privateRoutes, async (req, res) => {
    const { lessonId } = req.params;
    try {
        const studentsInClass = await lessonStats.getStudentsInClass(lessonId);
        const attendedStudents = await lessonStats.getAttendedStudents(
            lessonId
        );

        const numStudentsInClass = studentsInClass.length;
        const numAttendedStudents = attendedStudents.length;

        const absentStudentsIds = studentsInClass.filter(
            (student) => !attendedStudents.includes(student)
        );

        let absentStudentsDetails = [];

        for (let i = 0; i <= absentStudentsIds.length - 1; i++) {
            result = await fetchUser(absentStudentsIds[i]);
            absentStudentsDetails.push(result);
        }

        res.status(200).json({
            numStudentsInClass: numStudentsInClass,
            numAttendedStudents: numAttendedStudents,
            percentageAttended:
                (numAttendedStudents / numStudentsInClass) * 100,
            absentStudentsDetails: absentStudentsDetails,
        });
    } catch (error) {
        console.error(error);
    }
});

const fetchMobile = async (id) => {
    const number = await users.getUserMobileById(id);
    return number[0];
};

app.post(
    '/api/lessons/:lessonId/absentees',
    privateRoutes,
    async (req, res) => {
        const absentStudents = req.body.absentStudents;

        const className = await lessons.getClassInformationByLessonId(
            req.params.lessonId
        );

        for (let i = 0; i <= absentStudents.length - 1; i++) {
            number = await fetchMobile(absentStudents[i]);
            console.log(number.mobile);
            await sendMessageToStudent(className[0], number.mobile, res);
        }
    }
);

module.exports = { app };
