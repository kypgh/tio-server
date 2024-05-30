import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import userAccountsService from "../../../../../services/userAccounts.service";
import HTTPError from "../../../../../utils/HTTPError";
import errorCodes from "../../../../../config/errorCodes";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../config/permissions";
import Joi from "joi";
import { mongooseIDFunction } from "../../../../../utils/customValidation";
import { RequestHandler } from "express";
import tradesService from "../../../../../services/trades.service";

const getUsersAccountsFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
  environment_type: Joi.string().valid("live", "demo").default("live"),
  user: Joi.string().custom(mongooseIDFunction),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = getUsersAccountsFilterSchema.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid query params", 400, {
      ...errorCodes.invalidQueryParams,
      ...error,
    });
  }
  let accounts = await userAccountsService.getAll({
    ...value,
    brand: req.selectedBrand,
    countryWhitelist: req.allowedCountries,
  });

  accounts.docs = await Promise.all(
    accounts.docs.map(async (acc) => ({
      ...acc.toJSON(),
      volume: await tradesService.calculateAccountVolume(acc),
    }))
  );
  res.status(200).json(accounts);
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.ACCOUNTS.get_accounts])],
  },
};
