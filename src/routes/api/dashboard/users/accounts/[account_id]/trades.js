import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import userAccountsService from "../../../../../../services/userAccounts.service";
import HTTPError from "../../../../../../utils/HTTPError";
import errorCodes from "../../../../../../config/errorCodes";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../../config/permissions";
import { CTRADER_LEVERAGES } from "../../../../../../config/leverages";
import { CTRADER_ACCOUNT_TYPES } from "../../../../../../config/accountTypes";
import { mongooseIDFunction } from "../../../../../../utils/customValidation";
import Joi from "joi";
import { RequestHandler } from "express";
import mongoose from "mongoose";
import mt5TraderService from "../../../../../../services/mt5Trades.service";
import ctraderTradesService from "../../../../../../services/ctraderTrades.service";
import mt4TradesService from "../../../../../../services/mt4Trades.service";

const getAccountTrades = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
  type: Joi.string().valid("open", "closed").default("closed"),
  account_id: Joi.string().custom(mongooseIDFunction).required(),
}).unknown(true);
/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = getAccountTrades.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid request query", 400, {
      ...error,
      ...errorCodes.queryValidation,
    });
  }
  const [account] = await userAccountsService.getAccountByIdAndBrand(
    value.account_id,
    req.selectedBrand,
    req.allowedCountries
  );
  if (!account) {
    throw new HTTPError(
      "Account not found",
      404,
      errorCodes.userAccountNotFound
    );
  }

  if (account.platform === "ctrader") {
    if (value.type === "closed") {
      let trades = await ctraderTradesService.getClosedTradesPaginated({
        accountId: value.account_id,
        page: value.page,
        limit: value.limit,
      });
      let totals = await ctraderTradesService.getClosedTradesTotalsForAccount(
        value.account_id
      );
      res.status(200).json({ ...trades, ...totals });
    } else {
      let trades = await ctraderTradesService.getOpenTradesPaginated({
        accountId: value.account_id,
        page: value.page,
        limit: value.limit,
      });
      res.status(200).json(trades);
    }
  } else if (account.platform === "mt5") {
    if (value.type === "closed") {
      let trades = await mt5TraderService.getClosedTradesPaginated({
        accountId: value.account_id,
        page: value.page,
        limit: value.limit,
      });
      let totals = await mt5TraderService.getClosedTradesTotalsForAccount(
        value.account_id
      );
      res.status(200).json({ ...trades, ...totals });
    } else {
      let trades = await mt5TraderService.getOpenTradesPaginated({
        accountId: value.account_id,
        page: value.page,
        limit: value.limit,
      });
      res.status(200).json(trades);
    }
  } else if (account.platform === "mt4") {
    if (value.type === "closed") {
      let trades = await mt4TradesService.getClosedTradesPaginated({
        accountId: value.account_id,
        page: value.page,
        limit: value.limit,
      });
      let totals = await mt4TradesService.getClosedTradesTotalsForAccount(
        value.account_id
      );
      res.status(200).json({ ...trades, ...totals });
    } else {
      let trades = await mt4TradesService.getOpenTradesPaginated({
        accountId: value.account_id,
        page: value.page,
        limit: value.limit,
      });
      res.status(200).json(trades);
    }
  } else {
    res.status(500).json("Unknown platform");
  }
};

export default {
  middleware: {
    all: [
      isCRMUser,
      checkBrandAccess,
      userHasAnyPermission([PERMISSIONS.ACCOUNTS.view_trades]),
    ],
  },
};
