const express = require("express");
const { isLoggedIn, isOwnerOrFollower } = require("../middleware/auth");
const router = express.Router();
const likesService = require("../services/likes-services");

router.post("/:id", isLoggedIn, isOwnerOrFollower, async (req, res) => {
  const like = await likesService.createLike({
    user_id: req.user.id,
    tweet_id: req.params.id,
  });
  res.status(201).send(like);
});

router.delete("/:id", isLoggedIn, isOwnerOrFollower, async (req, res) => {
  const unlike = await likesService.deleteLike(req.params.id, req.user.id);
  if (!unlike) {
    res.status(404).send({ code: 404, message: "Tweet not found" });
    return;
  }
  res.status(200).send({ code: 200, message: "Tweet unliked successfully" });
});

router.get("/:id", isLoggedIn, isOwnerOrFollower, async (req, res) => {
  const likes = await likesService.getAllLikes(req.params.id);
  res.status(200).send(likes);
});
module.exports = router;
