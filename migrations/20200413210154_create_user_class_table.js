exports.up = function (knex) {
    return knex.schema.createTable('user_class', (table) => {
        table.unique(['student_id', 'class_id']);
        table
            .integer('student_id')
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
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('user_class');
};
