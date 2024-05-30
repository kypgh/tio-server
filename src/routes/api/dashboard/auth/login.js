import { RequestHandler } from "express";
import Joi from "joi";
import crmUsersService from "../../../../services/crmUsers.service";
import HTTPError from "../../../../utils/HTTPError";
import errorCodes from "../../../../config/errorCodes";

const crmUserLoginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request query
  const { value, error } = crmUserLoginSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Invalid request", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }
  // Business logic
  let { refresh_token, jwt_token, user } = await crmUsersService.loginUser(
    value.email,
    value.password
  );
  res.status(200).json({ token: jwt_token, refresh_token, user });
};
