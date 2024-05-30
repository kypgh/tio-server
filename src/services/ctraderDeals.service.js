import CtraderDealsModel from "../models/TradeModels/CtraderDeals.model";
import mongoose from "mongoose";

const ctraderDealsService = {
  getPaginated: async (page, limit, filters = {}) => {
    return CtraderDealsModel.paginate(filters, {
      page,
      limit,
      populate: ["account", { path: "user", select: "first_name" }],
    });
  },
  createOrUpdateDeal: async (
    deal,
    account_id,
    user_id,
    order_id,
    position_id,
    enviroment
  ) => {
    return CtraderDealsModel.findOneAndUpdate(
      { dealId: deal.dealId, account: account_id },
      {
        user: user_id,
        account: account_id,
        order: order_id,
        position: position_id,
        ...deal,
        environment_type: enviroment,
      },
      { upsert: true, returnDocument: "after" }
    );
  },
  calculateVolumeByAccountId: async (account_id) => {
    let result = await CtraderDealsModel.aggregate([
      {
        $match: {
          account: mongoose.Types.ObjectId(account_id),
        },
      },
      {
        $group: {
          _id: "$account",
          volume: { $sum: "$volume" },
        },
      },
      { $project: { _id: 0, volume: { $divide: ["$volume", 100000] } } },
    ]);

    if (result.length == 0) {
      return {
        volume: 0,
      };
    }
    return result[0];
  },
  tradesInfo: async (account_id, enviroment) => {
    const [result] = await CtraderDealsModel.aggregate([
      {
        $match: {
          account: mongoose.Types.ObjectId(account_id),
          closePositionDetail: { $exists: true },
        },
      },
      {
        $addFields: {
          action: "$tradeSide",
          crrCommission: {
            $divide: [{ $toDouble: "$closePositionDetail.commission" }, 100],
          },
          grossProfit: {
            $divide: [{ $toDouble: "$closePositionDetail.profit" }, 100],
          },
          netProfit: {
            $divide: [
              {
                $add: [
                  { $toDouble: "$closePositionDetail.profit" },
                  { $toDouble: "$closePositionDetail.commission" },
                ],
              },
              100,
            ],
          },
          points: {
            $subtract: ["$executionPrice", "$closePositionDetail.entryPrice"],
          },
          volumeInPips: {
            $divide: [{ $toDouble: "$volume" }, { $toDouble: "$lotSize" }],
          },
        },
      },
      {
        $lookup: {
          from: "ctraderpositions",
          localField: "positionId",
          foreignField: "positionId",
          as: "positions",
          pipeline: [{ $match: { environment_type: enviroment } }],
        },
      },
      {
        $group: {
          _id: "$account",
          wins: { $sum: { $cond: [{ $gt: ["$netProfit", 0] }, 1, 0] } },
          loses: { $sum: { $cond: [{ $lt: ["$netProfit", 0] }, 1, 0] } },
          totalWins: {
            $sum: { $cond: [{ $gt: ["$netProfit", 0] }, "$netProfit", 0] },
          },
          totalCommission: { $sum: "$crrCommission" },
          totalProfit: { $sum: "$netProfit" },
          totalLoses: {
            $sum: { $cond: [{ $lt: ["$netProfit", 0] }, "$netProfit", 0] },
          },
          totalDuration: {
            $sum: {
              $subtract: [
                {
                  $toLong: {
                    $getField: {
                      field: "closeTimestamp",
                      input: {
                        $getField: {
                          field: "tradeData",
                          input: { $arrayElemAt: ["$positions", 0] },
                        },
                      },
                    },
                  },
                },
                {
                  $toLong: {
                    $getField: {
                      field: "openTimestamp",
                      input: {
                        $getField: {
                          field: "tradeData",
                          input: { $arrayElemAt: ["$positions", 0] },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
          points: { $sum: "$points" },
          bestPoints: { $max: "$points" },
          wortsPoints: { $min: "$points" },
          bestTrade: { $max: "$netProfit" },
          worstTrade: { $min: "$netProfit" },
          longTrades: {
            $sum: { $cond: [{ $eq: ["$action", "BUY"] }, 1, 0] },
          },
          shortTrades: {
            $sum: { $cond: [{ $eq: ["$action", "SELL"] }, 1, 0] },
          },
          profitableLongTrades: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$action", "BUY"] },
                    { $gt: ["$netProfit", 0] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          profitableShortTrades: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$action", "SELL"] },
                    { $gt: ["$netProfit", 0] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          count: { $sum: 1 },
          totalVolumeInPips: { $sum: "$volumeInPips" },
        },
      },
    ]);
    if (!result) return {};
    return {
      ...result,
      points: (result.points * 100).toFixed(2),
      bestPoints: (result.bestPoints * 100).toFixed(2),
      wortsPoints: (result.wortsPoints * 100).toFixed(2),
      avgOrderDuration: result.count ? result.totalDuration / result.count : 0,
      averageWins: result.wins ? result.totalWins / result.wins : 0,
      averageLoss: result.loses ? result.totalLoses / result.loses : 0,
      profitability: result.count ? result.totalWins / result.count : 0,
      profitFactor: result.totalLoses
        ? result.totalWins / result.totalLoses
        : 0,
      winRate: result.count ? result.wins / result.count : 0,
      lossRate: result.count ? result.loses / result.count : 0,
      closedPL: result.totalProfit,
      totalTrades: result.count,
      profitableLongTradesPercent: result.longTrades
        ? (result.profitableLongTrades / result.longTrades) * 100
        : 0,
      profitableShortTradesPercent: result.shortTrades
        ? (result.profitableShortTrades / result.shortTrades) * 100
        : 0,
      expectancy: result.wins
        ? parseFloat(((result.loses / result.wins) * 100).toFixed(2))
        : 0,
    };
  },
  getClosedDealsByAccountId: async (account_id) => {
    return CtraderDealsModel.find({
      account: mongoose.Types.ObjectId(account_id),
      closePositionDetail: { $exists: true },
    });
  },
};

export default ctraderDealsService;
