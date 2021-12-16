const db = require("../db");

async function createUser(user) {
  user.created_at = new Date();
  user.updated_at = new Date();
  const [id] = await db("users").insert(user);
  user.id = id;
  return user;
}

async function loginUser(user_name, password) {
  const user = await db("users")
    .select()
    .where({ user_name, password })
    .first();
  return user;
}

module.exports = { createUser, loginUser };
