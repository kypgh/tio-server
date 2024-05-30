import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import { RequestHandler } from "express";
import userAccountsService from "../../../../services/userAccounts.service";
import { CTRADER_SYMBOLS } from "../../../../config/ctraderEnums";
import ctraderTradesService from "../../../../services/ctraderTrades.service";
import currencyExchangeService from "../../../../services/currencyExchange.service";
import tradesService from "../../../../services/trades.service";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  let user_id = req.user._id;
  const accounts = await userAccountsService.getUserAccounts(user_id, {
    environment_type: "live",
  });
  let tradeData = await tradesService.getPositionsSummaryForAccounts(accounts);
  let groupTradeData = tradeData.reduce((acc, trade) => {
    if (acc[trade.group]) {
      acc[trade.group].long += trade.long;
      acc[trade.group].short += trade.short;
      acc[trade.group].total += trade.total;
    } else {
      acc[trade.group] = {
        group: trade.group,
        long: trade.long,
        short: trade.short,
        total: trade.total,
      };
    }
    return acc;
  }, {});

  let totalShort = tradeData.reduce((acc, trade) => acc + trade.short, 0);
  let totalLong = tradeData.reduce((acc, trade) => acc + trade.long, 0);
  let total = tradeData.reduce((acc, trade) => acc + trade.total, 0);

  // Add percentage to each group
  groupTradeData = Object.values(groupTradeData).reduce((acc, trade) => {
    trade.percentage = Math.round((trade.total / total) * 100);
    trade.percentageShort = Math.round((trade.short / trade.total) * 100);
    trade.percentageLong = Math.round((trade.long / trade.total) * 100);
    acc[trade.group] = trade;
    return acc;
  }, {});

  res.status(200).json({
    tradeData: groupTradeData,
    totalShort,
    totalLong,
    total,
  });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
