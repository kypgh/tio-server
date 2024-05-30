import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../../config/errorCodes";
import { isMembersAreaUser } from "../../../../../middleware/membersArea.middleware";
import userAccountsService from "../../../../../services/userAccounts.service";
import { mongooseIDFunction } from "../../../../../utils/customValidation";
import currencyExchangeService from "../../../../../services/currencyExchange.service";
import { getRealServer } from "../../../../../config/enums";

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
  const { account, details } = await userAccountsService.getAccountDetails(
    value.accountId
  );
  const minDepositAmounts = await userAccountsService.getMinDepositAmount(
    account
  );
  const minWithdrawalAmounts = await userAccountsService.getMinWithdrawalAmount(
    account
  );
  delete details.ApiData;

  account.server = getRealServer(account.server);

  res.status(200).json({
    account,
    minDeposit: minDepositAmounts.amount,
    minDepositInAccountCurrency: minDepositAmounts.amountInAccountCurrency,
    minWithdrawal: minWithdrawalAmounts.amount,
    minWithdrawalInAccountCurrency:
      minWithdrawalAmounts.amountInAccountCurrency,
    details,
  });
};

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  res.status(501).json({ message: "Not yet Implemented" });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
