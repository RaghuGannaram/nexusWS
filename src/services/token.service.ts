import JWT from "jsonwebtoken";
import client from "@src/configs/cache.config";
import { getCurrentJWTSecret } from "@src/utils/env-info";
import { DataError, DataErrors, throwDataError, processTokenError } from "@src/utils/application-errors";
import type { ITokenPayload } from "@src/types";

const { accessTokenSecret, refreshTokenSecret } = getCurrentJWTSecret();

export const issueAccessToken = async (user: ITokenPayload) => {
    try {
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
        try {
            await client.SET(`access:${user.id}`, token, { EX: 60 * 60 });
        } catch (error) {
            throw new DataError(DataErrors.CACHE_READ_WRITE_ERROR, error as Error);
        }
        return token;
    } catch (error) {
        throwDataError(error);
    }
};

export const issueRefreshToken = async (user: ITokenPayload) => {
    try {
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
        try {
            await client.SET(`refresh:${user.id}`, token, { EX: 365 * 24 * 60 * 60 });
        } catch (error) {
            throw new DataError(DataErrors.CACHE_READ_WRITE_ERROR, error as Error);
        }

        return token;
    } catch (error) {
        throwDataError(error);
    }
};

export const validateAccessToken = async (accessToken: string) => {
    try {
        let decoded;

        try {
            decoded = JWT.verify(accessToken, accessTokenSecret) as ITokenPayload;
        } catch (error) {
            processTokenError(error);
        }

        let storedAccessToken: string | null = null;
        try {
            storedAccessToken = await client.GET(`access:${decoded.id}`);
        } catch (error) {
            throw new DataError(DataErrors.CACHE_READ_WRITE_ERROR, error as Error);
        }

        if (accessToken !== storedAccessToken) throw new DataError(DataErrors.INVALID_TOKEN, "invalid access token");

        return decoded;
    } catch (error) {
        throwDataError(error);
    }
};

export const validateRefreshToken = async (refreshToken: string) => {
    try {
        let decoded;

        try {
            decoded = JWT.verify(refreshToken, refreshTokenSecret) as ITokenPayload;
        } catch (error) {
            processTokenError(error);
        }

        let storedRefreshToken: string | null = null;
        try {
            storedRefreshToken = await client.GET(`refresh:${decoded.id}`);
        } catch (error) {
            throw new DataError(DataErrors.CACHE_READ_WRITE_ERROR, error as Error);
        }

        if (refreshToken !== storedRefreshToken) throw new DataError(DataErrors.INVALID_TOKEN, "invalid refresh token");

        return decoded;
    } catch (error) {
        throwDataError(error);
    }
};
