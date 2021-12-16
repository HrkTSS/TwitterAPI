const express = require("express");
const router = express.Router();
const usersServices = require("../services/users-services");

router.post("/register", async (req, res) => {
  try {
    const user = await usersServices.createUser(req.body);
    res.status(201).send(user);
  } catch (err) {
    if (err.errno === 19) {
      res.status(400).send({ message: "Username already exists" });
    } else {
      res.status(500).send({ message: "Internal server error" });
    }
  }
});

router.post("/login", async (req, res) => {
  const user = await usersServices.loginUser(
    req.body.user_name,
    req.body.password
  );
  if (user) {
    req.session.user = user;
    res.send({ message: "Logged in successfully" });
    return;
  }

  res.status(401).send({ message: "Invalid username or password" });
});

module.exports = router;
