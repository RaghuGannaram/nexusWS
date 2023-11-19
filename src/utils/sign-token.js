const JWT = require("jsonwebtoken");
const client = require("@/src/configs/cache.config");
const { getCurrentJWTSecret } = require("@/src/utils/env-info");
const CustomError = require("@/src/utils/custom-error");

const { accessTokenSecret, refreshTokenSecret } = getCurrentJWTSecret();

const signAccessToken = async (user) => {
    const payload = {
        id: user.id,
        name: user.name ?? `${user.firstname} ${user.lastname}`,
        handle: user.handle ?? user.username,
        email: user.email,
        role: user.role,
        type: "access",
    };
    const options = {
        expiresIn: "1h",
        issuer: "nexus.raghugannaram.com",
        audience: user.id,
    };

    const token = JWT.sign(payload, accessTokenSecret, options);
    await client.SET(`access:${user.id}`, token, { EX: 60 * 60 });
    return token;
};

const signRefreshToken = async (user) => {
    const payload = {
        id: user.id,
        name: user.name ?? `${user.firstname} ${user.lastname}`,
        handle: user.handle ?? user.username,
        email: user.email,
        role: user.role,
        type: "refresh",
    };
    const options = {
        expiresIn: "1y",
        issuer: "nexus.raghugannaram.com",
        audience: user.id,
    };

    const token = JWT.sign(payload, refreshTokenSecret, options);
    await client.SET(`refresh:${user.id}`, token, { EX: 365 * 24 * 60 * 60 });

    return token;
};

const verifyRefreshToken = async (refreshToken) => {
    const decoded = JWT.verify(refreshToken, refreshTokenSecret);

    if (decoded.type !== "refresh")
        throw new CustomError("Bad Request", 400, "INVALID_TOKEN_TYPE", "Invalid token type");

    const result = await client.GET(`refresh:${decoded.id}`);

    if (refreshToken !== result) throw new CustomError("Unauthorized", 401, "INVALID_TOKEN", "Invalid refresh token");

    return decoded;
};

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
};
