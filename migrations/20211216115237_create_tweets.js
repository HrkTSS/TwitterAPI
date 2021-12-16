exports.up = function (knex) {
  return knex.schema.createTable("tweets", (t) => {
    t.increments();
    t.integer("user_id")
      .unsigned()
      .notNullable()
      .references("users.id")
      .onDelete("CASCADE");
    t.string("message").notNullable();
    t.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("tweets");
};
