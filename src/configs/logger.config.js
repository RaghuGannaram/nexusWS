const winston = require("winston");
const chalk = require("chalk");
const util = require("util");
const { getCurrentLogLevel } = require("@/src/utils/env-info");

const { addColors, createLogger, format, transports } = winston;

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    verbose: "cyan",
    debug: "blue",
    silly: "pink",
};

addColors(colors);

const level = getCurrentLogLevel();

const consoleLogFormat = format.printf(({ level, message, timestamp, stack }) => {
    const colorizedTimestamp = chalk.gray(timestamp);
    const formattedMessage = typeof message === "object" ? util.inspect(message) : message;
    const colorizedStack = stack ? chalk.red(stack) : "";

    let logMessage = `${colorizedTimestamp} ${level} ${formattedMessage}`;

    if (stack) {
        logMessage += `\n${colorizedStack}`;
    }

    return logMessage;
});

const fileLogFormat = format.printf(({ level, message, timestamp }) => {
    const unColoredMessage = message.replace(/\x1B\[\d+m/g, '');
    const formattedMessage = typeof unColoredMessage === "object" ? util.inspect(unColoredMessage) : unColoredMessage;

    return `${timestamp} ${level}: ${formattedMessage}`;
});

const options = {
    level: level,
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.splat(),
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
                format.errors({ stack: true }),
                consoleLogFormat
            ),
        }),
        new transports.File({
            filename: "logs/error.log",
            format: format.combine(
                format.splat(),
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
                format.errors({ stack: true }),
                fileLogFormat
            ),
            level: "error",
        }),
        new transports.File({
            filename: "logs/out.log",
            format: format.combine(
                format.splat(),
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
                format.errors({ stack: true }),
                fileLogFormat
            ),
        }),
    ],
};

const logger = createLogger(options);

module.exports = logger;
