import CtraderDealsModel from "../models/TradeModels/CtraderDeals.model";
import mt5TradesService from "./mt5Trades.service";
import ctraderDealsService from "./ctraderDeals.service";
import ctraderTradesService from "./ctraderTrades.service";
import mt4TradesService from "./mt4Trades.service";
import { TIO_PLATFORMS } from "../config/enums";

const tradesService = {
  getAccountTrades: async ({ accountId, page = 1, limit = 50 }) => {
    return CtraderDealsModel.paginate(
      {
        account: accountId,
      },
      {
        page,
        limit,
        populate: {
          path: "order position",
        },
        sort: { executionTimestamp: -1 },
      }
    );
  },
  calculateTradesInfo: async (account) => {
    if (account.platform === "mt5") {
      return mt5TradesService.tradesInfo(account._id);
    } else if (account.platform === "ctrader") {
      return ctraderDealsService.tradesInfo(
        account._id,
        account.environment_type
      );
    } else if (account.platform === "mt4") {
      return mt4TradesService.tradesInfoForAccount(account._id);
    }
  },
  getPositionsSummaryForAccounts: async (accounts) => {
    const trades = await Promise.all(
      accounts.map(async (account) => {
        if (account.platform === "ctrader") {
          return ctraderTradesService.getAccountPositionSummary(account);
        } else if (account.platform === "mt5") {
          return mt5TradesService.getAccountPositionSummary(account);
        } else if (account.platform === "mt4") {
          return mt4TradesService.getAccountPositionSummary(account);
        } else {
          return [];
        }
      })
    );

    return trades.flat().reduce((acc, curr) => {
      const existing = acc.find((v) => v.symbol === curr.symbol);
      if (existing) {
        existing.total += curr.total;
        existing.long += curr.long;
        existing.short += curr.short;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
  },
  calculateAccountVolume: async (account) => {
    if (account.platform === TIO_PLATFORMS.ctrader) {
      return ctraderTradesService.getAccountTotalVolume(account);
    } else if (account.platform === TIO_PLATFORMS.mt5) {
      return mt5TradesService.getAccountTotalVolume(account);
    } else if (account.platform === TIO_PLATFORMS.mt4) {
      return mt4TradesService.getAccountTotalVolume(account);
    } else {
      throw new Error("Invalid account platform");
    }
  },
};

export default tradesService;
