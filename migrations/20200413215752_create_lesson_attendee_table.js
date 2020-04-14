exports.up = function (knex) {
    return knex.schema.createTable('lesson_attendees', (table) => {
        table.unique(['lesson_id', 'student_id']);
        table
            .integer('lesson_id')
            .references('id')
            .inTable('lessons')
            .notNull()
            .onDelete('cascade');
        table
            .integer('student_id')
            .references('id')
            .inTable('users')
            .notNull()
            .onDelete('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('lesson_attendees');
};
