import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import emailService from "../../../../services/email.service";
import universalTokensService from "../../../../services/universalTokens.service";
import usersService from "../../../../services/users.service";
import { passwordFunction } from "../../../../utils/customValidation";
import HTTPError from "../../../../utils/HTTPError";

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().custom(passwordFunction).required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request body
  const { value, error } = resetPasswordSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }
  const { isValid, user } =
    await universalTokensService.validateResetPasswordToken(value.token);
  if (!isValid) {
    return res
      .status(400)
      .json({ ...error, ...errorCodes.invalidResetPasswordToken });
  }
  await usersService.resetUserPassword(user._id, value.newPassword);
  // Business logic
  res.status(200).json({ message: "Successfully update password" });
};
