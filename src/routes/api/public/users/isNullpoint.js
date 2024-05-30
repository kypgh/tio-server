import { RequestHandler } from "express";
import Joi from "joi";
import { isValidAPIKey } from "../../../../middleware/webhook.middleware";
import groupSpreadsService from "../../../../services/groupSpreads.service";
import nullpointService from "../../../../services/nullpoint.service";
import usersService from "../../../../services/users.service";

const checkIsNullpointUserSchema = Joi.object({
  email: Joi.string().required(),
  entity: Joi.string().required(),
});

const emailChecker = Joi.string().email().lowercase().trim().required();
/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = checkIsNullpointUserSchema.validate(req.query);
  if (error) {
    res.status(400).json(error);
    return;
  }
  if (Number(value.email) === NaN) {
    const email = emailChecker.validate(value.email);
    if (email.error) {
      res.status(400).json(email.error);
      return;
    }
  }
  const npRes = await nullpointService.checkIsClient(value);
  const tioRes = await usersService.getUserByEmailOrReadableIdForTIO({
    emailOrReadableId: value.email,
    entity: value.entity,
  });
  res.status(200).json({
    isNullPoint: npRes.isPendingOrClient,
    nullPointStatus: npRes.status,
    isTio: tioRes !== null,
  });
};

export default {
  middleware: {
    all: [isValidAPIKey("MQMFaCGETyh87lC74jYCNaMM5idG9WeD")],
  },
};
