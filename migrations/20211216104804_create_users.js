

exports.up = function (knex) {
  return knex.schema.createTable("users", (t) => {
    t.increments();
    t.string("name").notNullable()
    t.string("user_name").notNullable().unique();
    t.string("mail_id").notNullable().unique();
    t.string("password").notNullable();
    t.string("dob").notNullable();
    t.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
