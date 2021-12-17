const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const usersServices = require("../services/users-services");

router.post("/auth/register", async (req, res) => {
  let user = req.body;
  try {
    const newUser = await usersServices.createUser(req.body);
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
  const user = await usersServices.loginUser(
    req.body.user_name,
    req.body.password
  );
  if (user) {
    req.session.user = user;
    res.send({ message: "Logged in successfully" });
    return;
  }

  res.status(401).send({ code: 400, message: "Invalid username or password" });
});

router.get("/users/me", isLoggedIn, async (req, res) => {
  const user = await usersServices.getByUserId(req.user.id);
  if (user) {
    res.status(200).send(user);
    return;
  }

  res.status(400).send({ code: 400, message: "user not found" });
});

router.get("/users/:id", isLoggedIn, async (req, res) => {
  const user = await usersServices.getByUserId(Number(req.params.id));
  if (!user) {
    res.status(404).send({ code: 404, message: "User not found" });
    return;
  }

  res.send(user);
});

router.put("/users/me", isLoggedIn, async (req, res) => {
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

router.delete("/users/me", isLoggedIn, async (req, res) => {
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
