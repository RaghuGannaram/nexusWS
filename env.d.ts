declare module NodeJS {
    interface ProcessEnv {
        NODE_ENV: "development" | "production";
        PORT: string;
        MONGODB_URL: string;
        REDIS_HOST: string;
        REDIS_PORT: string;
        REDIS_USERNAME: string;
        REDIS_PASSWORD: string;
        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;
        LOG_LEVEL: string;
    }
}
