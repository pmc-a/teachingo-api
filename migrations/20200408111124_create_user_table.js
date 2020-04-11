exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id');
        table.string('email', 255).notNullable();
        table.string('password', 255).notNullable();
        table.string('first_name', 255).notNullable();
        table.string('last_name', 255).notNullable();
        table.string('mobile', 255).notNullable();
        table.enu('type', ['student', 'teacher']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};
