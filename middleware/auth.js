const db = require("../db");
const jwt = require("jsonwebtoken");

async function jwtAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, "OJHHkhTUCcWGL8iD3goaxw==");
        const user = await db("users")
          .select()
          .where("users.id", decoded.userId);

        if (user) {
          req.user = user;
          next();
          return;
        }
      } catch (err) {
        res
          .status(401)
          .send({ code: 401, message: "Access denied : Invalid token" });
        return;
      }
    }
  }
  next();
}

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

module.exports = { jwtAuth, isLoggedIn, isOwnerOrFollower };
