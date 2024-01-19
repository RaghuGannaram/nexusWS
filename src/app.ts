import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import createError from "http-errors";

import "@src/configs/cache.config";
import "@src/configs/db.config";

import morganMiddleware from "@src/middlewares/morgan.middleware";
import customErrorHandler from "@src/middlewares/custom-error-handler.middleware";
import api_v1 from "@src/api/v1";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/health-check", (_req: Request, res: Response) => {
    res.status(200).json({ message: "OK" });
});

app.use("/api/v1", api_v1);

app.use(function (_req: Request, _res: Response, next: NextFunction) {
    next(createError(404));
});

app.use(customErrorHandler);

export default app;
