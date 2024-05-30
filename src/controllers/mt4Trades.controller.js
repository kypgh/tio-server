import userAccountsService from "../services/userAccounts.service.js";
import HTTPError from "../utils/HTTPError.js";
import errorCodes from "../config/errorCodes.js";
import mt4TradesService from "../services/mt4Trades.service.js";

const mt4TradesController = {
  /**
   * @param {import("../interfaces/mt4Types.js").Mt4Trade} trade
   * @param {"live" | "demo"} env
   */
  createTrade: async (trade, env) => {
    const account = await userAccountsService.getUserMt4AccountByLoginId(
      trade.login,
      env
    );

    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    const _trade = await mt4TradesService.createTrade(
      trade,
      account._id,
      env,
      account.server
    );
    console.log(
      `[MT4 Webhook] - Create trade order: ${trade.order} => ${_trade._id}`
    );

    // await usersService.checkUserFirstTimeTrade(account.user, _deal);
  },
  /**
   * @param {import("../interfaces/mt4Types.js").Mt4Trade} trade
   * @param {"live" | "demo"} env
   */
  updateTrade: async (trade, env) => {
    const account = await userAccountsService.getUserMt4AccountByLoginId(
      trade.login,
      env
    );
    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }

    const _trade = await mt4TradesService.updateTrade(trade, account.server);
    console.log(
      `[MT4 Webhook] - Update trade order: ${trade.order} => ${_trade._id}`
    );
  },
  /**
   * @param {import("../interfaces/mt4Types.js").Mt4Trade} trade
   * @param {"live" | "demo"} env
   */
  deleteTrade: async (trade, env) => {
    const account = await userAccountsService.getUserMt4AccountByLoginId(
      trade.login,
      env
    );

    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    const _trade = await mt4TradesService.deleteTrade(trade, account.server);
    console.log(
      `[MT4 Webhook] - Delete trade order: ${trade.order} => ${_trade._id}`
    );
  },
};

export default mt4TradesController;
