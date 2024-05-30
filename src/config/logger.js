import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import expressWinston from "express-winston";
import winston from "winston";
import chalk from "chalk";
import { LOGGER_ENV, LOGTAIL_SOURCE_TOKEN } from "../config/envs";
import UrlPattern from "url-pattern";

// Create a Winston logger - passing in the Logtail transport
export const loggerConsole = expressWinston.logger({
  ignoredRoutes: [
    "/",
    "/api/webhooks/mt5/trades/orders",
    "/api/webhooks/mt5/trades/deals",
    "/api/webhooks/mt5/trades/positions",
  ],
  ignoreRoute: (req, res) => {
    if (
      new UrlPattern("/api/webhooks/mt5/accounts/:loginId/syncBalance").match(
        req.url
      )
    )
      return true;
    return false;
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        // Add the message timestamp with the preferred format
        winston.format.timestamp({ format: "HH:mm:ss" }),
        // Tell Winston that the logs must be colored
        // Define the format of the message showing the timestamp, the level and the message
        winston.format.printf((info) => {
          let statusCode = info.meta?.res?.statusCode;
          if (statusCode >= 500) {
            statusCode = chalk.red(statusCode);
          } else if (statusCode >= 400) {
            statusCode = chalk.yellow(statusCode);
          } else if (statusCode >= 300) {
            statusCode = chalk.blue(statusCode);
          } else if (statusCode >= 200) {
            statusCode = chalk.green(statusCode);
          }
          return `${info.timestamp} [${statusCode}]: ${info.message}`;
        })
      ),
    }),
  ],
});

export const loggerLogtail = !!LOGTAIL_SOURCE_TOKEN
  ? expressWinston.logger({
      ignoredRoutes: ["/"],
      dynamicMeta: (req, res) => {
        let extra = {
          environment_type: LOGGER_ENV,
        };
        if (req.user) {
          extra.user = req.user;
        }
        if (req.userAccount) {
          extra.userAccount = req.userAccount;
        }
        if (req.crm_user) {
          extra.crm_user = req.crm_user;
        }
        return extra;
      },
      level: (req, res) => {
        if (res.statusCode >= 500) {
          return "error";
        } else if (res.statusCode >= 400) {
          return "warn";
        } else if (res.statusCode >= 300) {
          return "info";
        } else if (res.statusCode >= 200) {
          return "info";
        }
        return "info";
      },
      responseWhitelist: ["statusCode", "body"],
      bodyBlacklist: ["password", "newPassword", "confirmPassword"],
      transports: [
        new LogtailTransport(new Logtail(LOGTAIL_SOURCE_TOKEN), {
          silent: true,
        }),
      ],
    })
  : (req, res, next) => next();
