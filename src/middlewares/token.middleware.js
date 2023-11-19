const JWT = require("jsonwebtoken");
const client = require("@/src/configs/cache.config");
const CustomError = require("@/src/utils/custom-error");
const catchAsyncError = require("@/src/middlewares/catch-async-error.middleware");
const { getCurrentJWTSecret } = require("@/src/utils/env-info");

const { accessTokenSecret } = getCurrentJWTSecret();

const verifyAccessToken = catchAsyncError(async (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) throw new CustomError("Unauthorized", 401, "TOKEN_NOT_FOUND", "Access token not provided");

    if (!token.startsWith("Bearer "))
        throw new CustomError("Unauthorized", 401, "INVALID_TOKEN_SCHEME", "Invalid authorization scheme.");

    token = token.slice(7);

    const decoded = JWT.verify(token, accessTokenSecret);

    if (decoded.type !== "access")
        throw new CustomError("Unauthorized", 401, "INVALID_TOKEN_TYPE", "Invalid token type.");

    const validAccessToken = await client.GET(`access:${decoded.id}`);
    if (token !== validAccessToken)
        throw new CustomError("Unauthorized", 401, "TOKEN_FLUSHED", "Token has been flushed, Please login again.");

    req.user = {
        id: decoded.id,
        name: decoded.name,
        handle: decoded.handle,
        email: decoded.email,
        role: decoded.role,
    };

    next();
});

module.exports = verifyAccessToken;
