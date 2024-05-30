import { RequestHandler } from "express";
import Joi from "joi";
import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import userAccountsService from "../../../../services/userAccounts.service";
import userLogsService from "../../../../services/userLogs.service";
import userRequestsService from "../../../../services/userRequests.service";
import userTransactionsService from "../../../../services/userTransactions.service";
import { mongooseIDFunction } from "../../../../utils/customValidation";
import emailService from "../../../../services/email.service";

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
    return res.status(400).json(error);
  }

  const accountFrom = await userAccountsService.getUserAccountById(
    req.user._id,
    value.accountFrom
  );
  if (!accountFrom) {
    return res.status(404).json({ message: "accountFrom not found" });
  }
  const accountTo = await userAccountsService.getUserAccountById(
    req.user._id,
    value.accountTo
  );
  if (!accountTo) {
    return res.status(404).json({ message: "accountTo not found" });
  }

  const { transactionTo, transactionFrom } =
    await userTransactionsService.createTransferTransactions(
      req.user,
      accountFrom,
      accountTo,
      value.amount
    );
  const request = await userRequestsService.TRANSFER_FUNDS.request(
    req.user,
    accountFrom,
    accountTo,
    transactionFrom,
    transactionTo
  );

  await userLogsService.USER_ACTIONS.requestTransferBetweenAccounts(
    req.user,
    accountFrom,
    accountTo,
    transactionTo,
    transactionFrom
  );
  emailService.requestAcknowledgementEmail({ user: req.user, request });
  res.status(200).json({ request });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
