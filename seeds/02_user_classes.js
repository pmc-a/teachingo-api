/* eslint-disable prettier/prettier */
exports.seed = function (knex) {
  return knex('user_class')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('user_class').insert([
        { student_id: 1, class_id: 1 },
        { student_id: 1, class_id: 2 },
        { student_id: 2, class_id: 3 },
        { student_id: 3, class_id: 3 },
        { student_id: 4, class_id: 3 },
        { student_id: 4, class_id: 2 },
        { student_id: 4, class_id: 1 },
      ]);
    });
};
