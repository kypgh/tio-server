import { RequestHandler } from "express";
import {
  MT4_WEBHOOK_ALLOWED_API_KEY,
  MT5_WEBHOOK_ALLOWED_API_KEY,
} from "../config/envs";

/**
 * @param {[string]} ALLOWED_API_KEYS
 * @returns {RequestHandler}
 */
export const isValidAPIKey = (ALLOWED_API_KEYS) => (req, res, next) => {
  if (!req?.headers?.["x-api-key"]) {
    return res.status(401).json({
      message: "No authorization 'x-api-key' header found",
    });
  }
  let key = req.headers["x-api-key"];
  if (!ALLOWED_API_KEYS.includes(key)) {
    return res.status(400).json({ message: "Invalid API key" });
  }
  return next();
};

export const mt5WebhookAccess = isValidAPIKey([MT5_WEBHOOK_ALLOWED_API_KEY]);
export const mt4WebhookAccess = isValidAPIKey([MT4_WEBHOOK_ALLOWED_API_KEY]);
