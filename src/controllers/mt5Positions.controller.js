import userAccountsService from "../services/userAccounts.service.js";
import mt5TradesService from "../services/mt5Trades.service.js";
import HTTPError from "../utils/HTTPError.js";
import errorCodes from "../config/errorCodes.js";
import { TRADE_SERVERS } from "../config/enums.js";

const mt5PositionsController = {
  /**
   * @param {import("../interfaces/mt5Types").MT5Position} position
   * @param {"live" | "demo"} env
   */
  createPosition: async (position, env) => {
    const account = await userAccountsService.getUserMt5AccountByLoginId(
      position.login,
      env
    );

    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }

    const _position = await mt5TradesService.createPosition(
      position,
      account._id,
      env,
      env === "live"
        ? TRADE_SERVERS.TIO_MT5_LIVE_1
        : TRADE_SERVERS.TIO_MT5_DEMO_1
    );

    console.log(
      `[MT5 Webhook] - Create Position: ${position.positionId} => ${_position._id}`
    );
  },

  /**
   * @param {import("../interfaces/mt5Types").MT5Position} position
   * @param {"live" | "demo"} env
   */
  updatePosition: async (position, env) => {
    const account = await userAccountsService.getUserMt5AccountByLoginId(
      position.login,
      env
    );

    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }

    const _position = await mt5TradesService.updatePosition(
      position,
      account._id,
      env,
      env === "live"
        ? TRADE_SERVERS.TIO_MT5_LIVE_1
        : TRADE_SERVERS.TIO_MT5_DEMO_1
    );

    console.log(
      `[MT5 Webhook] - Update Position: ${position.positionId} => ${_position._id}`
    );
  },
  /**
   * @param {import("../interfaces/mt5Types").MT5Position} position
   * @param {"live" | "demo"} env
   */
  deletePosition: async (position, env) => {
    let login_id = position.login;
    //find user account by login id and environment
    const account = await userAccountsService.getUserMt5AccountByLoginId(
      login_id,
      env
    );

    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }

    const _position = await mt5TradesService.deletePosition(
      position,
      account._id,
      env,
      env === "live"
        ? TRADE_SERVERS.TIO_MT5_LIVE_1
        : TRADE_SERVERS.TIO_MT5_DEMO_1
    );

    console.log(
      `[MT5 Webhook] - Delete Position: ${position.positionId} => ${_position?._id}`
    );
  },
};

export default mt5PositionsController;
