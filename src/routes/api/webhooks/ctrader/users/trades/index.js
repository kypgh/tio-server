import { RequestHandler } from "express";
import { ALLOWED_API_KEYS, ENV } from "../../../../../../config/envs";
import errorCodes from "../../../../../../config/errorCodes";
import { isValidAPIKey } from "../../../../../../middleware/webhook.middleware";
import ctraderDealsService from "../../../../../../services/ctraderDeals.service";
import ctraderOrdersService from "../../../../../../services/ctraderOrders.service";
import ctraderPositionsService from "../../../../../../services/ctraderPositions.service";
import userAccountsService from "../../../../../../services/userAccounts.service";
import usersService from "../../../../../../services/users.service";
import HTTPError from "../../../../../../utils/HTTPError";
import { TIO_BRANDS } from "../../../../../../config/enums";

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  try {
    const { order, position, deal, traderId, env_type } = req?.body;

    if (!traderId) {
      throw new HTTPError("Trader ID not send in request", 400, {
        message: "Trader ID not send in request",
      });
    }

    let account;

    if (ENV !== "production") {
      let brand =
        req?.headers?.brand === "pix" ? TIO_BRANDS.PIX : TIO_BRANDS.TIO;

      account = await userAccountsService.getStagingUserAccountByTraderId(
        traderId,
        env_type,
        brand
      );
    } else {
      account = await userAccountsService.getUserAccountByTraderId(
        traderId,
        env_type
      );
    }

    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }

    const _position = await ctraderPositionsService.createOrUpdatePosition(
      position,
      account._id,
      account.user,
      account.environment_type
    );
    const _order = await ctraderOrdersService.createOrUpdateOrder(
      order,
      account._id,
      account.user,
      _position._id,
      account.environment_type
    );
    let logMsg =
      `[WEBHOOK TRADES] - ${
        req.body.action || ""
      } - Order action saved successfully` +
      ` - Order ID: ${order.orderId} => ${_order._id}` +
      ` - Position ID: ${position.positionId} => ${_position._id}`;

    if (deal) {
      const _deal = await ctraderDealsService.createOrUpdateDeal(
        deal,
        account._id,
        account.user,
        _order._id,
        _position._id,
        account.environment_type
      );
      logMsg += ` - Deal ID: ${deal.dealId} => ${_deal._id}`;
      await usersService.checkUserFirstTimeTrade(
        account.user?._id || account.user,
        _deal
      );
    }

    res.status(200).json({ message: "Updated" });
  } catch (err) {
    if (err.name === "HTTPError") {
      res.status(err.status).json(err.responseBody);
      return;
    }
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
};

export default {
  middleware: {
    all: [isValidAPIKey(ALLOWED_API_KEYS)],
  },
};
