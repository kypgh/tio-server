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
import emailService from "../../../../services/email.service";
import userAccountsService from "../../../../services/userAccounts.service";
import { CTRADER_ACCOUNT_TYPES } from "../../../../config/accountTypes";

const maRegisterSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().custom(passwordFunction).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone: Joi.string().required(),
  country: Joi.string()
    .valid(...countryDataCodes.map((val) => val.iso2.toUpperCase()))
    .required(),
  terms: Joi.boolean(),
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
  let existingUser = await usersService.getUserByEmailEntity({
    email: value.email,
    entity: value.entity,
    brand: TIO_BRANDS.PIX,
  });
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }
  // Business logic
  const user = await usersService.createUser({
    ...value,
    brand: TIO_BRANDS.PIX,
  });
  const verifyEmailToken = await universalTokensService.createVerifyEmailToken(
    user._id
  );
  await emailService.emailVerifyEmail({ user, verifyEmailToken });
  await userLogsService.USER_ACTIONS.registered(user);
  res.status(201).json({ message: "Successfully registered" });
};
