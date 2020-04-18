const getTeacherLessonsByUserId = (knex) => (userId) => {
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
        throw new Error('Error fetching the teacher lesson by userId');
    }
};

const getStudentLessonsByUserId = (knex) => (userId) => {
    try {
        return knex('lessons')
            .join('user_class', 'lessons.class_id', 'user_class.class_id')
            .join('classes', 'lessons.class_id', 'classes.id')
            .select()
            .where({
                'user_class.student_id': userId,
            });
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching the student lesson by userId');
    }
};

module.exports = {
    getStudentLessonsByUserId,
    getTeacherLessonsByUserId,
};
