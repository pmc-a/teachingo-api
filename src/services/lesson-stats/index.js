const getStudentsInClass = (knex) => (id) => {
    try {
        return knex('lessons')
            .join('user_class', 'lessons.class_id', 'user_class.class_id')
            .select('user_class.student_id')
            .where({ 'lessons.id': id });
    } catch (error) {
        console.log(error);
        throw new Error('No lesson found');
    }
};

module.exports = {
    getStudentsInClass,
};
