import { TRADE_SERVERS } from "../config/enums";
import errorCodes from "../config/errorCodes";
import userAccountsService from "../services/userAccounts.service";
import userTokenService from "../services/userToken.service";
import { RequestHandler } from "express";

/**
 * @type {RequestHandler}
 */
export const userIsLoggedIn = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(400).json(errorCodes.noAuthorizationHeader);
  }
  let token;
  try {
    token = req.headers.authorization.split(" ")[1];
  } catch (err) {
    return res.status(400).json(errorCodes.badAuthorizationHeader);
  }
  try {
    let user = await userTokenService.verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "HTTPError") {
      res.status(err.status).json(err.responseBody);
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

/**
 * @type {RequestHandler}
 *
 * This middleware needs to be called after userIsLoggedIn and
 * the path needs to have a param for [login_id]
 */
export const userOwnsAccount = async (req, res, next) => {
  if (!req.user || !req.query.login_id) {
    console.error(
      "userOwnsLogin: req.user or req.query.login_id is missing " +
        "(call this middleware after userIsLogged in and with a route that contains account_id)"
    );
    return res.status(500).json(errorCodes.serverError);
  }
  let account = await userAccountsService.getUserAccountByLoginId(
    String(req.user._id),
    req.query.login_id,
    TRADE_SERVERS.TIO_CTRADER_LIVE_1
  );
  if (account) {
    req.userAccount = account;
    next();
  } else {
    res.status(404).json(errorCodes.userAccountNotFound);
  }
};
