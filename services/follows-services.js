const db = require("../db");

async function createConnect(id, followId) {
  const [createdId] = await db("connections").insert({
    user_id: id,
    connect_id: followId,
    created_at: new Date(),
    updated_at: new Date()
  });
  return createdId;
}

async function getFollowings(id) {
  const followers = await db("connections")
    .select("users.name", "users.user_name", "users.mail_id", "users.dob")
    .leftJoin("users", "users.id", "connections.connect_id")
    .where("connections.user_id", id);

  return followers;
}

async function getFollowers(id) {
  const followers = await db("connections")
    .select("users.name", "users.user_name", "users.mail_id", "users.dob")
    .leftJoin("users", "users.id", "connections.user_id")
    .where("connections.connect_id", id);

  return followers;
}

async function deleteFollow(userId, connectId) {
  return await db("connections")
    .del()
    .where({ user_id: userId, connect_id: connectId });
}

module.exports = { createConnect, getFollowings, getFollowers, deleteFollow };
