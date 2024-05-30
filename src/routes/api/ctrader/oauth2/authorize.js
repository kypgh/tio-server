import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import { ctraderAPIAccess } from "../../../../middleware/auth.middleware";
import accessTokenService from "../../../../services/accessToken.service";
import userLogsService from "../../../../services/userLogs.service";
import HTTPError from "../../../../utils/HTTPError";

const accessTokenAuthSchema = Joi.object({
  accessToken: Joi.string().required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request body
  const { value, error } = accessTokenAuthSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }
  // Business logic
  const { ctrader_id, user } = await accessTokenService.validateAccessToken(
    value.accessToken
  );
  await userLogsService.USER_ACTIONS.loggedIn(user);
  res.status(200).json({ userId: ctrader_id });
};

export default {
  middleware: {
    all: [ctraderAPIAccess],
  },
};
