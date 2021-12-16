exports.up = function (knex) {
  return knex.schema.createTable("replies", (t) => {
    t.increments();
    
    t.integer("tweet_id")
      .unsigned()
      .notNullable()
      .references("tweets.id")
      .onDelete("CASCADE");
    
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
  return knex.schema.dropTableIfExists("replies");
};
