import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import { RequestHandler } from "express";
import userAccountsService from "../../../../services/userAccounts.service";
import { CTRADER_SYMBOLS } from "../../../../config/ctraderEnums";
import ctraderTradesService from "../../../../services/ctraderTrades.service";
import currencyExchangeService from "../../../../services/currencyExchange.service";
import mt5Service from "../../../../services/mt5.service";
import mt5TradesService from "../../../../services/mt5Trades.service";
import mt4TradesService from "../../../../services/mt4Trades.service";
/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  let user_id = req.user._id;
  const accounts = await userAccountsService.getUserAccounts(user_id, {
    environment_type: "live",
  });
  const accountIds = accounts.map((account) => account._id);
  let ct_todaysClosedPl = await ctraderTradesService.calculateTodaysClosedPl(
    accountIds
  );
  let ct_openPl = await ctraderTradesService.calculateOpenPl(accounts);
  let ct_profitability = await ctraderTradesService.calculateProfitability(
    accountIds
  );

  const ct_totalTrades =
    await ctraderTradesService.getTotalClosedTradesForAccounts(accountIds);

  let mt5_todaysClosedPl = await mt5TradesService.calculateTodaysClosedPl(
    accountIds
  );
  let mt5_openPl = await mt5TradesService.calculateOpenPlForAccountsInUSD(
    accounts
  );
  let mt5_profitability = await mt5TradesService.calculateProfitability(
    accountIds
  );
  const mt5_totalTrades =
    await mt5TradesService.getTotalClosedTradesForAccounts(accountIds);

  let mt4_todaysClosedPl = await mt4TradesService.calculateTodaysClosedPl(
    accountIds
  );
  let mt4_openPl = 0;
  let mt4_profitability = await mt4TradesService.calculateProfitability(
    accountIds
  );
  const mt4_totalTrades =
    await mt4TradesService.getTotalClosedTradesForAccounts(accountIds);
  let freeMarginsUsd = await Promise.all(
    accounts.map(async (acc) =>
      currencyExchangeService.getAmounToUSD(acc.free_margin, acc.currency)
    )
  );
  let accountBalancesUsd = await Promise.all(
    accounts.map(async (acc) =>
      currencyExchangeService.getAmounToUSD(acc.balance, acc.currency)
    )
  );
  let freeMargin = freeMarginsUsd.reduce((a, b) => a + b, 0);
  const totalBalance = accountBalancesUsd.reduce((a, b) => a + b, 0);
  const openPl = ct_openPl + mt5_openPl + mt4_openPl;
  const todaysClosedPl =
    ct_todaysClosedPl + mt5_todaysClosedPl + mt4_todaysClosedPl;
  const totalTrades = ct_totalTrades + mt5_totalTrades + mt4_totalTrades;
  const profitability =
    ct_profitability + mt5_profitability + mt4_profitability;
  res.status(200).json({
    todaysClosedPl,
    totalTrades,
    openPl,
    freeMargin: freeMargin - openPl,
    totalBalance,
    profitability,
  });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
