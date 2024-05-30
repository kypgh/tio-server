import { TRADE_SERVERS } from "../config/enums.js";
import errorCodes from "../config/errorCodes.js";
import mt5TradesService from "../services/mt5Trades.service.js";
import userAccountsService from "../services/userAccounts.service.js";
import HTTPError from "../utils/HTTPError.js";

const mt5OrdersController = {
  /**
   * @param {import("../interfaces/mt5Types").MT5Order} order
   * @param {"live" | "demo"} env
   */
  createOrder: async (order, env) => {
    const account = await userAccountsService.getUserMt5AccountByLoginId(
      order.login,
      env
    );
    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    const _order = await mt5TradesService.createOrder(
      order,
      account._id,
      env,
      env === "live"
        ? TRADE_SERVERS.TIO_MT5_LIVE_1
        : TRADE_SERVERS.TIO_MT5_DEMO_1
    );
    console.log(
      `[MT5 Webhook] - Create Order: ${order.orderId} => ${_order._id}`
    );
  },
  /**
   * @param {import("../interfaces/mt5Types").MT5Order} order
   * @param {"live" | "demo"} env
   */
  updateOrder: async (order, env) => {
    const account = await userAccountsService.getUserMt5AccountByLoginId(
      order.login,
      env
    );

    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }

    const _order = await mt5TradesService.updateOrder(
      order,
      account._id,
      env,
      env === "live"
        ? TRADE_SERVERS.TIO_MT5_LIVE_1
        : TRADE_SERVERS.TIO_MT5_DEMO_1
    );
    console.log(
      `[MT5 Webhook] - Update Order: ${order.orderId} => ${_order._id}`
    );
  },
  /**
   * @param {import("../interfaces/mt5Types").MT5Order} order
   * @param {"live" | "demo"} env
   */
  deleteOrder: async (order, env) => {
    const _order = await mt5TradesService.deleteOrder(
      order.orderId,
      env,
      env === "live"
        ? TRADE_SERVERS.TIO_MT5_LIVE_1
        : TRADE_SERVERS.TIO_MT5_DEMO_1
    );
    console.log(
      `[MT5 Webhook] - Delete Order: ${order.orderId} => ${_order._id}`
    );
  },
};

export default mt5OrdersController;
