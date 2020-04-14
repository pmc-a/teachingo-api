/* eslint-disable prettier/prettier */
exports.seed = function (knex) {
  return knex('classes')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('classes').insert([
        { name: "CSC2040" },
        { name: "Eng1030" },
        { name: "Geog3020" },
      ]);
    });
};
