/* eslint-disable prettier/prettier */
exports.seed = function (knex) {
  return knex('classes')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('classes').insert([
        { class_id: "CSC2040", student_id: 1 },
        { class_id: "CSC2040", student_id: 2 },
        { class_id: "Eng1030", student_id: 3 },
        { class_id: "Eng1030", student_id: 4 },
        { class_id: "Eng1030", student_id: 1 },
      ]);
    });
};
