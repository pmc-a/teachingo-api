const getStudentsInClass = (knex) => async (id) => {
    try {
        const studentsInClass = await knex('lessons')
            .join('user_class', 'lessons.class_id', 'user_class.class_id')
            .select('user_class.student_id')
            .where({ 'lessons.id': id });

        const studentsInClassIds = studentsInClass.map(
            (student) => student.student_id
        );
        return studentsInClassIds;
    } catch (error) {
        console.log(error);
        throw new Error('No lesson found');
    }
};

const getAttendedStudents = (knex) => async (id) => {
    try {
        const attendedStudents = await knex('lessons')
            .join(
                'lesson_attendees',
                'lessons.id',
                'lesson_attendees.lesson_id'
            )
            .select('lesson_attendees.student_id')
            .where({ 'lessons.id': id });

        const attendedStudentsIds = attendedStudents.map(
            (student) => student.student_id
        );
        return attendedStudentsIds;
    } catch (error) {
        console.log(error);
        throw new Error('No lesson found');
    }
};

module.exports = {
    getStudentsInClass,
    getAttendedStudents,
};
