import { RequestHandler } from "express";
import errorCodes from "../config/errorCodes";
import universalTokensService from "../services/universalTokens.service";

/**
 * @type {RequestHandler}
 */
export const isMembersAreaUser = async (req, res, next) => {
  let headers = req.headers;
  if (!headers?.authorization) {
    return res.status(401).json(errorCodes.jwtAuthenticationError);
  }
  let token_header = headers["authorization"].split(" ");
  if (token_header.length !== 2 || token_header[0] !== "Bearer") {
    return res.status(401).json(errorCodes.jwtAuthenticationError);
  }

  let token = token_header[1];
  const { isValid, user } = await universalTokensService.verifyJWT(token);
  if (!isValid) {
    return res.status(401).json(errorCodes.jwtAuthenticationError);
  }
  req.user = user;
  next();
};
