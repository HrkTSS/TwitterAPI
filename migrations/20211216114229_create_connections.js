exports.up = function (knex) {
  return knex.schema.createTable("connections", (t) => {
    t.increments();
    t.integer("user_id")
      .unsigned()
      .notNullable()
      .references("users.id")
      .onDelete("CASCADE");
    t.integer("connect_id")
      .unsigned()
      .references("users.id")
      .notNullable()
      .onDelete("CASCADE");
    t.unique(["user_id", "connect_id"]);
    t.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("connections");
};
