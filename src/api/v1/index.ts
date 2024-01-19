import express from "express";
import type { Router } from "express";

import authRouter from "@src/routes/auth.route";
import userRouter from "@src/routes/user.route";
import postRouter from "@src/routes/post.route";

const router: Router = express.Router();

router.use("/auth", authRouter);

router.use("/user", userRouter);

router.use("/post", postRouter);

export default router;
