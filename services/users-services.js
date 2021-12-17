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

async function getByUserId(id) {
  return await db("users")
    .select(["name", "user_name", "mail_id", "dob"])
    .where("id", id)
    .first();
}

async function updateByUserId(id, user) {
  return await db("users").update(user).where("id", id);
}

async function deleteUser(id) {
  return await db("users").del().where("id", id);
}

module.exports = { createUser, loginUser, getByUserId, updateByUserId,deleteUser };
