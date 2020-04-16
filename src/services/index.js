const knex = require('./knex');
const { getLessonsByUserId } = require('./lessons');
const { createUser, findUser } = require('./users');

const lessons = {
    getLessonsByUserId: getLessonsByUserId(knex),
};

const users = {
    createUser: createUser(knex),
    findUser: findUser(knex),
};

module.exports = {
    lessons,
    users,
};
