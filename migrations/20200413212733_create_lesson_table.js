exports.up = function (knex) {
    return knex.schema.createTable('lessons', (table) => {
        table.increments('id');
        table
            .integer('teacher_id')
            .references('id')
            .inTable('users')
            .notNull()
            .onDelete('cascade');
        table
            .integer('class_id')
            .references('id')
            .inTable('classes')
            .notNull()
            .onDelete('cascade');
        table.datetime('date_time');
        table.integer('num_questions');
        table.integer('num_positive_feedback');
        table.integer('num_neutral_feedback');
        table.integer('num_negative_feedback');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('lessons');
};
