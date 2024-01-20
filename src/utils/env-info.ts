import { LogLevel, ErrorExposureDepth } from "@src/types/index";

export function getCurrentEnv(): "development" | "production" {
    return process.env["NODE_ENV"] || "development";
}

export function getCurrentPort(): number {
    return Number(process.env["PORT"]) || 5000;
}

export function getLogLevel(): LogLevel {
    return (process.env["LOG_LEVEL"] as LogLevel) || LogLevel.DEBUG;
}

export function getErrorExposureDepth(): ErrorExposureDepth {
    return (process.env["ERROR_EXPOSURE_DEPTH"] as ErrorExposureDepth) || "BUSINESS";
}

export function getDBUrl(): string {
    return process.env["MONGODB_URL"] ?? "";
}

export function getJWTSecret(): { accessTokenSecret: string; refreshTokenSecret: string } {
    return {
        accessTokenSecret: process.env["ACCESS_TOKEN_SECRET"],
        refreshTokenSecret: process.env["REFRESH_TOKEN_SECRET"],
    };
}

export function getCacheParams(): { host: string; port: number; username: string; password: string } {
    return {
        host: process.env["REDIS_HOST"],
        port: Number(process.env["REDIS_PORT"]),
        username: process.env["REDIS_USERNAME"],
        password: process.env["REDIS_PASSWORD"],
    };
}
