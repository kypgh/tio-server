import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import { PERMISSIONS } from "../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../middleware/permissions.middleware";
import usersService from "../../../../services/users.service";
import HTTPError from "../../../../utils/HTTPError";
import { filterValidationSchema } from "../../../../utils/customValidation";
import exportService from "../../../../services/export.service";
import { ALLOWED_EXPORT_FORMATS } from "../../../../config/enums";
import responseUtils from "../../../../utils/response.utils";

const getAllUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
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
  const users = await usersService.getBalanceReport({
    page: value.page,
    limit: value.limit,
    brand: req.selectedBrand,
    countryWhitelist: req.allowedCountries,
    paginated: !value.export,
  });

  if (!value.export) {
    return res.status(200).json(users);
  }
  const csv = exportService.jsonToCSV(users, [
    { label: "ID", value: "readableId" },
    { label: "Name", value: (v) => `${v.first_name} ${v.last_name}` },
    { label: "Email", value: "email" },
    { label: "Country", value: "country" },
    { label: "Total Balance", value: "balanceUSD" },
    { label: "Total Equity", value: "equityUSD" },
    { label: "Balance CTrader", value: "balanceCtraderUSD" },
    { label: "Equity CTrader", value: "equityCtraderUSD" },
    { label: "Balance MT5", value: "balanceMt5USD" },
    { label: "Equity MT5", value: "equityMt5USD" },
    { label: "Balance MT4", value: "balanceMt4USD" },
    { label: "Equity MT4", value: "equityMt4USD" },
  ]);
  return responseUtils.sendExportResponse({
    csv,
    format: value.export,
    res,
    filename: "balance_report",
  });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.REPORTS.balance_report])],
  },
};
