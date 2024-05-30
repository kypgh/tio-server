import { Parser } from "json2csv";
import { RequestHandler } from "express";
import { PERMISSIONS } from "../../../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import HTTPError from "../../../../../../utils/HTTPError";
import userTransactionsService from "../../../../../../services/userTransactions.service";
import Joi from "joi";
import { filterValidationSchema } from "../../../../../../utils/customValidation";

const exportTransactionsSchema = Joi.object({
  fields: Joi.array()
    .allow(
      "users_info.ctrader_id",
      "users_info.email",
      "users_info.first_name",
      "users_info.last_name",
      "user.email",
      "transaction_id",
      "amount",
      "liveAccountsCount",
      "currency",
      "timestamp",
      "transaction_status"
    )
    .required(true),
  filters: filterValidationSchema({
    fromDate: (v) => ({ createdAt: { $gte: new Date(v) } }),
    toDate: (v) => ({ createdAt: { $lte: new Date(v) } }),
  }),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = exportTransactionsSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
  }
  const { fields, filters } = value;
  // Validate request query
  // Business logic
  let data = await userTransactionsService.getTransactionsCsv(
    filters,
    req.selectedBrand,
    req.allowedCountries
  );
  try {
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(data);
    res.status(200).json(csv);
  } catch (err) {
    console.error(err);
    throw new HTTPError("Error parsing data", 500, errorCodes.serverError);
  }
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    post: [
      userHasAnyPermission([PERMISSIONS.TRANSACTIONS.export_transactions]),
    ],
  },
};
