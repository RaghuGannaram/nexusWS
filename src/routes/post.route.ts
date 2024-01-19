import express, { type Router } from "express";
import postController from "@src/controllers/post.controller";
import authenticate from "@src/middlewares/auth.middleware";

const router: Router = express.Router();

router.get("/all", postController.getAllPosts);

router.get("/timeline", authenticate, postController.getTimelinePosts);

router.get("/personal/:userId", postController.getPersonalPosts);


router.get("/:postId", postController.getPost);

router.post("/", authenticate, postController.addPost);

router.put("/:postId", authenticate, postController.updatePost);

router.delete("/:postId", authenticate, postController.deletePost);


router.get("/comment/:postId", postController.getComments);

router.post("/comment/:postId", authenticate, postController.addComment);

router.put("/comment/:postId/:commentId", authenticate, postController.updateComment);

router.delete("/comment/:postId/:commentId", authenticate, postController.deleteComment);


router.put("/like/:postId", authenticate, postController.likePost);

router.put("/comment-like/:postId/:commentId", authenticate, postController.likeComment);


export default router;
