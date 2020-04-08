const knex = require('./knex');
const { createUser, findUser } = require('./users');

const users = {
    createUser: createUser(knex),
    findUser: findUser(knex)
}

module.exports = {
    users,
}