import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import universalTokensService from "../../../../services/universalTokens.service";
import utilFunctions from "../../../../utils/util.functions";

const maUserRefreshTokenSchema = Joi.object({
  accessToken: Joi.string().required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request
  const { value, error } = maUserRefreshTokenSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
  }
  const { isValid, user } = await universalTokensService.verifyAccessToken(
    value.accessToken
  );
  if (user?.isSuspended) {
    return res
      .status(403)
      .json({
        message:
          "User suspended. Please contact support if you have any questions or suspect this might be a mistake.",
      });
  }
  if (!isValid) {
    return res.status(403).json(errorCodes.invalidAccessToken);
  }
  const normalizedUser = utilFunctions.decimal2JSONReturn(user.toJSON());
  const jwt = await universalTokensService.createJWT(normalizedUser);
  // Business logic
  res.status(200).json({ jwt });
};
