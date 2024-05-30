import { RequestHandler } from "express";
import Joi from "joi";
import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import userAccountsService from "../../../../services/userAccounts.service";
import userLogsService from "../../../../services/userLogs.service";
import userRequestsService from "../../../../services/userRequests.service";
import { mongooseIDFunction } from "../../../../utils/customValidation";
import emailService from "../../../../services/email.service";

const transferFundsSchema = Joi.object({
  account: Joi.string().custom(mongooseIDFunction).required(),
  reason: Joi.string().required(),
  leverage: Joi.number().min(0).required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = transferFundsSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error);
  }

  const account = await userAccountsService.getAccountById(value.account);
  if (!account) {
    return res.status(400).json({ message: "Account not found" });
  }
  if (String(account.user._id) !== String(req.user._id)) {
    return res
      .status(403)
      .json({ message: "You have no permission to access this account" });
  }

  const request = await userRequestsService.CHANGE_LEVERAGE.request(
    req.user,
    value.account,
    value.leverage,
    value.reason
  );

  await userLogsService.USER_ACTIONS.requestchangeAccountLeverage(
    req.user,
    value.account,
    value.leverage
  );

  emailService.requestAcknowledgementEmail({ user: req.user, request });
  res.status(200).json({ request });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
