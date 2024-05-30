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
import usersService from "../../../../services/users.service";
import { passwordFunction } from "../../../../utils/customValidation";
import HTTPError from "../../../../utils/HTTPError";

const maPreRegisterSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().custom(passwordFunction).required(),
  phone: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  country: Joi.string()
    .valid(...countryDataCodes.map((val) => val.iso2.toUpperCase()))
    .required(),
  terms: Joi.boolean(),
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
  const { value, error } = maPreRegisterSchema.validate(req.body);
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
  // Business logic
  await twilioSmsService.genOTP(value.phone, value.language);

  res.status(200).json({ success: true, message: "OTP send to phone number" });
};

export default {
  middleware: {
    all: [],
  },
};
