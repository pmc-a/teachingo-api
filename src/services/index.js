const knex = require('./knex');
const {
    getStudentLessonsByUserId,
    getTeacherLessonsByUserId,
    updateLessonAttendance,
} = require('./lessons');
const { createUser, findUser, getUserTypeById } = require('./users');

const lessons = {
    getStudentLessonsByUserId: getStudentLessonsByUserId(knex),
    getTeacherLessonsByUserId: getTeacherLessonsByUserId(knex),
    updateLessonAttendance: updateLessonAttendance(knex),
};

const users = {
    createUser: createUser(knex),
    findUser: findUser(knex),
    getUserTypeById: getUserTypeById(knex),
};

module.exports = {
    lessons,
    users,
};
