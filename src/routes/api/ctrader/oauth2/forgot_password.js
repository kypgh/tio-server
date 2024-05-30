import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import rpTokenService from "../../../../services/rpToken.service";
import twilioSmsService from "../../../../services/twilioSms.service";
import usersService from "../../../../services/users.service";
import HTTPError from "../../../../utils/HTTPError";

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request body
  const { value, error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }
  const user = await usersService.getUserByEmail(value.email);
  if (!user) {
    throw new HTTPError("User not found", 404, errorCodes.userDoesNotExist);
  }
  // Business logic
  const token = await rpTokenService.createRPToken(user._id);
  await twilioSmsService.sendResetPasswordLink(user.phone, token);
  res.status(200).json({
    success: true,
    message: "SMS with link send",
    phone: "*".repeat(user.phone.slice(0, -3).length) + user.phone.slice(-3),
  });
};
