import { RequestHandler } from "express";
import { PERMISSIONS } from "../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../middleware/permissions.middleware";
import userTransactionsDailyStatsService from "../../../../services/userTransactionsDailyStats.service";
import Joi from "joi";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  // Business logic
  const result =
    await userTransactionsDailyStatsService.getMonthTransactionsStats(
      req.selectedBrand,
      req.allowedCountries
    );
  res.status(200).json(result);
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [
      userHasAnyPermission([
        PERMISSIONS.DEMOGRAPHICS.get_transactions_per_month,
      ]),
    ],
  },
};
