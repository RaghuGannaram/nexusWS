const mongoose = require("mongoose");
const chalk = require("chalk");
const { getCurrentDBUrl, getCurrentEnv } = require("@/src/utils/env-info");
const logger = require("@/src/configs/logger.config");

const mongoURL = getCurrentDBUrl();
const currentEnv = getCurrentEnv();

const dbConfig = {
    development: {
        bufferCommands: true,
        // bufferTimeoutMS: 1500,
        family: 4,
        maxPoolSize: 100,
        socketTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        serverSelectionTimeoutMS: 5000,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    production: {
        autoIndex: false,
        autoCreate: false,
        bufferCommands: false,
        minimize: false,
        family: 4,
        maxPoolSize: 100,
        socketTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        serverSelectionTimeoutMS: 30000,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
};

const mongoOptions = dbConfig[process.env.NODE_ENV];

const connectCallback = function (err, data) {
    if (err) {
        logger.error("database server: Unable to connect to Database...🙁");
        throw err;
    }

    const { name, host, port, models } = data.connections[0];

    logger.info("database server: successful...🍃");
    logger.info(`database server: host: ${chalk.magenta(host)}:${chalk.magenta(port)}`);
    logger.info(`database server: name: ${chalk.magenta(name)}, models: %o`, models);
};

mongoose.set("debug", currentEnv === "development");
mongoose.connect(mongoURL, mongoOptions, connectCallback);

const db = mongoose.connection;

db.on("connecting", () => {
    logger.info("database server: connecting...");
});

db.on("connected", () => {
    logger.info("database server: connected...");
});

db.on("open", () => {
    logger.info("database server: open...");
});

db.on("disconnected", () => {
    logger.error("database server: disconnected...");
});

db.on("error", () => {
    logger.error("database server: error...");
});

db.on("close", () => {
    logger.error("database server: closed...");
});

db.on("reconnected", () => {
    logger.info("database server: reconnected...");
});

db.on("reconnectFailed", () => {
    logger.error("database server: reconnection failed...");
});

process.on("SIGINT", () => {
    logger.error("database server: connection terminated...🟥");
    db.close();
});

module.exports = db;
