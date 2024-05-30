import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import otTokenService from "../../../../services/otToken.service";
import userLogsService from "../../../../services/userLogs.service";
import usersService from "../../../../services/users.service";
import userTokenService from "../../../../services/userToken.service";
import HTTPError from "../../../../utils/HTTPError";
import utilFunctions from "../../../../utils/util.functions";

const loginUserSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
  keep_logged_in: Joi.boolean(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request body
  const { value, error } = loginUserSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }
  // Business logic
  let user = await usersService.loginCtraderUser(value.email, value.password);
  const ot_token = await otTokenService.createOT(user.id, value.keep_logged_in);
  const token = await userTokenService.createToken(user.id);
  await userLogsService.USER_ACTIONS.loggedIn(user);
  let user_json = utilFunctions.decimal2JSONReturn(user.toJSON());
  delete user_json.password;
  delete user_json.ctrader_password;
  res.status(200).json({ user: user_json, ot_token, token });
};
