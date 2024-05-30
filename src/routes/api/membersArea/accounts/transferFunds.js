import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import userAccountsService from "../../../../services/userAccounts.service";
import { RequestHandler } from "express";
import userLogsService from "../../../../services/userLogs.service";
import userTransactionsService from "../../../../services/userTransactions.service";
import { mongooseIDFunction } from "../../../../utils/customValidation";

const transferFundsSchema = Joi.object({
  accountFrom: Joi.string().custom(mongooseIDFunction).required(),
  accountTo: Joi.string().custom(mongooseIDFunction).required(),
  amount: Joi.number().min(0).required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = transferFundsSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
  }
  const _accountFrom = await userAccountsService.getUserAccountById(
    req.user._id,
    value.accountFrom
  );
  if (!_accountFrom) {
    return res.status(404).json({ message: "accountFrom not found" });
  }
  const _accountTo = await userAccountsService.getUserAccountById(
    req.user._id,
    value.accountTo
  );
  if (!_accountTo) {
    return res.status(404).json({ message: "accountTo not found" });
  }

  const { transactionFrom, transactionTo, accountFrom, accountTo } =
    await userTransactionsService.transferFundsBetweenAccounts(
      req.user,
      _accountFrom,
      _accountTo,
      value.amount
    );

  await userLogsService.USER_ACTIONS.transferFundsBetweenAccounts(
    req.user,
    accountFrom,
    accountTo,
    transactionFrom,
    transactionTo
  );
  res
    .status(200)
    .json({ transactionFrom, transactionTo, accountFrom, accountTo });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
