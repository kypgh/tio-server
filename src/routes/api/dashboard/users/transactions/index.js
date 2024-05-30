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
  fieldValidationSchema,
  filterValidationSchema,
  sortValidationSchema,
} from "../../../../../utils/customValidation";
import HTTPError from "../../../../../utils/HTTPError";
import responseUtils from "../../../../../utils/response.utils";
import _ from "lodash";
import helperFunctions from "../../../../../utils/helper.functions";
import Currency from "../../../../../utils/Currency";
import { DateTime } from "luxon";

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
    user_id: (v) => ({ user: mongoose.Types.ObjectId(v) }),
    userAccount: (v) => ({ userAccount: mongoose.Types.ObjectId(v) }),
    transaction_type: "transaction_type",
    status: "transaction_status",
    currency: "currency",
    amount: { validation: Joi.number(), key: "amount" },
    processedAmount: { validation: Joi.number(), key: "processed_amount" },
    processedUsdAmount: {
      validation: Joi.number(),
      key: "processed_usd_amount",
    },
    fromDate: (value) => ({ createdAt: { $gte: new Date(value) } }),
    toDate: (value) => ({ createdAt: { $lte: new Date(value) } }),
  }),
  fields: fieldValidationSchema(FIELDS.userTransactions),
  export: Joi.string()
    .trim()
    .allow(...Object.values(ALLOWED_EXPORT_FORMATS)),
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
  const transactions = await userTransactionsService.getUserTransactions({
    ...value,
    paginated: !value.export,
    brand: req.selectedBrand,
    allowedCountries: req.allowedCountries,
  });

  if (!value.export) {
    res.status(200).json(transactions);
    return;
  }
  const csv = exportService.jsonToCSV(transactions, [
    { label: "User ID", value: "user.readableId" },
    { label: "Name", value: (v) => `${v.user.first_name} ${v.user.last_name}` },
    { label: "Email", value: "user.email" },
    {
      label: "Account",
      value: (v) => `${v.userAccount.platform} - ${v.userAccount.login_id}`,
    },
    { label: "Tx Type", value: (v) => _.lowerCase(v.transaction_type) },
    { label: "Tx Status", value: "transaction_status" },
    {
      label: "Tx Method",
      value: (v) => helperFunctions.getTransactionMethod(v),
    },
    {
      label: "Amount (USD)",
      value: (v) =>
        !_.isNil(v.processed_usd_amount)
          ? Currency.fromPrecise({
              amount: v.processed_usd_amount,
              currency: "USD",
            }).toFormat("AA")
          : "",
    },
    {
      label: "Amount (Base Currency)",
      value: (v) =>
        !_.isNil(v.processed_currency)
          ? Currency.fromPrecise({
              amount: v.processed_amount,
              currency: v.processed_currency,
            }).toFormat("AA")
          : Currency.fromPrecise({
              amount: v.amount,
              currency: v.currency,
            }).toFormat("AA"),
    },
    { label: "Currency", value: "currency" },
    { label: "Processed Currency", value: "processed_currency" },
    { label: "Fee", value: "fee" },
    { label: "Promo Code", value: "variable1" },
    { label: "Notes", value: "variable2" },
    {
      label: "Card",
      value: (v) =>
        !!v.card ? `${v.card.card_type} - ${v.card.card_number}` : "",
    },
    {
      label: "Wallet",
      value: (v) => (v.wallet ? v.wallet.account_identifier : ""),
    },
    {
      label: "Created At",
      value: (v) =>
        DateTime.fromJSDate(new Date(v.createdAt)).toFormat("dd/MM/yyyy HH:mm"),
    },
    {
      label: "Updated At",
      value: (v) =>
        DateTime.fromJSDate(new Date(v.updatedAt)).toFormat("dd/MM/yyyy HH:mm"),
    },
  ]);
  return responseUtils.sendExportResponse({
    csv,
    format: value.export,
    res,
    filename: "transactions",
  });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.TRANSACTIONS.view_transactions])],
  },
};
