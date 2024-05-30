import { RequestHandler } from "express";
import errorCodes from "../../../../../config/errorCodes";
import { isMembersAreaUser } from "../../../../../middleware/membersArea.middleware";
import { hasAccessToAccount } from "../../../../../middleware/hasAccessToAccount";
import userAccountsService from "../../../../../services/userAccounts.service";
import Joi from "joi";
import HTTPError from "../../../../../utils/HTTPError";
import mt5TraderService from "../../../../../services/mt5Trades.service";
import ctraderDealsService from "../../../../../services/ctraderDeals.service";
import mongoose from "mongoose";
import ctraderPositionsService from "../../../../../services/ctraderPositions.service";
import { CTRADER_POSITION_STATUS } from "../../../../../config/ctraderEnums";
import ctraderTradesService from "../../../../../services/ctraderTrades.service";
import mt4TradesService from "../../../../../services/mt4Trades.service";

const getAccountTradesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
  type: Joi.string().valid("open", "closed").default("closed"),
  accountId: Joi.string().required(),
});

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = getAccountTradesQuerySchema.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid request query", 400, {
      ...error,
      ...errorCodes.queryValidation,
    });
  }

  let account = req.userAccount;
  if (account.platform === "ctrader") {
    if (value.type === "closed") {
      let trades = await ctraderTradesService.getClosedTradesPaginated({
        accountId: value.accountId,
        page: value.page,
        limit: value.limit,
      });
      res.status(200).json(trades);
    } else {
      let trades = await ctraderTradesService.getOpenTradesPaginated({
        accountId: value.accountId,
        page: value.page,
        limit: value.limit,
      });
      res.status(200).json(trades);
    }
  } else if (account.platform === "mt5") {
    if (value.type === "closed") {
      let trades = await mt5TraderService.getClosedTradesPaginated({
        accountId: value.accountId,
        page: value.page,
        limit: value.limit,
      });
      res.status(200).json(trades);
    } else {
      let trades = await mt5TraderService.getOpenTradesPaginated({
        accountId: value.accountId,
        page: value.page,
        limit: value.limit,
      });
      res.status(200).json(trades);
    }
  } else if (account.platform === "mt4") {
    if (value.type === "closed") {
      let trades = await mt4TradesService.getClosedTradesPaginated({
        accountId: value.accountId,
        page: value.page,
        limit: value.limit,
      });
      res.status(200).json(trades);
    } else {
      let trades = await mt4TradesService.getOpenTradesPaginated({
        accountId: value.accountId,
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
    all: [isMembersAreaUser],
    get: [hasAccessToAccount],
  },
};
