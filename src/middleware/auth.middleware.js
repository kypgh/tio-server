import jwt from "jsonwebtoken";
import { CRM_JWT_SECRET } from "../config/envs";
import errorCodes from "../config/errorCodes";
import ctraderAPITokenService from "../services/ctraderAPIToken.service";
import { RequestHandler } from "express";
import Joi from "joi";
import { TIO_BRANDS } from "../config/enums";
import usersService from "../services/users.service";
import { mongooseIDFunction } from "../utils/customValidation";

/**
 * @type {RequestHandler}
 */
export const isCRMUser = async (req, res, next) => {
  let headers = req.headers;
  if (!headers?.authorization) {
    return res.status(401).json({
      message: "No authorization header found",
    });
  }
  let token_header = headers["authorization"].split(" ");
  if (token_header.length !== 2 || token_header[0] !== "Bearer") {
    return res.status(400).json({ message: "Bad authorization header" });
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
  return next();
};

/**
 * @type {RequestHandler}
 */
//prettier-ignore
export const ctraderAPIAccess = async (req, res, next) => {
  if (!req.query && !req.query.crmApiToken) return res.status(403).json({ message: "No token provided" });
  const valid = await ctraderAPITokenService.validateToken(req.query.crmApiToken);
  if (!valid) return res.status(403).json({ message: "Invalid token" });
  next();
};

const BrandRequestSchema = Joi.object({
  brand: Joi.string()
    .valid(...Object.values(TIO_BRANDS))
    .required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const checkBrandAccess = async (req, res, next) => {
  const { error, value } = BrandRequestSchema.validate(req.query);
  if (error) {
    return res.status(400).json(error);
  }
  if (req.crm_user.selectedBrand === value.brand) {
    req.selectedBrand = value.brand;
    req.allowedCountries = req.crm_user?.enable_country_whitelist
      ? req.crm_user?.whitelist_countries
      : null;
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Permission denied switch user brand" });
  }
};

const crmAccessToUserIdSchema = Joi.object({
  brand: Joi.string()
    .valid(...Object.values(TIO_BRANDS))
    .required(),
  user_id: Joi.string().custom(mongooseIDFunction).required(),
}).unknown(true);

export const checkAccessToUserId = async (req, res, next) => {
  const { error, value } = crmAccessToUserIdSchema.validate(req.query);
  if (error) {
    return res.status(400).json(error);
  }
  const user = await usersService.getUserById(value.user_id);
  if (req.crm_user.brands && req.crm_user.brands.includes(value.brand)) {
    req.selectedBrand = value.brand;
    if (user.brand !== value.brand) {
      return res.status(404).json({ message: "User not found" });
    } else {
      if (
        req.allowedCountries &&
        !req.allowedCountries.includes(user.country)
      ) {
        return res
          .status(403)
          .json({ message: "Permission denied for this country" });
      }
      next();
    }
  } else {
    return res.status(403).json({ message: "Permission denied" });
  }
};
