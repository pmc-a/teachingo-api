exports.up = function (knex) {
    return knex.schema.createTable('classes', (table) => {
        table.unique(['class_id', 'student_id']);
        table.string('class_id', 255).notNullable();
        table
            .integer('student_id')
            .references('id')
            .inTable('users')
            .notNull()
            .onDelete('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};
