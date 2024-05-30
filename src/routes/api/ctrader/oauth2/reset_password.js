import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import rpTokenService from "../../../../services/rpToken.service";
import userLogsService from "../../../../services/userLogs.service";
import usersService from "../../../../services/users.service";
import { passwordFunction } from "../../../../utils/customValidation";
import HTTPError from "../../../../utils/HTTPError";

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().custom(passwordFunction).required(),
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
  // Business logic
  const user_id = await rpTokenService.validateRPToken(value.token);
  const user = await usersService.resetUserPassword(user_id, value.password);
  await userLogsService.USER_ACTIONS.changePassword(user);
  res.status(201).json({ message: "Success" });
};
