const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
require("dotenv").config();

require("@/src/configs/cache.config");
require("@/src/configs/db.config");

const morganMiddleware = require("@/src/middlewares/morgan.middleware");
const customErrorHandler = require("@/src/middlewares/custom-error-handler.middleware");

const authRouter = require("@/src/routes/auth.route");
const userRouter = require("@/src/routes/user.route");
const postRouter = require("@/src/routes/post.route");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/health-check",  (req, res,) => {
    res.status(200).json({ message: "OK" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(customErrorHandler);

module.exports = app;
