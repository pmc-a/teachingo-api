const knex = require('./knex');
const {
    getClassInformationByLessonId,
    getStudentLessonsByUserId,
    getTeacherLessonsByUserId,
    updateLessonAttendance,
} = require('./lessons');
const {
    createUser,
    findUser,
    getUserById,
    getUserNameById,
    getUserTypeById,
} = require('./users');

const { getStudentsInClass, getAttendedStudents } = require('./lesson-stats');

const lessons = {
    getClassInformationByLessonId: getClassInformationByLessonId(knex),
    getStudentLessonsByUserId: getStudentLessonsByUserId(knex),
    getTeacherLessonsByUserId: getTeacherLessonsByUserId(knex),
    updateLessonAttendance: updateLessonAttendance(knex),
};

const users = {
    createUser: createUser(knex),
    findUser: findUser(knex),
    getUserById: getUserById(knex),
    getUserNameById: getUserNameById(knex),
    getUserTypeById: getUserTypeById(knex),
};

const lessonStats = {
    getStudentsInClass: getStudentsInClass(knex),
    getAttendedStudents: getAttendedStudents(knex),
};

module.exports = {
    lessons,
    users,
    lessonStats,
};
