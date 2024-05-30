import jwt from "jsonwebtoken";
import {
  CRM_JWT_SECRET,
  TIO_SCHEDULED_TASKS_ALLOWED_API_KEYS,
} from "../../../../config/envs";
import errorCodes from "../../../../config/errorCodes";
import { RequestHandler } from "express";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  /**
   *  This is a middleware function that checks if the request has a valid JWT token
   *  and checks the api key from the header
   *  It is used in the tio-scheduled-tasks project to check that the request originated from the
   *  tio-scheduled-tasks project
   */
  let headers = req.headers;
  const apiKey = req.headers["x-api-key"];
  if (!TIO_SCHEDULED_TASKS_ALLOWED_API_KEYS.includes(apiKey)) {
    return res.status(401).json("Invalid API key");
  }

  if (!headers?.authorization) {
    return res.status(401).json("No authorization header found");
  }

  let token_header = headers["authorization"].split(" ");
  if (token_header.length !== 2 || token_header[0] !== "Bearer") {
    return res.status(400).json("Bad authorization header");
  }

  let token = token_header[1];
  let decoded_token;

  try {
    decoded_token = jwt.verify(token, CRM_JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json(errorCodes.expiredJWT);
    }
    return res.status(400).json(errorCodes.invalidJWT);
  }

  req.crm_user = decoded_token;
  res.status(200).json(req.crm_user);
};
