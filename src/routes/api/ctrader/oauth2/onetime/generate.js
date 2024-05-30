import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../../config/errorCodes";
import { ctraderAPIAccess } from "../../../../../middleware/auth.middleware";
import usersService from "../../../../../services/users.service";
import userTokenService from "../../../../../services/userToken.service";
import HTTPError from "../../../../../utils/HTTPError";

const ctraderGenerateOTSchema = Joi.object({
  userId: Joi.number().required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { error, value } = ctraderGenerateOTSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }
  const user = await usersService.getUserByCTID(value.userId);
  const token = await userTokenService.createToken(user._id);
  res.status(200).json({ token });
};

export default {
  middleware: {
    all: [ctraderAPIAccess],
  },
};
