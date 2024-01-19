import type { Request, Response, NextFunction } from "express";
import { getCurrentEnv } from "@src/utils/env-info";
import logger from "@src/configs/logger.config";

function customErrorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
    logger.error(`${req.method} ${req.originalUrl}: ${err.status} - ${err.message} - ${req.ip} \n%o`, err);

    const currentEnv = getCurrentEnv();

    err.status = err.status ?? 500;
    err.message = err.message ?? "INTERNAL_SERVER_ERROR";
    err.type = err.type ?? "INTERNAL_SERVER_ERROR";

    if (currentEnv === "development") {
        res.status(err.status).json({
            status: err.status,
            message: err.message,
            type: err.type,
            ...err,
            stack: err.stack,
        });
        return;
    }

    res.status(err.status).json({
        status: err.status,
        message: err.type,
    });
}

export default customErrorHandler;
