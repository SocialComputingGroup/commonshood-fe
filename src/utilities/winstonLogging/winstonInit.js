import * as winston from "winston";
import BrowserConsole from "winston-transport-browserconsole";
import config from "../../config";

export const logger = winston.createLogger({
    level: config.logging.level, //log only if info.level is < of this
    format: winston.format.json(),
    //defaultMeta: {service: 'user-service'},
    transports: [
        new BrowserConsole({
            format: winston.format.simple(), // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
            level: config.logging.level, //browserConsole requires this repetition, see related github
        })
    ]
});