import mongoose from "mongoose";
import Mt4TradesModel from "../models/TradeModels/Mt4Trades.model";
import { DateTime } from "luxon";
import userAccountsService from "./userAccounts.service";
import { getDigitsForCurrency } from "../config/currencies";
import { getGroupForSymbol } from "../config/ctraderEnums";
import symbolService from "./symbol.service";
import BigNumber from "bignumber.js";

const mt4TradesService = {
  createTrade: async (trade, accountId, env, server) => {
    return Mt4TradesModel.create({
      ...trade,
      account: accountId,
      environment_type: env,
      server,
    });
  },
  updateTrade: async (trade, server) => {
    return Mt4TradesModel.findOneAndUpdate(
      {
        order: trade.order,
        server,
      },
      {
        $set: {
          ...trade,
        },
      },
      { upsert: true }
    );
  },
  deleteTrade: async (trade, server) => {
    return Mt4TradesModel.findOneAndUpdate(
      {
        order: trade.order,
        server,
      },
      {
        $set: {
          archived: true,
          ...trade,
        },
      },
      { upsert: true }
    );
  },
  calculateTodaysClosedPl: async (accountIds) => {
    const [result] = await Mt4TradesModel.aggregate([
      {
        $match: {
          account: { $in: accountIds },
          state: { $eq: 3 },
          close_time: {
            $gte: DateTime.now().startOf("day").toJSDate().getTime() / 1000,
          },
        },
      },
      {
        $group: {
          _id: "$account",
          profit: { $sum: "$profit" },
        },
      },
    ]);
    return result?.profit ?? 0;
  },
  calculateProfitability: async (accountIds) => {
    const [result] = await Mt4TradesModel.aggregate([
      {
        $match: {
          account: { $in: accountIds },
          state: { $eq: 3 },
          close_time: {
            $gte: DateTime.now().startOf("day").toJSDate().getTime() / 1000,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalWin: {
            $sum: { $cond: [{ $gt: ["$profit", 0] }, 1, 0] },
          },
          total: {
            $sum: 1,
          },
        },
      },
    ]);
    return !!result && result?.total > 0 ? result?.totalWin / result?.total : 0;
  },
  tradesInfoForAccount: async (accountId) => {
    const [result] = await Mt4TradesModel.aggregate([
      {
        $match: {
          account: mongoose.Types.ObjectId(accountId),
          state: { $eq: 3 },
        },
      },
      {
        $group: {
          _id: "$account",
          wins: { $sum: { $cond: [{ $gt: ["$profit", 0] }, 1, 0] } },
          loses: { $sum: { $cond: [{ $lt: ["$profit", 0] }, 1, 0] } },
          bestTrade: { $max: "$profit" },
          worstTrade: { $min: "$profit" },
          totalWins: {
            $sum: { $cond: [{ $gt: ["$profit", 0] }, "$profit", 0] },
          },
          totalLoses: {
            $sum: { $cond: [{ $lt: ["$profit", 0] }, "$profit", 0] },
          },
          profitableLongTrades: {
            $sum: { $cond: [{ $in: ["$cmd", ["0", 0]] }, "$profit", 0] },
          },
          profitableShortTrades: {
            $sum: { $cond: [{ $in: ["$cmd", ["1", 1]] }, "$profit", 0] },
          },
          sumOrderDuration: {
            $sum: {
              $subtract: ["$close_time", "$open_time"],
            },
          },
          totalVolumeInPips: {
            $sum: {
              $multiply: ["$volume", 0.01],
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          wins: 1,
          loses: 1,
          totalWins: 1,
          totalLoses: 1,
          bestTrade: 1,
          worstTrade: 1,
          profitableLongTrades: 1,
          profitableShortTrades: 1,
          sumOrderDuration: 1,
          count: 1,
          totalVolumeInPips: 1,
          avgOrderDuration: {
            $cond: [
              { $eq: ["$count", 0] },
              0,
              { $divide: ["$sumOrderDuration", "$count"] },
            ],
          },
          averageWins: {
            $cond: [
              { $eq: ["$wins", 0] },
              0,
              { $divide: ["$totalWins", "$wins"] },
            ],
          },
          averageLoss: {
            $cond: [
              { $eq: ["$loses", 0] },
              0,
              { $divide: ["$totalLoses", "$loses"] },
            ],
          },
          profitability: {
            $cond: [
              { $eq: ["$count", 0] },
              0,
              { $divide: ["$totalWins", "$count"] },
            ],
          },
          profitFactor: {
            $cond: [
              { $eq: ["$totalLoses", 0] },
              0,
              { $divide: ["$totalWins", "$totalLoses"] },
            ],
          },
          winRate: {
            $cond: [
              { $eq: ["$count", 0] },
              0,
              { $divide: ["$wins", "$count"] },
            ],
          },
          lossRate: {
            $cond: [
              { $eq: ["$count", 0] },
              0,
              { $divide: ["$loses", "$count"] },
            ],
          },
          closedPL: { $subtract: ["$totalWins", "$totalLoses"] },
          totalTrades: "$count",
        },
      },
    ]);
    return !!result ? result : {};
  },
  getClosedTradesTotalsForAccount: async (accountId) => {
    const [totals] = await Mt4TradesModel.aggregate([
      {
        $match: {
          account: mongoose.Types.ObjectId(accountId),
          state: { $eq: 3 },
        },
      },
      {
        $group: {
          _id: null,
          totalGrossProfit: { $sum: "$profit" },
          totalNetProfit: {
            $sum: {
              $add: ["$profit", "$commission"],
            },
          },
          totalCommission: { $sum: "$commission" },
          totalVolume: { $sum: "$volume" },
        },
      },
    ]);
    return {
      totalGrossProfit: totals?.totalGrossProfit ?? 0,
      totalNetProfit: totals?.totalNetProfit ?? 0,
      totalSwap: 0,
      totalCommission: totals?.totalCommission ?? 0,
      totalVolume: totals?.totalVolume ? totals?.totalVolume / 100 : 0,
    };
  },
  getTotalClosedTradesForAccounts: async (accountIds) => {
    return Mt4TradesModel.countDocuments({
      account: {
        $in: accountIds.map((accId) => mongoose.Types.ObjectId(accId)),
      },
      state: { $eq: 3 },
    });
  },
  getClosedTradesPaginated: async ({ accountId, page, limit }) => {
    const account = await userAccountsService.getAccountById(accountId);
    const results = await Mt4TradesModel.paginate(
      {
        account: mongoose.Types.ObjectId(accountId),
        state: { $eq: 3 },
      },
      {
        sort: { close_time: -1 },
      }
    );

    results.docs = results.docs.map((doc) => {
      return {
        positionId: doc.order,
        action: doc.cmd == "0" ? "BUY" : "SELL", // invert since we use the closing deal to calculate
        symbol: doc.symbol,
        openPrice: doc.open_price,
        closePrice: doc.close_price,
        digitsPrice: doc.digits,
        digitsCurrency: getDigitsForCurrency(account.currency),
        currency: account.currency,
        swap: 0,
        commission: doc.commission,
        grossProfit: doc.profit,
        netProfit: doc.profit + doc.commission,
        volume: doc.volume / 100, // in lots
        lotSize: 100000,
        openTime: doc.open_time * 1000, // convert to ms
        closeTime: doc.close_time * 1000, // convert to ms
      };
    });

    return results;
  },
  getOpenTradesPaginated: async ({ accountId, page, limit }) => {
    const account = await userAccountsService.getAccountById(accountId);
    const results = await Mt4TradesModel.paginate({
      account: mongoose.Types.ObjectId(accountId),
      state: { $eq: 0 },
    });

    results.docs = results.docs.map((doc) => {
      return {
        positionId: doc.order,
        action: doc.cmd == "1" ? "BUY" : "SELL", // invert since we use the closing deal to calculate
        symbol: doc.symbol,
        openPrice: doc.open_price,
        closePrice: doc.close_price,
        digitsPrice: doc.digits,
        digitsCurrency: getDigitsForCurrency(account.currency),
        currency: account.currency,
        swap: 0,
        commission: doc.commission,
        grossProfit: doc.profit,
        netProfit: doc.profit + doc.commission,
        volume: doc.volume / 100,
        lotSize: 100000,
        openTime: doc.open_time * 1000, // convert to ms
        closeTime: doc.close_time * 1000, // convert to ms
      };
    });

    return results;
  },
  getAccountPositionSummary: async (account) => {
    //prettier-ignore
    const results = await Mt4TradesModel.aggregate([
      { $match: { account: account._id, state: { $eq: 3 }, }, },
      { $group: { _id: "$symbol", long: { $sum: { $cond: [{ $in: ["$cmd", ["1", 1]] }, 1, 0], }, }, short: { $sum: { $cond: [{ $in: ["$cmd", ["0", 0]] }, 1, 0], }, }, total: { $sum: 1, }, }, },
    ]);
    return Promise.all(
      results.map(async (v) => {
        const symbol = await symbolService.getSymbol(v._id, account.server);
        return {
          symbol: symbol.symbol,
          group: symbol.category,
          description: symbol.metadata?.description ?? "",
          long: v.long,
          short: v.short,
          total: v.total,
        };
      })
    );
  },
  getAccountTotalVolume: async (account) => {
    const aggregation = await Mt4TradesModel.aggregate([
      {
        $match: {
          account: account._id,
          state: { $eq: 3 },
        },
      },
      {
        $group: {
          _id: null,
          totalVolume: { $sum: "$volume" },
        },
      },
    ]);

    let volume = (aggregation[0]?.totalVolume ?? 0) / 100;

    return Number(volume.toFixed(4));
  },
};

export default mt4TradesService;

export const MT4_WEBHOOK_MESSAGE_TYPES = {
  TRADE_CREATED: "trade_add",
  TRADE_UPDATED: "trade_update",
  TRADE_DELETED: "trade_delete",
  UPDATE_TRADER_BALANCE: "update_trader_balance",
};
