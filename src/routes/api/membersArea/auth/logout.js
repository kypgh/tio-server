import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import universalTokensService from "../../../../services/universalTokens.service";

const maLogoutUserSchema = Joi.object({
  accessToken: Joi.string().required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = maLogoutUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
  }
  await universalTokensService.removeAccessToken(value.accessToken);
  // Business logic
  res.status(200).json({ message: "Logout" });
};

export default {
  middleware: {
    all: [],
  },
};
