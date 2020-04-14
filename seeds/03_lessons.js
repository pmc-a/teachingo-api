/* eslint-disable prettier/prettier */
exports.seed = function (knex) {
  return knex('lessons')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('lessons').insert([
        { teacher_id: 2, class_id: 1, date_time: '2020-03-17 18:29:21.758315-07', num_questions: null, num_positive_feedback: null, num_negative_feedback: null, num_neutral_feedback: null },
        { teacher_id: 2, class_id: 2, date_time: '2020-03-15 14:15:26.758315-07', num_questions: null, num_positive_feedback: null, num_negative_feedback: null, num_neutral_feedback: null },
      ]);
    });
};