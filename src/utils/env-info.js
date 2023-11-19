function getCurrentEnv() {
    return process.env.NODE_ENV || "development";
}

function getCurrentPort() {
    return process.env.PORT || 5000;
}

function getCurrentLogLevel() {
    return process.env.LOG_LEVEL || "debug";
}

function getCurrentDBUrl() {
    return process.env.MONGODB_URL;
}

function getCurrentJWTSecret() {
    return {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    };
}

function getCurrentCacheParams() {
    return {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    };
}

module.exports = {
    getCurrentEnv,
    getCurrentPort,
    getCurrentLogLevel,
    getCurrentDBUrl,
    getCurrentJWTSecret,
    getCurrentCacheParams,
};
