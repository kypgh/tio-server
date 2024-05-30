import { RequestHandler } from "express";
import Joi from "joi";
import { TIO_BRANDS, TIO_ENTITIES } from "../../../../config/enums";
import errorCodes from "../../../../config/errorCodes";
import universalTokensService from "../../../../services/universalTokens.service";
import usersService from "../../../../services/users.service";
import HTTPError from "../../../../utils/HTTPError";
import utilFunctions from "../../../../utils/util.functions";

const maLoginUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  entity: Joi.string()
    .valid(...Object.values(TIO_ENTITIES))
    .required(),
  brand: Joi.string()
    .valid(...Object.values(TIO_BRANDS))
    .required(),
});

const emailSchema = Joi.string().email().lowercase().trim().required();

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request body
  const { value, error } = maLoginUserSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }
  if (Number(value.email) === NaN) {
    const email = emailSchema.validate(value.email);
    if (email.error) {
      throw new HTTPError("Validation error", 400, {
        ...email.error,
        ...errorCodes.bodyValidation,
      });
    }
  }
  const user = await usersService.getUserByEmailOrReadableIdEntity(value);
  if (!user) {
    return res
      .status(400)
      .json({ ...error, ...errorCodes.invalidLoginCredentials });
  }
  if (user.isSuspended) {
    return res
      .status(403)
      .json({
        message:
          "User suspended. Please contact support if you have any questions or suspect this might be a mistake.",
      });
  }
  if (!(await usersService.checkUserPassword(user, value.password))) {
    return res
      .status(400)
      .json({ ...error, ...errorCodes.invalidLoginCredentials });
  }
  const normalizedUser = utilFunctions.decimal2JSONReturn(user.toJSON());
  const jwt = await universalTokensService.createJWT(normalizedUser);
  const accessToken = await universalTokensService.createAccessToken(user);
  // Business logic
  res.status(200).json({ user: normalizedUser, jwt, accessToken });
};
