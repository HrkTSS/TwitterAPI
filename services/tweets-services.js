const db = require("../db");

async function createTweet(tweet) {
  tweet.created_at = new Date();
  tweet.updated_at = new Date();
  const [id] = await db("tweets").insert(tweet);
  tweet.id = id;
  delete tweet.updated_at;
  delete tweet.user_id;
  return tweet;
}

async function getAllTweets(id) {
  return await db("tweets")
    .select(["id", "message", "created_at", "parent_id"])
    .where({ user_id: id, parent_id: null }); 
}

async function getTweetById(id) {
  return await db("tweets")
    .select(["id", "message", "created_at"])
    .where("id", id)
    .first();
}

async function deleteTweet(id, userId) {
  return await db("tweets").del().where({ id: id, user_id: userId });
}

module.exports = { createTweet, getAllTweets, getTweetById, deleteTweet };
