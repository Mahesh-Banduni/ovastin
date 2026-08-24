import pino from "pino";
import config from "../config/config";

const logger = pino({
  level: config.env === "development"
    ? "debug"
    : "info",

  base: {
    service: "fastify-api"
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  // Spread instead of assigning `undefined`: exactOptionalPropertyTypes
  // forbids explicitly passing `undefined` to optional properties.
  ...(config.env === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname"
          }
        }
      }
    : {})
});

export default logger;