const { createClient } = require("redis");
const logger = require("@/src/configs/logger.config");
const { getCurrentCacheParams } = require("@/src/utils/env-info");

const { host, port, username, password } = getCurrentCacheParams();

const client = createClient({
    socket: {
        host,
        port,
    },
    username,
    password,
});

client.connect()

client.on("connect", () => {
    logger.info("cache server: connecting...🟨");
});

client.on("ready", () => {
    logger.info("cache server: connected...🚗");
});

client.on("error", (err) => {
    logger.error("cache server: error %o", err);
});

client.on("reconnecting", () => {
    logger.warn("cache server: reconnecting...🟨");
});

client.on("end", () => {
    logger.warn("cache server: ended...🟥");
});

process.on("SIGINT", () => {
    logger.error("cache server: connection terminated...🟥");
    client.quit();
});

module.exports = client;
