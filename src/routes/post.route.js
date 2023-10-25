const express = require("express");
const postController = require("@/src/controllers/post.controller");
const verifyAccessToken = require("@/src/middlewares/token.middleware");

const router = express.Router();

router.get("/all", postController.getAllPosts);

router.get("/timeline", verifyAccessToken, postController.getTimelinePosts);

router.get("/personal/:userId", postController.getPersonalPosts);


router.get("/:postId", postController.getPost);

router.post("/", verifyAccessToken, postController.addPost);

router.put("/:postId", verifyAccessToken, postController.updatePost);

router.delete("/:postId", verifyAccessToken, postController.deletePost);


router.get("/comment/:postId", postController.getComments);

router.post("/comment/:postId", verifyAccessToken, postController.addComment);

router.put("/comment/:postId/:commentId", verifyAccessToken, postController.updateComment);

router.delete("/comment/:postId/:commentId", verifyAccessToken, postController.deleteComment);


router.put("/like/:postId", verifyAccessToken, postController.likePost);

router.put("/comment-like/:postId/:commentId", verifyAccessToken, postController.likeComment);


module.exports = router;
