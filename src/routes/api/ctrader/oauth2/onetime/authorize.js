import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../../config/errorCodes";
import { ctraderAPIAccess } from "../../../../../middleware/auth.middleware";
import accessTokenService from "../../../../../services/accessToken.service";
import otTokenService from "../../../../../services/otToken.service";
import HTTPError from "../../../../../utils/HTTPError";

const oneTimeAuthSchema = Joi.object({
  code: Joi.string().required(),
});
/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request body
  const { value, error } = oneTimeAuthSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }
  // Business logic
  let { ctrader_id, keep_logged_in, user_id } =
    await otTokenService.validateOTtoken(value.code);
  if (keep_logged_in) {
    const generatedToken = await accessTokenService.createAccessToken(user_id);
    res.status(200).json({ userId: ctrader_id, accessToken: generatedToken });
  } else {
    res.status(200).json({ userId: ctrader_id });
  }
};

export default {
  middleware: {
    all: [ctraderAPIAccess],
  },
};
