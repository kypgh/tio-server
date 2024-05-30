import { RequestHandler } from "express";
import Joi from "joi";
import mongoose from "mongoose";
import { ALLOWED_EXPORT_FORMATS } from "../../../../../config/enums";
import errorCodes from "../../../../../config/errorCodes";
import FIELDS from "../../../../../config/fields";
import { PERMISSIONS } from "../../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import exportService from "../../../../../services/export.service";
import userTransactionsService from "../../../../../services/userTransactions.service";
import {
  filterValidationSchema,
  sortValidationSchema,
} from "../../../../../utils/customValidation";
import HTTPError from "../../../../../utils/HTTPError";

const getUserTransactionsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
  sort: sortValidationSchema({
    cid: "user.ctrader_id",
    amount: "amount",
    processedAmount: "processed_amount",
    processedUsdAmount: "processed_usd_amount",
    currency: "currency",
    status: "transaction_status",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }),
  filters: filterValidationSchema({
    fromDate: (value) => ({ createdAt: { $gte: new Date(value) } }),
    toDate: (value) => ({ createdAt: { $lte: new Date(value) } }),
  }),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  // Validate request query
  const { value, error } = getUserTransactionsQuerySchema.validate(req.query);

  if (error) {
    throw new HTTPError("Invalid request query", 400, {
      ...error,
      ...errorCodes.queryValidation,
    });
  }
  const transactions =
    await userTransactionsService.getFirstTimeDepositsPaginated({
      ...value,
      brand: req.selectedBrand,
      allowedCountries: req.allowedCountries,
    });

  res.status(200).json(transactions);
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.TRANSACTIONS.view_transactions])],
  },
};
