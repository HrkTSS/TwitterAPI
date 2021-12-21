const db = require("../db");

async function createLike(likes) {
  likes.created_at = new Date();
  likes.updated_at = new Date();
  const [id] = await db("likes").insert(likes);
  likes.id = id;
  return likes;
}

async function deleteLike(id, userId) {
  return await db("likes").del().where({ id: id, user_id: userId }).first();
}

async function getAllLikes(id) {
  return await db("likes")
    .select()
    .leftJoin("users", "likes.user_id", "=", "users.id")
    .where("likes.tweet_id", id);
}

module.exports = { createLike, deleteLike, getAllLikes };
