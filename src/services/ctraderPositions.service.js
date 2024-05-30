import { CTRADER_SYMBOLS } from "../config/ctraderEnums";
import CtraderPositionsModel from "../models/TradeModels/CtraderPositions.model";
import utilFunctions from "../utils/util.functions";
import mongoose from "mongoose";

const ctraderPositionsService = {
  get: async ({
    page,
    limit,
    filters = {},
    fields = [],
    sort,
    paginated = true,
  }) => {
    const project = fields.reduce((acc, v) => ({ ...acc, [v.value]: 1 }), {});
    // prettier-ignore
    const aggregation = CtraderPositionsModel.aggregate([
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user", pipeline: [{ $project: { "password": 0 }}] } },
      { $unwind: "$user" },
      { $lookup: { from: "useraccounts", localField: "account", foreignField: "_id", as: "account" } },
      { $unwind: "$account" },
      { $match: filters }, 
      ... (fields && fields.length > 0 ? [{ $project: project }] : []),
    ]);
    let result;
    if (paginated) {
      result = await CtraderPositionsModel.aggregatePaginate(aggregation, {
        page,
        limit,
        sort: sort || { createdAt: -1 },
        collation: { locale: "en", numericOrdering: true },
      });
      utilFunctions.decimal2JSON(result.docs);
    } else {
      result = await aggregation
        .collation({ locale: "en", numericOrdering: true })
        .sort(sort || { createdAt: -1 });
      utilFunctions.decimal2JSON(result);
    }
    return result;
  },
  getPaginated: async (page, limit, filters = {}) => {
    let aggregation = CtraderPositionsModel.aggregate([{ $match: filters }]);

    const results = await CtraderPositionsModel.aggregatePaginate(aggregation, {
      page,
      limit,
      populate: ["account"],
    });
    return results;
  },
  findByPositionId: async (positionId) => {
    return CtraderPositionsModel.findOne({ positionId });
  },
  createOrUpdatePosition: async (position, account_id, user_id, enviroment) => {
    let tradeData = Object.entries(position.tradeData || {}).reduce(
      (acc, [key, value]) => {
        acc[`tradeData.${key}`] = value;
        return acc;
      },
      {}
    );
    delete position.tradeData;
    return CtraderPositionsModel.findOneAndUpdate(
      { positionId: position.positionId, account: account_id },
      {
        $set: {
          user: user_id,
          account: account_id,
          environment_type: enviroment,
          ...position,
          ...tradeData,
        },
      },
      { upsert: true, returnDocument: "after" }
    );
  },
  totalTrades: async (account_id) => {
    return CtraderPositionsModel.count({
      account: mongoose.Types.ObjectId(account_id),
    });
  },
  getClosePositionsByAccountId: async (account_id) => {
    return CtraderPositionsModel.find({
      account: mongoose.Types.ObjectId(account_id),
      positionStatus: "POSITION_STATUS_CLOSED",
    });
  },
};

export default ctraderPositionsService;
