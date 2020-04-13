/* eslint-disable prettier/prettier */
exports.seed = function (knex) {
  return knex('lesson_attendees')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('lesson_attendees').insert([
        { lesson_id: 1, student_id: 1 },
        { lesson_id: 1, student_id: 4 },
        { lesson_id: 2, student_id: 3 },
        { lesson_id: 2, student_id: 4 },
      ]);
    });
};