import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../../config/errorCodes";
import { isMembersAreaUser } from "../../../../../middleware/membersArea.middleware";
import { mongooseIDFunction } from "../../../../../utils/customValidation";
import mt5TradesService from "../../../../../services/mt5Trades.service";
import ctraderDealsService from "../../../../../services/ctraderDeals.service";
import { hasAccessToAccount } from "../../../../../middleware/hasAccessToAccount";
import tradesService from "../../../../../services/trades.service";

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
  const account = req.userAccount;

  const tradesInfo = await tradesService.calculateTradesInfo(account);

  let response = {
    accountId: account.login_id,
    balance: account.balance,
    equity: account.equity,
    margin: account.used_margin,
    createdAt: account.createdAt,
    freeMargin: account.free_margin,
    marginLevel:
      account.used_margin === 0
        ? 0
        : (account.equity / account.used_margin) * 100,
    totalDeposits: String(account.total_deposits),
    totalWithdrawals: String(account.total_withdrawals),
    openPl: "",
    volume: tradesInfo.totalVolumeInPips,
    ...tradesInfo,
    accountCurrency: account.currency,
  };

  res.status(200).json(response);
};

export default {
  middleware: {
    all: [isMembersAreaUser, hasAccessToAccount],
  },
};
