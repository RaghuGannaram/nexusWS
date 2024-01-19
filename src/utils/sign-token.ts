import JWT from "jsonwebtoken";
import client from "@src/configs/cache.config";
import { getCurrentJWTSecret } from "@src/utils/env-info";
import CustomError from "@src/utils/application-errors";
import type { ITokenPayload } from "@src/types";

const { accessTokenSecret, refreshTokenSecret } = getCurrentJWTSecret();

export const signAccessToken = async (user: ITokenPayload) => {
    const payload = {
        id: user.id,
        name: user.name,
        handle: user.handle,
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

export const signRefreshToken = async (user: ITokenPayload) => {
    const payload = {
        id: user.id,
        name: user.name,
        handle: user.handle,
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

export const verifyRefreshToken = async (refreshToken: string) => {
    const decoded = JWT.verify(refreshToken, refreshTokenSecret) as ITokenPayload;

    const storedRefreshToken = await client.GET(`refresh:${decoded.id}`);

    if (refreshToken !== storedRefreshToken)
        throw new CustomError("Unauthorized", 401, "INVALID_TOKEN", "Invalid refresh token");

    return decoded;
};
