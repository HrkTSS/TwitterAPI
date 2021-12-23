const express = require("express");
const router = express.Router();
const { jwtAuth, isLoggedIn } = require("../middleware/auth");
const usersServices = require("../services/users-services");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/auth/register", async (req, res) => {
  let user = req.body;
  try {
    user.password = bcrypt.hashSync(user.password, 10);
    const newUser = await usersServices.createUser(user);
    delete newUser.password;
    res.status(201).send(newUser);
  } catch (err) {
    if (err.errno === 19) {
      if (user.user_name && user.mail_id) {
        res
          .status(400)
          .send({ code: 400, message: "Username, Email id already exists" });
        return;
      }
      if (user.mail_id) {
        res.status(400).send({ code: 400, message: "Email id already exists" });
        return;
      }
      if (user.user_name) {
        res.status(400).send({ code: 400, message: "Username already exists" });
        return;
      }
    } else {
      res.status(500).send({ code: 500, message: "Internal server error" });
    }
  }
});

router.post("/auth/login", async (req, res) => {
  if (
    !req.body.user_name ||
    !req.body.password ||
    req.body.user_name === "" ||
    req.body.password === ""
  ) {
    res.status(401).send({
      code: 401,
      message: "Username, password is mandatory for login",
    });
    return;
  }
  const user = await usersServices.loginUser(
    req.body.user_name,
    req.body.password
  );
  if (user) {
    const token = jwt.sign({ userId: user.id }, "OJHHkhTUCcWGL8iD3goaxw==", {
      expiresIn: "1d",
    });
    req.session.user = user;
    res.send({ message: "Logged in successfully", token });
    return;
  }

  res.status(401).send({ code: 400, message: "Invalid username or password" });
});

router.get("/users/me", jwtAuth, isLoggedIn, async (req, res) => {
  const user = await usersServices.getByUserId(req.user.id);
  if (user) {
    res.status(200).send(user);
    return;
  }

  res.status(400).send({ code: 400, message: "user not found" });
});

router.get("/users", jwtAuth, isLoggedIn, async (req, res) => {
  const users = await usersServices.getAllUsers();
  res.status(200).send(users);
});

router.get("/users/:id", jwtAuth, isLoggedIn, async (req, res) => {
  const user = await usersServices.getByUserId(Number(req.params.id));
  if (!user) {
    res.status(404).send({ code: 404, message: "User not found" });
    return;
  }

  res.send(user);
});

router.put("/users/me", jwtAuth, isLoggedIn, async (req, res) => {
  const user = req.body;
  try {
    let updateData = {};
    if (user.name) updateData.name = user.name;
    if (user.mail_id) updateData.mail_id = user.mail_id;
    if (user.user_name) updateData.user_name = user.user_name;
    if (user.dob) updateData.dob = user.dob;
    updateData.updated_at = new Date();
    await usersServices.updateByUserId(req.user.id, updateData);
    res.status(200).send(await usersServices.getByUserId(req.user.id));
  } catch (err) {
    if (err.errno === 19) {
      if (user.user_name && user.mail_id) {
        res
          .status(400)
          .send({ code: 400, message: "Username, Email id already exists" });
        return;
      }
      if (user.mail_id) {
        res.status(400).send({ code: 400, message: "Email id already exists" });
        return;
      }
      if (user.user_name) {
        res.status(400).send({ code: 400, message: "Username already exists" });
        return;
      }
    } else
      res.status(500).send({ code: 500, message: "Internal server error" });
  }
});

router.delete("/users/me", jwtAuth, isLoggedIn, async (req, res) => {
  const deleted = await usersServices.deleteUser(req.user.id);
  if (deleted) {
    req.session.user = null;
    req.user = null;
    res
      .status(202)
      .send({ code: 202, message: "Account deleted successfully" });
    return;
  }

  res.status(500).send("Internal sever error");
});

module.exports = router;
