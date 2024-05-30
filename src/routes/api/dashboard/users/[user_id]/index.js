import errorCodes from "../../../../../config/errorCodes";
import usersService from "../../../../../services/users.service";
import {
  checkAccessToUserId,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import HTTPError from "../../../../../utils/HTTPError";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../config/permissions";
import { mongooseIDFunction } from "../../../../../utils/customValidation";
import { LANGUAGE_CODES } from "../../../../../config/enums";
import { countryDataCodes } from "../../../../../config/countries";
import { RequestHandler } from "express";
import Joi from "joi";
import utilFunctions from "../../../../../utils/util.functions";

const UserDetailsSchema = Joi.object({
  user_id: Joi.string().custom(mongooseIDFunction).required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = UserDetailsSchema.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid request body", 400, {
      ...error,
      ...errorCodes.invalidRequest,
    });
  }
  // Business logic
  const user = await usersService.getUserById(value.user_id);
  let userObj = utilFunctions.decimal2JSONReturn(user.toJSON());
  res.status(200).json({ user: userObj });
};

const updateUserDetailsSchema = Joi.object({
  user_id: Joi.string().custom(mongooseIDFunction).required(),
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  country: Joi.string()
    .valid(...countryDataCodes.map((val) => val.iso2.toUpperCase()))
    .required(),
  language: Joi.string().valid(...Object.values(LANGUAGE_CODES)),
  deviceType: Joi.string().valid("iOS", "android", "win"),
  city: Joi.string().trim().allow(""),
  title: Joi.string().trim().allow(""),
  gender: Joi.string().trim().allow(""),
  dob: Joi.date().allow(""),
  nationality: Joi.string().trim().allow(""),
  identificationNumber: Joi.string().trim().allow(""),
  address: Joi.string().trim().allow(""),
  houseNumber: Joi.string().trim().allow(""),
  unitNumber: Joi.string().trim().allow(""),
  postcode: Joi.string().trim().allow(""),
  shariaEnabled: Joi.boolean(),
  secondaryEmail: Joi.string().email().allow(""),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  const { error, value } = updateUserDetailsSchema.validate({
    ...req.body,
    user_id: req.query.user_id,
  });
  if (error) {
    throw new HTTPError("Invalid request body", 400, {
      ...error,
      ...errorCodes.invalidRequestBody,
    });
  }
  const user = await usersService.getUserById(value.user_id);
  if (!user) {
    throw new HTTPError("User not found", 404, {
      message: "User with that id not found",
    });
  }
  if (value.secondaryEmail) {
    const emailInUse = await usersService.getUserByEmailEntity({
      email: value.secondaryEmail,
      brand: user.brand,
      entity: user.entity,
    });
    if (emailInUse && emailInUse._id.toString() !== user._id.toString()) {
      throw new HTTPError("Secondary email already in use", 409, {
        message: "Secondary email already in use",
      });
    }
  }
  const result = await usersService.updateUserDetails(value);
  res.status(201).json(result);
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    get: [userHasAnyPermission([PERMISSIONS.USERS.get_user])],
    put: [userHasAnyPermission([PERMISSIONS.USERS.update_user])],
  },
};
