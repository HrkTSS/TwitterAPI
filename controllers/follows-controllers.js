const express = require("express");
const router = express.Router();
const followsService = require("../services/follows-services");
const usersService = require("../services/users-services");
const { isLoggedIn, jwtAuth } = require("../middleware/auth");

//checking

router.post("/followings", jwtAuth, isLoggedIn, async (req, res) => {
  const [id, followId] = [req.user.id, Number(req.body.follow_id)];
  if (!followId) {
    res.status(400).send({ code: 400, message: "follow_id field missing" });
    return;
  }
  if (followId === id) {
    res.status(404).send({ code: 400, message: "User cannot follow himself" });
    return;
  }
  const user = await usersService.getByUserId(followId);
  if (!user) {
    res
      .status(400)
      .send({ code: 400, message: "Requested follower does not exists" });
    return;
  }
  try {
    const connectionId = await followsService.createConnect(id, followId);
    res
      .status(201)
      .send({ id: connectionId, message: "Follow request successful" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ code: 400, message: "Follow request failed" });
  }
});

router.get("/followings", jwtAuth, isLoggedIn, async (req, res) => {
  const followers = await followsService.getFollowings(req.user.id);
  res.status(200).send(followers);
});

router.get("/followers", jwtAuth, isLoggedIn, async (req, res) => {
  const followers = await followsService.getFollowers(req.user.id);
  res.status(200).send(followers);
});

router.get("/followings/:id", jwtAuth, isLoggedIn, async (req, res) => {
  const user = await usersService.getByUserId(req.params.id);
  if (!user) {
    res.status(400).send({ code: 400, message: "Requested user not found" });
    return;
  }
  const followers = await followsService.getFollowings(req.params.id);
  res.status(200).send(followers);
});

router.get("/followers/:id", jwtAuth, isLoggedIn, async (req, res) => {
  const user = await usersService.getByUserId(req.params.id);
  if (!user) {
    res.status(400).send({ code: 400, message: "Requested user not found" });
    return;
  }
  const followers = await followsService.getFollowers(req.params.id);
  res.status(200).send(followers);
});

router.get("/connections", jwtAuth, isLoggedIn, async (req, res) => {
  const resData = {};
  resData.followers = {};
  resData.followings = {};
  resData.user = await usersService.getByUserId(req.user.id);
  resData.followers.users = await followsService.getFollowers(req.user.id);
  resData.followers.count = resData.followers.users.length;
  resData.followings.users = await followsService.getFollowings(req.user.id);
  resData.followings.count = resData.followings.users.length;

  res.status(200).send(resData);
});

router.get("/connections/:id", jwtAuth, isLoggedIn, async (req, res) => {
  const resData = {};
  resData.user = await usersService.getByUserId(req.params.id);
  resData.followers = await followsService.getFollowers(req.user.id);
  resData.user.followersCount = resData.followers.length;
  resData.followings = await followsService.getFollowings(req.user.id);
  resData.user.followingsCount = resData.followings.length;

  res.status(200).send(resData);
});

router.delete("/followings/:id", jwtAuth, isLoggedIn, async (req, res) => {
  const deleted = await followsService.deleteFollow(req.user.id, req.params.id);
  if (!deleted) {
    res
      .status(404)
      .status({ code: 404, message: "Requested unfollow cannot be processed" });
    return;
  }

  res.status(200).send({ code: 200, message: "Unfollowed successfully" });
});
module.exports = router;
