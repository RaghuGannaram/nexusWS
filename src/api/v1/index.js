const express = require("express");

const authRouter = require("@/src/routes/auth.route");
const userRouter = require("@/src/routes/user.route");
const postRouter = require("@/src/routes/post.route");

const router = express.Router();

router.use("/auth", authRouter);

router.use("/user", userRouter);

router.use("/post", postRouter);

module.exports = router;
