const getLessonsByUserId = (knex) => (userId) => {
    try {
        // This is _specifically_ for teachers right now as we're filtering on teacher_id
        return knex('lessons')
            .join('classes', 'lessons.class_id', 'classes.id')
            .select()
            .where({
                teacher_id: userId,
            });
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching the lesson by userId');
    }
};

module.exports = {
    getLessonsByUserId,
};
