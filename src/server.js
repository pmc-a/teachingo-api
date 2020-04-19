const express = require('express');
const app = express();
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const { verifyToken } = require('./middleware/check-auth');
const { decodeToken } = require('./middleware/decode-auth');
const { logOriginalUrl, logMethod } = require('./middleware/server-logging');

const saltRounds = 12;
require('dotenv').config();

const { lessons, users } = require('./services');

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

app.use(bodyParser.json());
app.use(cors());

const publicRoutes = [logOriginalUrl, logMethod];
const privateRoutes = [...publicRoutes, verifyToken];

app.get('/api/status', (req, res) => {
    res.status(200).end();
});

// app.get('/token', (req, res) => {
//   const { identity, roomName } = req.query;
//   const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
//     ttl: MAX_ALLOWED_SESSION_DURATION,
//   });
//   token.identity = identity;
//   const videoGrant = new VideoGrant({ room: roomName });
//   token.addGrant(videoGrant);
//   res.send(token.toJwt());
//   console.log(`issued token for ${identity} in room ${roomName}`);
// });

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

module.exports = { app };
