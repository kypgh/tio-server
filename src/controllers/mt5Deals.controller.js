import userAccountsService from "../services/userAccounts.service.js";
import mt5TradesService from "../services/mt5Trades.service.js";
import usersService from "../services/users.service.js";
import HTTPError from "../utils/HTTPError.js";
import errorCodes from "../config/errorCodes.js";
import { TRADE_SERVERS } from "../config/enums.js";

const mt5DealsController = {
  /**
   * @param {import("../interfaces/mt5Types").MT5Deal} deal
   * @param {"live" | "demo"} env
   */
  createDeal: async (deal, env) => {
    const account = await userAccountsService.getUserMt5AccountByLoginId(
      deal.login,
      env
    );

    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    const _deal = await mt5TradesService.createDeal(
      deal,
      account._id,
      env,
      TRADE_SERVERS.TIO_MT5_1
    );
    console.log(`[MT5 Webhook] - Create deal: ${deal.dealId} => ${_deal._id}`);

    // await usersService.checkUserFirstTimeTrade(account.user, _deal);
  },
  /**
   * @param {import("../interfaces/mt5Types").MT5Deal} deal
   * @param {"live" | "demo"} env
   */
  updateDeal: async (deal, env) => {
    const account = await userAccountsService.getUserMt5AccountByLoginId(
      deal.login,
      env
    );

    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }

    const _deal = await mt5TradesService.updateDeal(
      deal,
      account._id,
      env,
      TRADE_SERVERS.TIO_MT5_1
    );
    console.log(`[MT5 Webhook] - Update deal: ${deal.dealId} => ${_deal._id}`);
  },
  /**
   * @param {import("../interfaces/mt5Types").MT5Deal} deal
   * @param {"live" | "demo"} env
   */
  deleteDeal: async (deal, env) => {
    const _deal = await mt5TradesService.deleteDeal(
      deal.dealId,
      env,
      TRADE_SERVERS.TIO_MT5_1
    );
    console.log(`[MT5 Webhook] - Delete deal: ${deal.dealId} => ${_deal._id}`);
  },
};

export default mt5DealsController;
