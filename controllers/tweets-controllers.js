const express = require("express");
const router = express.Router();
const tweetsService = require("../services/tweets-services");
const { isLoggedIn, isOwnerOrFollower } = require("../middleware/auth");


router.post("/", isLoggedIn, async (req, res) => {
  if (!(req.body.message === "")) {
    const data = { user_id: req.user.id, message: req.body.message };
    const tweet = await tweetsService.createTweet(data);
    res.status(201).send(tweet);
    return;
  }
  res.status(400).send({ code: 400, message: "message should not be empty" });
});

router.get("/me", isLoggedIn, async (req, res) => {
  const tweets = await tweetsService.getAllTweets(req.user.id);
  res.status(200).send(tweets);
});

router.get("/:id", isLoggedIn, isOwnerOrFollower, async (req, res) => {
  const tweet = await tweetsService.getTweetById(req.params.id);
  res.status(200).send(tweet);
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  const deleted = await tweetsService.deleteTweet(req.params.id, req.user.id);
  if (!deleted) {
    res.status(404).send({ code: 404, message: "Sorry, delete tweet access denied or doesn't exists" });
    return;
  }

  res.status(200).send({ code: 200, message: "Tweet deleted successfully" });
});

module.exports = router;
