import mongoose from "mongoose";
import { CTRADER_POSITION_STATUS } from "../config/ctraderEnums";
import CtraderDealsModel from "../models/TradeModels/CtraderDeals.model";
import CtraderPositionsModel from "../models/TradeModels/CtraderPositions.model";
import { DateTime } from "luxon";
import Currency from "../utils/Currency";
import userAccountsService from "./userAccounts.service";
import BigNumber from "bignumber.js";
import symbolService from "./symbol.service";
import { TRADE_SERVERS } from "../config/enums";
import ctraderService from "./ctrader.service";
import ctraderPriceFeedService from "./ctraderPriceFeed.service";

const getDigitsFromPrice = (price, _default = 5) => {
  try {
    return String(price).split(".")[1].length || 5;
  } catch (e) {
    return _default;
  }
};

const ctraderTradesService = {
  calculateTodaysClosedPl: async (accountIds) => {
    // prettier-ignore
    let result = await CtraderDealsModel.aggregate([
      { $match: { account: { $in: accountIds.map((v) => mongoose.Types.ObjectId(v)) }, closePositionDetail: { $exists: true }, executionTimestamp: { $gt: DateTime.now().startOf("day").toJSDate(), }, }, },
      { $group: { _id: null, totalPl: { $sum: { $toInt: "$closePositionDetail.profit" }, }, }, },
    ]);
    if (result[0]) {
      return result[0].totalPl / 100;
    } else {
      return 0;
    }
  },
  calculateOpenPl: async (accounts) => {
    const ctraderAccounts = accounts.filter((v) =>
      [
        TRADE_SERVERS.PIX_CTRADER_DEMO_1,
        TRADE_SERVERS.PIX_CTRADER_LIVE_1,
        TRADE_SERVERS.TIO_CTRADER_DEMO_1,
        TRADE_SERVERS.TIO_CTRADER_LIVE_1,
      ].includes(v.server)
    );
    const usdProfits = await Promise.all(
      ctraderAccounts.map(async (acc) => {
        const trades = await ctraderService(acc.server).getAccountOpenPositions(
          acc.login_id
        );
        if (!(trades.length > 0)) return 0;
        const symbolRequest = ctraderPriceFeedService.getDataRequestString(
          trades.map((v) => v.symbol)
        );
        const prices = await ctraderPriceFeedService
          .getPricesForSymbols(symbolRequest)
          .catch((err) => console.error(err));
        if (!prices) return 0;
        let profit = 0;
        for (const trade of trades) {
          const openProfit = ctraderPriceFeedService.calculateOpenProfit({
            accountCurrency: acc.currency,
            action: trade.direction,
            openPrice: trade.entryPrice,
            volume: trade.volume,
            symbol: trade.symbol,
            priceFeed: prices,
          });
          const curr = Currency.fromPrecise({
            amount: openProfit.profit,
            currency: openProfit.currency,
          });
          profit += Number(
            (await curr.convertToCurrency("USD")).getAmountPrecise()
          );
        }
        return profit;
      })
    );
    return usdProfits.reduce((a, b) => a + b, 0);
  },
  calculateProfitability: async (accountIds) => {
    // prettier-ignore
    let result = await CtraderDealsModel.aggregate([
      { $match: { account: { $in: accountIds.map((v) => mongoose.Types.ObjectId(v)) }, closePositionDetail: { $exists: true }, }, },
      { $group: { _id: null, totalWin: { $sum: { $cond: [{ $gt: ["$profit", 0] }, 1, 0] }, }, total: { $sum: 1, }, }, },
    ]);
    if (result[0] && result[0].total > 0) {
      return result[0].totalWin / result[0].total;
    } else {
      return 0;
    }
  },
  getAccountPositionSummary: async (account) => {
    //prettier-ignore
    const result = await CtraderPositionsModel.aggregate([
      { $match: { account: account._id,  positionStatus: CTRADER_POSITION_STATUS.POSITION_STATUS_CLOSED, }, },
      { $group: { _id: { symbol: "$tradeData.symbolId", tradeSide: "$tradeData.tradeSide", }, count: { $sum: 1 }, }, },
      { $group: { _id: "$_id.symbol", long: { $sum: { $cond: [{ $eq: ["$_id.tradeSide", "BUY"] }, "$count", 0], }, }, short: { $sum: { $cond: [{ $eq: ["$_id.tradeSide", "SELL"] }, "$count", 0], }, }, total: { $sum: "$count", }, }, },
    ]);
    return Promise.all(
      result
        .filter((v) => !!v._id)
        .map(async (v) => {
          const symbol = await symbolService.getCtraderSymbolById(
            v._id,
            account.server
          );
          return {
            _id: symbol.id,
            symbol: symbol?.symbol,
            group: symbol?.category,
            description: symbol?.metadata?.description ?? "",
            long: v.long,
            short: v.short,
            total: v.total,
          };
        })
    );
  },
  getClosedTradesPaginated: async ({ accountId, page, limit }) => {
    const account = await userAccountsService.getAccountById(accountId);
    const aggregation = CtraderDealsModel.aggregate([
      {
        $match: {
          account: mongoose.Types.ObjectId(accountId),
          closePositionDetail: { $exists: true },
        },
      },
      {
        $addFields: {
          closeTime: {
            $convert: { input: "$utcLastUpdateTimestamp", to: "long" },
          },
        },
      },
    ]);
    const results = await CtraderDealsModel.aggregatePaginate(aggregation, {
      page,
      limit,
      sort: { closeTime: -1 },
    });
    results.docs = await Promise.all(
      results.docs.map(async (doc) => {
        const symbol = await symbolService.getCtraderSymbolById(
          doc.symbolId,
          account.server
        );
        return {
          positionId: doc.positionId,
          action: doc.tradeSide,
          symbol: symbol?.symbol,
          category: symbol?.category,
          symbolDescription: symbol?.metadata?.description ?? "",
          openPrice: doc?.executionPrice,
          closePrice: doc?.closePositionDetail?.entryPrice,
          digitsPrice: getDigitsFromPrice(doc?.executionPrice),
          digitsCurrency: doc?.moneyDigits,
          currency: account.currency,
          swap: doc?.closePositionDetail?.swap,
          commission: doc?.closePositionDetail?.commission,
          grossProfit: new Currency({
            amount: doc.closePositionDetail.profit,
            currency: "USD",
          }).getAmountPrecise(),
          netProfit: new Currency({
            amount: doc.closePositionDetail.profit,
            currency: "USD",
          })
            .add(doc?.closePositionDetail?.commission)
            .add(doc?.closePositionDetail?.swap)
            .getAmountPrecise(),
          volume: BigNumber(doc?.closePositionDetail?.closedVolume)
            .dividedBy(doc?.lotSize)
            .toPrecision(2),
          lotSize: BigNumber(doc?.lotSize).dividedBy(100).toNumber(),
          openTime: new Date(
            Number(doc?.closePositionDetail?.offsetDealTimestamp)
          ).getTime(),
          closeTime: new Date(doc.closeTime).getTime(),
        };
      })
    );
    return results;
  },
  getClosedTradesTotalsForAccount: async (accountId) => {
    // prettier-ignore
    const [totals] = await CtraderDealsModel.aggregate([
      { $match: { account: mongoose.Types.ObjectId(accountId), closePositionDetail: { $exists: true }, }, },
      { $group: { _id: null, totalGrossProfit: { $sum: { $toInt: "$closePositionDetail.profit" }, }, totalNetProfit: { $sum: { $add: [ { $toInt: "$closePositionDetail.profit" }, { $toInt: "$closePositionDetail.commission" }, { $toInt: "$closePositionDetail.swap" }, ], }, }, totalSwap: { $sum: { $toInt: "$closePositionDetail.swap" }, }, totalCommission: { $sum: { $toInt: "$closePositionDetail.commission" }, }, totalVolume: { $sum: { $divide: [{$toInt: "$closePositionDetail.closedVolume" }, {$toInt: "$lotSize"}]}, }}}
    ]);
    return {
      totalGrossProfit: new Currency({
        amount: totals?.totalGrossProfit ?? 0,
        currency: "USD",
      }).getAmountPrecise(),
      totalNetProfit: new Currency({
        amount: totals?.totalNetProfit ?? 0,
        currency: "USD",
      }).getAmountPrecise(),
      totalSwap: new Currency({
        amount: totals?.totalSwap ?? 0,
        currency: "USD",
      }).getAmountPrecise(),
      totalCommission: new Currency({
        amount: totals?.totalCommission ?? 0,
        currency: "USD",
      }).getAmountPrecise(),
      totalVolume: new Currency({
        amount: totals?.totalVolume ?? 0,
        currency: "USD",
      }).getAmountPrecise(),
    };
  },
  getTotalClosedTradesForAccounts: async (accountIds) => {
    return CtraderDealsModel.countDocuments({
      account: accountIds.map((acc) => mongoose.Types.ObjectId(acc)),
      closePositionDetail: { $exists: true },
    });
  },
  getOpenTradesPaginated: async ({ accountId, page, limit }) => {
    const account = await userAccountsService.getAccountById(accountId);
    const results = await CtraderPositionsModel.paginate(
      {
        account: mongoose.Types.ObjectId(accountId),
        positionStatus: CTRADER_POSITION_STATUS.POSITION_STATUS_OPEN,
      },
      {
        page,
        limit,
        sort: { createdAt: -1 },
      }
    );
    results.docs = await Promise.all(
      results.docs.map(async (doc) => {
        const symbol = await symbolService.getCtraderSymbolById(
          doc.tradeData.symbolId,
          account.server
        );
        return {
          positionId: doc.positionId,
          action: doc.tradeData.tradeSide,
          symbol: symbol?.symbol,
          category: symbol?.category,
          symbolDescription: symbol?.metadata?.description ?? "",
          openPrice: doc?.price,
          digitsPrice: getDigitsFromPrice(doc?.price),
          digitsCurrency: doc?.moneyDigits,
          currency: account.currency,
          swap: BigNumber(doc?.swap)
            .dividedBy(10 ** doc?.moneyDigits)
            .toNumber(),
          commission: BigNumber(doc?.commission)
            .multipliedBy(2)
            .dividedBy(10 ** doc?.moneyDigits)
            .toNumber(),
          profit: 0,
          volume: BigNumber(doc?.tradeData?.volume)
            .dividedBy(10 ** doc?.moneyDigits)
            .toPrecision(2),
          volumeLots: BigNumber(doc?.tradeData?.volume)
            .dividedBy(doc?.tradeData?.lotSize)
            .toPrecision(doc?.moneyDigits),
          lotSize: BigNumber(doc?.tradeData?.lotSize).toNumber(),
          usedMargin: new Currency({
            amount: doc?.usedMargin,
            currency: "USD",
          }).getAmountPrecise(),
          openTime: new Date(Number(doc?.tradeData?.openTimestamp)).getTime(),
        };
      })
    );
    return results;
  },
  getAccountTotalVolume: async (account) => {
    const aggregation = await CtraderDealsModel.aggregate([
      {
        $match: {
          account: mongoose.Types.ObjectId(account._id),
          closePositionDetail: { $exists: true },
        },
      },
      {
        $project: {
          volume: "$closePositionDetail.closedVolume",
          lotSize: "$lotSize",
        },
      },
    ]);
    let volume = aggregation.reduce((acc, curr) => {
      return acc + Number(curr.volume) / Number(curr.lotSize);
    }, 0);
    return Number(volume.toFixed(4));
  },
};

export default ctraderTradesService;
