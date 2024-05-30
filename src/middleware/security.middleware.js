import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import HTTPError from "../utils/HTTPError";
import { RequestHandler } from "express";

const getIP = (request) =>
  request.ip ||
  request.headers["x-forwarded-for"] ||
  request.headers["x-real-ip"] ||
  request.connection.remoteAddress;

const limit = 10;
const windowMs = 60 * 1_000;
const delayAfter = Math.round(limit / 2);
const delayMs = 500;

const middlewares = [
  slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
  rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
];

const applyMiddleware = (middleware) => (request, response) =>
  new Promise((resolve, reject) => {
    middleware(request, response, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    );
  });

async function applyRateLimit(request, response) {
  await Promise.all(
    middlewares
      .map(applyMiddleware)
      .map((middleware) => middleware(request, response))
  );
}

/**
 * @type {RequestHandler}
 */
export const ipRateLimit = async (req, res, next) => {
  try {
    await applyRateLimit(req, res);
    next();
  } catch (err) {
    throw new HTTPError("Too many requests", 429, {
      message: "Too many requests",
    });
  }
};
