const express = require("express");
const morgan = require("morgan");
const session = require("express-session");

const usersRouter = require("./controllers/users-controllers");
const followsRouter = require("./controllers/follows-controllers");
const tweetsRouter = require("./controllers/tweets-controllers");
const likesRouter = require("./controllers/likes-controllers");

const app = express();

app.use(morgan("combined"));

app.use(
  session({
    secret: "harry",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 600000 },
  })
);

app.use(async function (req, res, next) {
  try {
    await next();
  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.use(express.json());

app.use("/api/v1/users", followsRouter);
app.use("/api/v1", usersRouter);
app.use("/api/v1/tweets", tweetsRouter);
app.use("/api/v1/likes",likesRouter);

app.listen(3000);
