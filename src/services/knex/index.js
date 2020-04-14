const { development, production } = require('../../../knexfile');

const knex = require('knex')(
    process.env.NODE_ENV === 'production' ? production : development
);

module.exports = knex;
