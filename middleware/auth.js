const db = require("../db");

async function isLoggedIn(req, res, next) {
  req.user = req.session.user;
  if (req.user) {
    next();
    return;
  }

  res.status(401).send({
    code: 401,
    message: "User authentication failed, kindly login to continue...",
  });
}

async function isOwnerOrFollower(req, res, next) {
  const data = await db("tweets")
    .column(["tweets.id", "tweets.message"])
    .select()
    .leftJoin("connections", "connections.connect_id", "=", "tweets.user_id")
    .where({ "tweets.id": req.params.id, "tweets.user_id": req.user.id })
    .orWhere({ "tweets.id": req.params.id, "connections.user_id": req.user.id })
    .first();

  if (!data) {
    res.status(404).send({ code: 404, message: "Sorry tweet not found" });
    return;
  }
  next();
}

module.exports = { isLoggedIn, isOwnerOrFollower };
