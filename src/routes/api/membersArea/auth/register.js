import { RequestHandler } from "express";
import Joi from "joi";
import { countryDataCodes } from "../../../../config/countries";
import {
  LANGUAGE_CODES,
  TIO_BRANDS,
  TIO_ENTITIES,
} from "../../../../config/enums";
import errorCodes from "../../../../config/errorCodes";
import twilioSmsService from "../../../../services/twilioSms.service";
import universalTokensService from "../../../../services/universalTokens.service";
import userLogsService from "../../../../services/userLogs.service";
import usersService from "../../../../services/users.service";
import { passwordFunction } from "../../../../utils/customValidation";
import HTTPError from "../../../../utils/HTTPError";
import utilFunctions from "../../../../utils/util.functions";

const maRegisterSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().custom(passwordFunction).required(),
  phone: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  country: Joi.string()
    .valid(...countryDataCodes.map((val) => val.iso2.toUpperCase()))
    .required(),
  terms: Joi.boolean(),
  // phone_otp: Joi.string().required(),
  metadata: Joi.object(),
  language: Joi.string()
    .valid(...Object.values(LANGUAGE_CODES))
    .default(LANGUAGE_CODES.en),
  entity: Joi.string()
    .valid(...Object.values(TIO_ENTITIES))
    .required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request body
  const { value, error } = maRegisterSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }

  let existing_user = await usersService.getUserByEmailEntity({
    ...value,
    brand: TIO_BRANDS.TIO,
  });
  if (existing_user) {
    throw new HTTPError(
      "User already exists",
      400,
      errorCodes.userAlreadyExists
    );
  }
  // Verify phone one time password
  // const verify_phone_otp = await twilioSmsService.verifyOTP(
  //   value.phone,
  //   value.phone_otp
  // );
  // if (!verify_phone_otp.valid) {
  //   throw new HTTPError("Invalid phone OTP", 400, errorCodes.invalidPhoneOTP);
  // }
  // Business logic
  let createdUser = await usersService.createUser({
    ...value,
    brand: TIO_BRANDS.TIO,
  });
  let user = await usersService.getUserById(createdUser._id);
  const normalizedUser = utilFunctions.decimal2JSONReturn(user.toJSON());
  const jwt = await universalTokensService.createJWT(normalizedUser);
  const accessToken = await universalTokensService.createAccessToken(user);
  await userLogsService.USER_ACTIONS.registered(user);
  res.status(201).json({ user: normalizedUser, jwt, accessToken });
};
