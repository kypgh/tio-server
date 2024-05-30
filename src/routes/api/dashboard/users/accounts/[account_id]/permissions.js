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

const updateAccountSchema = Joi.object({
  account_id: Joi.string().custom(mongooseIDFunction).required(),
  enabled: Joi.boolean().default(false),
  enable_change_password: Joi.boolean().default(false),
  enable_send_reports: Joi.boolean().default(false),
  read_only: Joi.boolean().default(false),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  const { value, error } = updateAccountSchema.validate({
    ...req.query,
    ...req.body,
  });
  if (error) {
    throw new HTTPError("Invalid query params", 400, {
      ...errorCodes.invalidQueryParams,
      ...error,
    });
  }

  let [_account] = await userAccountsService.getAccountByIdAndBrand(
    value.account_id,
    req.selectedBrand
  );
  if (!_account) {
    throw new HTTPError(
      "Account not found",
      404,
      errorCodes.userAccountNotFound
    );
  }
  if (_account?.user?.brand !== req.selectedBrand) {
    throw new HTTPError(
      "Account not found",
      404,
      errorCodes.userAccountNotFound
    );
  }
  if (
    req.allowedCountries &&
    !req.allowedCountries.includes(_account?.user?.country)
  ) {
    throw new HTTPError("Not allowed to access this users accounts", 401, {
      message: "Unauthorized",
    });
  }

  const account = await userAccountsService.updateAccountPermissions(value);

  res.status(200).json({ account });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    put: [userHasAnyPermission([PERMISSIONS.ACCOUNTS.update_account])],
  },
};
