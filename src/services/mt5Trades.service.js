import Mt5PositionsModel from "../models/TradeModels/Mt5Positions.model";
import Mt5OrdersModel from "../models/TradeModels/Mt5Orders.model";
import Mt5DealsModel from "../models/TradeModels/Mt5Deals.model";
import mongoose from "mongoose";
import { DateTime } from "luxon";
import symbolService from "./symbol.service";
import BigNumber from "bignumber.js";
import mt5Service from "./mt5.service";
import Currency from "../utils/Currency";

const mt5TradesService = {
  getPaginated: async (page, limit, filters = {}) => {
    const results = await Mt5PositionsModel.paginate(filters, {
      page,
      limit,
      populate: ["account"],
    });
    results.docs = results.docs.map((doc) => ({
      positionId: doc.positionId,
      action: doc.action == "0" ? "BUY" : "SELL",
      symbol: doc.symbol,
      openPrice: doc.priceOpen,
      closePrice: doc.priceCurrent,
      profit: doc.profit,
      volume: doc.volume,
      openTime: doc.timeCreateMsc,
    }));
    return results;
  },
  createPosition: async (position, accountId, env_type, server) => {
    return Mt5PositionsModel.create({
      ...position,
      account: accountId,
      environment_type: env_type,
      server,
    });
  },
  updatePosition: async (position, accountId, env_type, server) => {
    return Mt5PositionsModel.findOneAndUpdate(
      {
        positionId: position.positionId,
        environment_type: env_type,
        account: accountId,
        server,
      },
      {
        $set: {
          ...position,
        },
      },
      { upsert: true }
    );
  },
  deletePosition: async (position, accountId, env_type, server) => {
    return Mt5PositionsModel.findOneAndUpdate(
      {
        positionId: position.positionId,
        environment_type: env_type,
        account: accountId,
        server,
      },
      {
        $set: {
          archived: true,
          ...position,
        },
      },
      { upsert: true }
    );
  },
  createOrder: async (order, accountId, env_type, server) => {
    return Mt5OrdersModel.create({
      ...order,
      account: accountId,
      environment_type: env_type,
      server,
    });
  },
  updateOrder: async (order, accountId, env_type, server) => {
    return Mt5OrdersModel.findOneAndUpdate(
      {
        orderId: order.orderId,
        environment_type: env_type,
        account: accountId,
        server,
      },
      {
        ...order,
      },
      { upsert: true }
    );
  },
  deleteOrder: async (orderId, env_type, server) => {
    return Mt5OrdersModel.findOneAndUpdate(
      { order: orderId, environment_type: env_type, server },
      {
        archived: true,
      }
    );
  },
  createDeal: async (deal, accountId, env_type, server) => {
    return Mt5DealsModel.create({
      ...deal,
      account: accountId,
      environment_type: env_type,
      server,
    });
  },
  updateDeal: async (deal, accountId, env_type, server) => {
    // prettier-ignore
    return Mt5DealsModel.findOneAndUpdate(
      { dealId: deal.dealId, environment_type: env_type, account: accountId, server, },
      { ...deal, },
      { upsert: true, }
    );
  },
  deleteDeal: async (dealId, env_type, server) => {
    // prettier-ignore
    return Mt5DealsModel.findOneAndUpdate(
      { dealId: dealId, environment_type: env_type, server, },
      { archived: true, }
    );
  },
  calculateProfitability: async (accountIds) => {
    // prettier-ignore
    const [result] = await Mt5PositionsModel.aggregate([
      { $match: { account: { $in: accountIds.map((v) => mongoose.Types.ObjectId(v)) }, archived: true, timeUpdateMsc: { $gt: DateTime.now().startOf("day").toJSDate(), }, }, },
      { $group: { _id: null, totalWin: { $sum: { $cond: [{ $gt: ["$profit", 0] }, 1, 0] }, }, total: { $sum: 1, }, }, },
    ]);
    return !!result && result?.total > 0 ? result?.totalWin / result?.total : 0;
  },
  calculateTodaysClosedPl: async (accountIds) => {
    // prettier-ignore
    const [result] = await Mt5PositionsModel.aggregate([
      { $match: { account: { $in: accountIds.map((v) => mongoose.Types.ObjectId(v)) }, archived: true, timeUpdateMsc: { $gt: DateTime.now().startOf("day").toJSDate(), }, }, },
      { $group: { _id: null, totalPl: { $sum: "$profit", }, }, },
    ]);
    return result?.totalPl ?? 0;
  },
  tradesInfo: async (account_id) => {
    // prettier-ignore
    const [result] = await Mt5PositionsModel.aggregate([
      { $match: { account: mongoose.Types.ObjectId(account_id), archived: { $exists: true }, }, },
      { $lookup: { from: "mt5orders", localField: "positionId", foreignField: "positionId", as: "orders", pipeline: [ { $match: { account: mongoose.Types.ObjectId(account_id), }, }, { $group: { _id: null, lowest: { $min: "$timeDoneMsc" }, highest: { $max: "$timeDoneMsc" }, }, }, ], }, },
      { $group: { _id: "$account", wins: { $sum: { $cond: [{ $gt: ["$profit", 0] }, 1, 0] } }, loses: { $sum: { $cond: [{ $lt: ["$profit", 0] }, 1, 0] } }, bestTrade: { $max: "$profit" }, worstTrade: { $min: "$profit" }, totalWins: { $sum: { $cond: [{ $gt: ["$profit", 0] }, "$profit", 0] }, }, totalLoses: { $sum: { $cond: [{ $lt: ["$profit", 0] }, "$profit", 0] }, }, profitableLongTrades: { $sum: { $cond: [{ $in: ["$action", ["1", 1]] }, "$profit", 0] }, }, profitableShortTrades: { $sum: { $cond: [{ $in: ["$action", ["0", 0]] }, "$profit", 0] }, }, sumOrderDuration: { $sum: { $subtract: [ { $getField: { field: "highest", input: { $arrayElemAt: ["$orders", 0] }, }, }, { $getField: { field: "lowest", input: { $arrayElemAt: ["$orders", 0] }, }, }, ], }, }, count: { $sum: 1 }, totalVolumeInPips: { $sum: { $divide: ["$volume", "$contractSize"] }, }, }, },
      { $project: { _id: 0, wins: 1, loses: 1, totalWins: 1, totalLoses: 1, bestTrade: 1, worstTrade: 1, profitableLongTrades: 1, profitableShortTrades: 1, sumOrderDuration: 1, count: 1, totalVolumeInPips: 1, avgOrderDuration: { $cond: [ { $eq: ["$count", 0] }, 0, { $divide: ["$sumOrderDuration", "$count"] }, ], }, averageWins: { $cond: [ { $eq: ["$wins", 0] }, 0, { $divide: ["$totalWins", "$wins"] }, ], }, averageLoss: { $cond: [ { $eq: ["$loses", 0] }, 0, { $divide: ["$totalLoses", "$loses"] }, ], }, profitability: { $cond: [ { $eq: ["$count", 0] }, 0, { $divide: ["$totalWins", "$count"] }, ], }, profitFactor: { $cond: [ { $eq: ["$totalLoses", 0] }, 0, { $divide: ["$totalWins", "$totalLoses"] }, ], }, winRate: { $cond: [ { $eq: ["$count", 0] }, 0, { $divide: ["$wins", "$count"] }, ], }, lossRate: { $cond: [ { $eq: ["$count", 0] }, 0, { $divide: ["$loses", "$count"] }, ], }, closedPL: { $subtract: ["$totalWins", "$totalLoses"] }, totalTrades: "$count", }, },
    ]);

    return !!result ? result : {};
  },
  totalTrades: async (account_id) => {
    return Mt5PositionsModel.count({
      account: mongoose.Types.ObjectId(account_id),
    });
  },
  getOpenPositionsByAccountId: async (account_id) => {
    return Mt5PositionsModel.find({
      account: mongoose.Types.ObjectId(account_id),
      archived: false,
    });
  },
  getClosePositionsByAccountId: async (account_id) => {
    return Mt5PositionsModel.find({
      account: mongoose.Types.ObjectId(account_id),
      archived: true,
    });
  },
  getTotalClosedTradesForAccounts: async (accountIds) => {
    return Mt5PositionsModel.countDocuments({
      account: {
        $in: accountIds.map((accId) => mongoose.Types.ObjectId(accId)),
      },
      archived: true,
    });
  },
  getClosedTradesTotalsForAccount: async (accountId) => {
    // prettier-ignore
    const [totals] = await Mt5DealsModel.aggregate([
      { $match: { account: mongoose.Types.ObjectId(accountId), entry: { $in: ["1", "2", "3", 1, 2, 3] }, }, },
      { $group: { _id: null, totalGrossProfit: { $sum: "$profit" }, totalNetProfit: { $sum: "$profitRaw" }, totalCommission: { $sum: "$commission" }, totalVolume: { $sum: { $divide: ["$volumeClosed", 10000] }, }, }, },
    ]);
    return {
      totalGrossProfit: totals?.totalGrossProfit ?? 0,
      totalNetProfit: totals?.totalNetProfit ?? 0,
      totalSwap: 0,
      totalCommission: totals?.totalCommission ?? 0,
      totalVolume: totals?.totalVolume ?? 0,
    };
  },
  getClosedTradesPaginated: async ({ accountId, page, limit }) => {
    // prettier-ignore
    const aggregation = Mt5PositionsModel.aggregate([
      { $match: { account: mongoose.Types.ObjectId(accountId), }, },
      { $lookup: { from: "mt5deals", localField: "positionId", foreignField: "positionId", as: "deals", pipeline: [ { $match: { account: mongoose.Types.ObjectId(accountId) } }, ], }, },
      { $match: { deals: { $elemMatch: { entry: {$in: ["1", "2", "3", 1, 2, 3]} } }, }, },
    ]);
    const results = await Mt5PositionsModel.aggregatePaginate(aggregation, {
      page,
      limit,
      sort: { timeUpdateMsc: -1 },
    });

    results.docs = results.docs.map((doc) => {
      const commission = doc.deals.reduce(
        (acc, curr) => acc + curr.commission,
        0
      );
      return {
        positionId: doc.positionId,
        action: doc.action == "0" ? "BUY" : "SELL", // invert since we use the closing deal to calculate
        symbol: doc.symbol,
        openPrice: doc.priceOpen,
        closePrice: doc.priceCurrent,
        digitsPrice: doc.digits,
        digitsCurrency: doc.digitsCurrency,
        swap: 0,
        commission,
        grossProfit: doc.profit,
        netProfit: doc.profit + commission,
        volume: BigNumber(doc.volumeExt).dividedBy(100000000).toNumber(),
        lotSize: doc.contractSize,
        openTime: doc.timeCreateMsc,
        closeTime: doc.timeUpdateMsc,
      };
    });
    return results;
  },
  getOpenTradesPaginated: async ({ accountId, page, limit }) => {
    // prettier-ignore
    const aggregation = Mt5PositionsModel.aggregate([
      { $match: { account: mongoose.Types.ObjectId(accountId), }, },
      { $lookup: { from: "mt5deals", localField: "positionId", foreignField: "positionId", as: "deals", pipeline: [ { $match: { account: mongoose.Types.ObjectId(accountId) } }, ], }, },
      { $match: { deals: {$not: { $elemMatch: { entry: {$in: ["1", "2", "3", 1, 2, 3]} } }, }, }, },
    ]);
    const results = await Mt5PositionsModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });
    results.docs = results.docs.map((doc) => {
      const commission = doc.deals.reduce(
        (acc, curr) => acc + curr.commission,
        0
      );
      return {
        positionId: doc.positionId,
        action: doc.action == "0" ? "BUY" : "SELL", // invert since we use the closing deal to calculate
        symbol: doc.symbol,
        openPrice: doc.priceOpen,
        closePrice: doc.priceCurrent,
        digitsPrice: doc.digits,
        digitsCurrency: doc.digitsCurrency,
        swap: 0,
        commission,
        grossProfit: doc.profit,
        netProfit: doc.profit + commission,
        volume: BigNumber(doc.volumeExt).dividedBy(100000000).toNumber(),
        lotSize: doc.contractSize,
        openTime: doc.timeCreateMsc,
        closeTime: doc.timeUpdateMsc,
      };
    });
    return results;
  },
  calculateOpenPlForAccountsInUSD: async (accounts) => {
    const results = await mt5Service.getOpenPositionsFromLogins(
      accounts.map((acc) => ({ login: acc.login_id, server: acc.server }))
    );
    const usdProfits = await Promise.all(
      results.map(async (curr) => {
        const account = accounts.find((acc) => acc.login_id == curr.Login);
        if (!account) return 0;
        const symbolCurr = Currency.fromPrecise({
          amount: curr.Profit,
          currency: account.currency,
        });
        const usd = await symbolCurr.convertToCurrency("USD");
        return usd.getAmountPrecise();
      })
    );
    return usdProfits.reduce((acc, curr) => acc + Number(curr), 0);
  },
  getAccountPositionSummary: async (account) => {
    //prettier-ignore
    const results = await Mt5DealsModel.aggregate([
      { $match: { account: account._id, entry: { $in: ["1", "2", "3", 1, 2, 3] }, }, },
      { $group: { 
        _id: "$symbol", 
        long: { $sum: { $cond: [{ $in: ["$action", ["0", 0]] }, 1, 0] }, }, 
        short: { $sum: { $cond: [{ $in: ["$action", ["1", 1]] }, 1, 0] }, }, total: { $sum: 1 }, 
      }, },
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
    const aggregation = await Mt5PositionsModel.aggregate([
      {
        $match: {
          account: mongoose.Types.ObjectId(account._id),
        },
      },
      {
        $project: {
          volumeExt: 1,
        },
      },
    ]);

    let volume = aggregation
      .reduce(
        (acc, curr) => acc.plus(BigNumber(curr.volumeExt).dividedBy(100000000)),
        BigNumber(0)
      )
      .toNumber();

    return Number(volume.toFixed(4));
  },
};

export default mt5TradesService;

export const MT5_WEBHOOK_MESSAGE_TYPES = {
  POSITION_CREATED: "POSITION_CREATED",
  POSITION_UPDATED: "POSITION_UPDATED",
  POSITION_DELETED: "POSITION_DELETED",
  ORDER_CREATED: "ORDER_CREATED",
  ORDER_UPDATED: "ORDER_UPDATED",
  ORDER_DELETED: "ORDER_DELETED",
  DEAL_CREATED: "DEAL_CREATED",
  DEAL_UPDATED: "DEAL_UPDATED",
  DEAL_DELETED: "DEAL_DELETED",
  DEAL_PERFORMED: "DEAL_PERFORMED",
  UPDATE_TRADER_BALANCE: "UPDATE_TRADER_BALANCE",
};
