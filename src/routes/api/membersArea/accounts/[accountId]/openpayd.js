import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../../config/errorCodes";
import { isMembersAreaUser } from "../../../../../middleware/membersArea.middleware";
import openpaydService from "../../../../../services/openpayd.service";
import { mongooseIDFunction } from "../../../../../utils/customValidation";
import userAccountsService from "../../../../../services/userAccounts.service";

const getAccountSchema = Joi.object({
  accountId: Joi.string().custom(mongooseIDFunction).required(),
});
/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = getAccountSchema.validate(req.query);
  if (error) {
    res.status(400).json(error);
    return;
  }

  const account = await userAccountsService.getAccountById(value.accountId);
  if (!account) {
    return res.status(400).json({ message: "Account not found" });
  }

  let openpayedAccount = await openpaydService.getOpenpaydAccount(account._id);

  if (!openpayedAccount) {
    openpayedAccount = await openpaydService.createOpenpaydAccount(
      account,
      req.user
    );
  }

  const { openpaydAccountId, accountHolderId } = openpayedAccount;

  const [accountDetails] = await openpaydService.getAccountUntilNotPending(
    openpaydAccountId,
    accountHolderId
  );
  res.status(200).json(accountDetails);
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
