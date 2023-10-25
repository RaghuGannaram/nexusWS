const JWT = require("jsonwebtoken");
const client = require("@/src/configs/cache.config");
const CustomError = require("@/src/utils/custom-error");
const catchAsyncError = require("@/src/middlewares/catch-async-error.middleware");
const { getCurrentJWTSecret } = require("@/src/utils/env-info");

const { accessTokenSecret } = getCurrentJWTSecret();

const verifyAccessToken = catchAsyncError(async (req, res, next) => {
    let token = req.headers["authorization"] || '';
    if (!token.startsWith("Bearer ")) throw new CustomError("Token Error", 400, "invalid_field", { message: "Invalid token format" });
    token = token.slice(7);

    const decoded = await JWT.verify(token, accessTokenSecret);
    if (decoded.type !== "access") throw new CustomError("Token Error", 400, "invalid_field", { message: "Invalid token type" });

    const validAccessToken = await client.GET(`access:${decoded.id}`);
    if (token !== validAccessToken) throw new CustomError("Token Error", 401, "invalid_data", { message: "Invalid access token" });

    req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
    }

    next();
});



module.exports = verifyAccessToken;
