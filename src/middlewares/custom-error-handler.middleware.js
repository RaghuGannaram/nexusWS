const { getCurrentEnv } = require("@/src/utils/env-info");
const logger = require("@/src/configs/logger.config");

function customErrorHandler(err, req, res, next) {
    logger.error(`${req.method} ${req.originalUrl}: ${err.status} - ${err.message} - ${req.ip} \n%o`, err.stack);

    const currentEnv = getCurrentEnv();

    if (err.name === "MongoError") {
        if (err.code === 11000) {
            err.status = 409;
            if (Object.keys(err.keyValue).includes("email")) {
                err.message = "Conflict";
                err.type = "EMAIL_ALREADY_REGISTERED";
                err.description = "Email already registered. Please log in.";
            } else if (Object.keys(err.keyValue).includes("username")) {
                err.message = "Conflict";
                err.type = "USERNAME_ALREADY_TAKEN";
                err.description = "Username already taken. Please try another one.";
            } else {
                err.message = "Conflict";
                err.type = "DUPLICATE_KEY_ERROR";
                err.description = "Duplicate key error in the database.";
            }
        } else if (err.type === 11001) {
            err.status = 409;
            err.message = "Conflict";
            err.type = "DUPLICATE_KEY_UNIQUE";
            err.description = "Duplicate key error: unique constraint violated.";
        } else if (err.type === 12500) {
            err.status = 500;
            err.message = "Internal database error";
            err.type = "DB_EXECUTION_INTERRUPTED";
            err.description = "Database execution interrupted.";
        } else if (err.type === 12000) {
            err.status = 500;
            err.message = "Internal database error";
            err.type = "DB_WRITE_OPERATION_FAILED";
            err.description = "MongoDB write operation failed.";
        } else {
            err.status = 500;
            err.message = "Internal database error";
            err.type = "INTERNAL_DATABASE_ERROR";
            err.description = "Internal database error.";
        }
    }

    if (err.name === "JsonWebTokenError") {
        err.status = 401;
        if (err.message === "jwt malformed") {
            err.message = "Unauthorized";
            err.type = "JWT_MALFORMED";
            err.description = "Invalid token format.";
        } else if (err.message === "invalid signature") {
            err.message = "Unauthorized";
            err.type = "INVALID_SIGNATURE";
            err.description = "Invalid token signature.";
        } else if (err.message === "jwt expired") {
            err.message = "Unauthorized";
            err.type = "TOKEN_EXPIRED";
            err.description = "Token has expired. Please log in again.";
        } else if (err.message === "jwt not active") {
            err.message = "Unauthorized";
            err.type = "TOKEN_NOT_ACTIVE";
            err.description = "jwt not active";
        } else {
            err.message = "Unauthorized";
            err.type = "INVALID_TOKEN";
            err.description = "Invalid or expired token.";
        }
    }

    if (err.isJoi === true) {
        err.status = 422;
        err.message = "Unprocessable Entity";
        err.type = "VALIDATION_ERROR";
        err.description = "Validation failed. Check your request data.";
    }

    err.status = err.status ?? 500;
    err.message = err.message ?? "Internal Server Error";
    err.type = err.type ?? "INTERNAL_SERVER_ERROR";
    err.description = err.description ?? "Internal server error.";

    if (currentEnv === "production") {
        res.status(err.status).json({
            status: err.status,
            message: err.message
        });
        return;
    }

    res.status(err.status).json({
        status: err.status,
        message: err.message,
        type: err.type,
        description: err.description,
        ...err,
        stack: err.stack
    });
}

module.exports = customErrorHandler;
