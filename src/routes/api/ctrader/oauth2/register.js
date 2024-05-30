import { RequestHandler } from "express";
import Joi from "joi";
import { countryDataCodes } from "../../../../config/countries";
import errorCodes from "../../../../config/errorCodes";
import otTokenService from "../../../../services/otToken.service";
import twilioSmsService from "../../../../services/twilioSms.service";
import userLogsService from "../../../../services/userLogs.service";
import usersService from "../../../../services/users.service";
import userTokenService from "../../../../services/userToken.service";
import { passwordFunction } from "../../../../utils/customValidation";
import HTTPError from "../../../../utils/HTTPError";

const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().custom(passwordFunction).required(),
  phone: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  country: Joi.string()
    .valid(...countryDataCodes.map((val) => val.iso2.toUpperCase()))
    .required(),
  terms: Joi.boolean(),
  phone_otp: Joi.string().required(),
  metadata: Joi.object(),
});
/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request body
  const { value, error } = registerSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }
  // Verify phone one time password
  const verify_phone_otp = await twilioSmsService.verifyOTP(
    value.phone,
    value.phone_otp
  );
  if (!verify_phone_otp?.valid) {
    throw new HTTPError("Invalid phone OTP", 400, errorCodes.invalidPhoneOTP);
  }
  // Business logic
  let { user, account } = await usersService.createCtraderUser(
    value.email,
    value.password,
    value.phone,
    value.first_name,
    value.last_name,
    value.country,
    value.terms,
    value.metadata
  );
  const ot_token = await otTokenService.createOT(user.id);
  const token = await userTokenService.createToken(user.id);
  await userLogsService.USER_ACTIONS.registered(user);
  res.status(201).json({ user: user.toJSON(), account, ot_token, token });
};
