exports.up = function (knex) {
  return knex.schema.createTable("likes", (t) => {
    t.increments();
    t.integer("tweet_id")
      .notNullable()
      .references("tweets.id")
      .onDelete("CASCADE");
    t.integer("user_id")
      .notNullable()
      .references("users.id")
      .onDelete("CASCADE");
    t.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("likes");
};
