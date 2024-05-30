import errorCodes from "../config/errorCodes";
import userAccountsService from "../services/userAccounts.service";
import userRefreshTokenService from "../services/userRefreshToken.service";
import { INNOVOULT_API_KEY } from "../config/envs";
import Joi from "joi";
import { mongooseIDFunction } from "../utils/customValidation";
import { RequestHandler } from "express";

/**
 * @type {RequestHandler}
 */
export const innoVoultApiAccess = async (req, res, next) => {
  if (!req.headers["x-api-key"]) {
    return res.status(400).json({
      code: 400,
      status: false,
      message: errorCodes.noAuthorizationHeader.message,
      data: errorCodes.noAuthorizationHeader,
    });
  }
  let token = req.headers["x-api-key"];
  if (token === INNOVOULT_API_KEY) {
    next();
  } else {
    res
      .status(403)
      .json({ code: 403, status: false, message: "Invalid API key", data: {} });
  }
};

/**
 * @type {RequestHandler}
 */
export const userInnovoultAccess = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(400).json({
      code: 400,
      status: false,
      message: errorCodes.noAuthorizationHeader.message,
      data: errorCodes.noAuthorizationHeader,
    });
  }
  let token;
  try {
    token = req.headers.authorization.split(" ")[1];
  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: false,
      message: errorCodes.badAuthorizationHeader.message,
      data: errorCodes.badAuthorizationHeader,
    });
  }
  try {
    let user = userRefreshTokenService.validateJWT(token);
    if (!user) {
      return res.status(401).json({
        code: 401,
        status: false,
        message: errorCodes.invalidUserToken.message,
        data: errorCodes.invalidUserToken,
      });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "HTTPError") {
      res.status(err.status).json({
        code: err.status,
        status: false,
        message: err.responseBody.message,
        data: err.responseBody,
      });
    } else {
      res.status(500).json({
        code: 500,
        status: false,
        message: "Internal server error",
        data: {},
      });
    }
  }
};

const mongooseIdValidator = Joi.string().custom(mongooseIDFunction).required();
/**
 * @type {RequestHandler}
 *
 * This middleware needs to be called after userIsLoggedIn and
 * the path needs to have a param for [login_id]
 */
export const innovoultUserOwnsAccount = async (req, res, next) => {
  if (!req.user || !req.query.accountId) {
    console.error(
      "userOwnsLogin: req.user or req.query.accountId is missing " +
        "(call this middleware after userIsLogged in and with a route that contains account_id)"
    );
    return res.status(500).json({
      code: 400,
      status: false,
      message: errorCodes.serverError.message,
      data: errorCodes.serverError,
    });
  }

  const { error } = mongooseIdValidator.validate(req.query.accountId);
  if (error) {
    return res.status(400).json({
      code: 400,
      status: false,
      message: "Validation error",
      data: error,
    });
  }

  let account = await userAccountsService.getUserAccountById(
    String(req.user._id),
    req.query.accountId
  );
  if (account) {
    req.userAccount = account;
    next();
  } else {
    res.status(404).json(errorCodes.userAccountNotFound);
  }
};
