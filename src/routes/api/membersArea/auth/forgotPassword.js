import { RequestHandler } from "express";
import Joi from "joi";
import { TIO_BRANDS, TIO_ENTITIES } from "../../../../config/enums";
import errorCodes from "../../../../config/errorCodes";
import emailService from "../../../../services/email.service";
import universalTokensService from "../../../../services/universalTokens.service";
import usersService from "../../../../services/users.service";
import HTTPError from "../../../../utils/HTTPError";

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  entity: Joi.string()
    .valid(...Object.values(TIO_ENTITIES))
    .required(),
  brand: Joi.string()
    .valid(...Object.values(TIO_BRANDS))
    .required(),
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
  const user = await usersService.getUserByEmailEntity(value);
  if (!user) {
    return res.status(400).json({ ...error, ...errorCodes.userDoesNotExist });
  }

  const resetPasswordToken =
    await universalTokensService.createResetPasswordToken(user._id);
  await emailService.forgotPasswordEmailMembersArea({
    user,
    resetPasswordToken,
  });
  // Business logic
  res.status(200).json({ message: "Token send" });
};
