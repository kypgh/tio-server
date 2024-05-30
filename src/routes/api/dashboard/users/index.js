import { RequestHandler } from "express";
import Joi from "joi";
import mongoose from "mongoose";
import { ALLOWED_EXPORT_FORMATS } from "../../../../config/enums";
import errorCodes from "../../../../config/errorCodes";
import FIELDS from "../../../../config/fields";
import { PERMISSIONS } from "../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../middleware/permissions.middleware";
import exportService from "../../../../services/export.service";
import usersService from "../../../../services/users.service";
import {
  fieldValidationSchema,
  filterValidationSchema,
  sortValidationSchema,
} from "../../../../utils/customValidation";
import HTTPError from "../../../../utils/HTTPError";
import responseUtils from "../../../../utils/response.utils";
import { DateTime } from "luxon";

const getAllUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
  search: Joi.string(),
  filters: filterValidationSchema({
    country: "country",
    liveAccounts: {
      validation: Joi.number(),
      key: "accounts.live",
    },
    demoAccounts: {
      validation: Joi.number(),
      key: "accounts.demo",
    },
    kycStatus: {
      validation: Joi.string(),
      key: "flags.kycStatus",
    },
    emailVerified: {
      validation: Joi.boolean(),
      key: "flags.emailVerified",
    },
    deviceType: "metadata.deviceType",
    language: "metadata.language",
    fromTransactionDate: (value) => ({
      "user_transactions.createdAt": { $gte: new Date(value) },
    }),
    toTransactionDate: (value) => ({
      "user_transactions.createdAt": { $lte: new Date(value) },
    }),
    fromDate: (value) => ({ createdAt: { $gte: new Date(value) } }),
    toDate: (value) => ({ createdAt: { $lte: new Date(value) } }),
    ftdAmount: (value, op) => ({
      "first_time_deposit.amount": {
        ["$" + op]: mongoose.Types.Decimal128(value),
      },
    }),
    depositAmount: {
      validation: Joi.number(),
      key: "accounts.total_deposits_usd",
    },
    withdrawalAmount: {
      validation: Joi.number(),
      key: "accounts.total_withdrawals_usd",
    },
    hasDocuments: {
      validation: Joi.boolean(),
      key: "flags.hasDocuments",
    },
    utm_source: (val) => ({ "metadata.utm_source": new RegExp(val, "i") }),
    utm_medium: (val) => ({ "metadata.utm_medium": new RegExp(val, "i") }),
    utm_campaign: (val) => ({ "metadata.utm_campaign": new RegExp(val, "i") }),
    utm_term: (val) => ({ "metadata.utm_term": new RegExp(val, "i") }),
    utm_content: (val) => ({ "metadata.utm_content": new RegExp(val, "i") }),
  }),
  sort: sortValidationSchema({
    cid: "ctrader_id",
    firstName: "first_name",
    lastName: "last_name",
    email: "email",
    country: "country",
    language: "metadata.language",
    deviceType: "metadata.deviceType",
    createdAt: "created_at",
    updatedAt: "updatedAt",
  }),
  export: Joi.string()
    .trim()
    .allow(...Object.values(ALLOWED_EXPORT_FORMATS)),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  // Validate request query
  const { value, error } = getAllUsersSchema.validate(req.query);

  if (error) {
    throw new HTTPError("Invalid request query", 400, {
      ...error,
      ...errorCodes.invalidQueryParams,
    });
  }
  // Business logic
  const users = await usersService.getUsers({
    page: value.page,
    limit: value.limit,
    filters: value.filters,
    search: value.search,
    sort: value.sort,
    paginated: !value.export,
    brand: req.selectedBrand,
    countryWhitelist: req.allowedCountries,
    ...(req.crm_user.department === "sales"
      ? {
          sales_agent: req.crm_user._id,
        }
      : {}),
  });

  if (!value.export) {
    return res.status(200).json(users);
  }
  const csv = exportService.jsonToCSV(users, [
    { label: "ID", value: "readableId" },
    { label: "Name", value: (v) => `${v.first_name} ${v.last_name}` },
    { label: "Email", value: "email" },
    { label: "Phone", value: (v) => `="${v.phone}"` }, // this will convert phone to string instead of treating it as a number
    { label: "Nationality", value: "nationality" },
    { label: "Language", value: "language" },
    { label: "Country", value: "country" },
    {
      label: "Adress",
      value: (v) =>
        [v.adress, v.houseNumber, v.unitNumber, v.city, v.postcode]
          .filter((v) => !!v)
          .join(", "),
    },
    { label: "Date of Birth", value: "dob" },
    { label: "Device", value: "metadata.deviceType" },
    {
      label: "Registered",
      value: (v) =>
        DateTime.fromJSDate(new Date(v.createdAt)).toFormat("dd/MM/yyyy HH:mm"),
    },
    {
      label: "Last Login",
      value: (v) =>
        DateTime.fromJSDate(new Date(v.last_login)).toFormat(
          "dd/MM/yyyy HH:mm"
        ),
    },
    {
      label: "FTD",
      value: (v) =>
        v.first_time_deposit
          ? `$${Number(v.first_time_deposit.amount).toFixed(
              2
            )}, on ${DateTime.fromJSDate(
              new Date(v.first_time_deposit.date_at)
            ).toFormat("dd/MM/yyyy")}`
          : "",
    },
    {
      label: "FTT",
      value: (v) =>
        v.first_time_trade
          ? `$${Number(v.first_time_trade.amount).toFixed(
              2
            )}, on ${DateTime.fromJSDate(
              new Date(v.first_time_trade.date_at)
            ).toFormat("dd/MM/yyyy")}`
          : "",
    },
  ]);
  return responseUtils.sendExportResponse({
    csv,
    format: value.export,
    res,
    filename: "clients",
  });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.USERS.get_users])],
  },
};
