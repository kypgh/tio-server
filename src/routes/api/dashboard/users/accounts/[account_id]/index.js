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

const mongooseID = Joi.string().custom(mongooseIDFunction).required();
/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = mongooseID.validate(req.query.account_id);
  if (error) {
    throw new HTTPError("Invalid query params", 400, {
      ...errorCodes.invalidQueryParams,
      ...error,
    });
  }
  let details = await userAccountsService.getAccountDetails(value);

  if (details.account?.user?.brand !== req.selectedBrand) {
    throw new HTTPError(
      "Account not found",
      404,
      errorCodes.userAccountNotFound
    );
  }
  if (
    req.allowedCountries &&
    !req.allowedCountries.includes(details.account?.user?.country)
  ) {
    throw new HTTPError("Not allowed to access this users accounts", 401, {
      message: "Unauthorized",
    });
  }
  res.status(200).json(details);
};

const updateAccountSchema = Joi.object({
  account_id: Joi.string().custom(mongooseIDFunction).required(),
  account_type: Joi.string().valid(
    ...CTRADER_ACCOUNT_TYPES.map((item) => item.name)
  ),
  leverage: Joi.when("account_type", {
    switch: Object.entries(CTRADER_LEVERAGES).map(([key, value]) => ({
      is: key,
      then: Joi.number()
        .integer()
        .min(1)
        .valid(...value)
        .required(),
    })),
    otherwise: Joi.invalid(),
  }),
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

  const account = await userAccountsService.updateAccountLeverage(
    value.account_id,
    value.account_type,
    value.leverage
  );

  res.status(200).json({ account });
};

/**
 * @type {RequestHandler}
 */
export const DELETE = async (req, res) => {
  const { value, error } = mongooseID.validate(req.query.account_id);
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

  let details = await userAccountsService.deleteAccount(value);
  res.status(201).json(details);
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.ACCOUNTS.per_account_id])],
    put: [userHasAnyPermission([PERMISSIONS.ACCOUNTS.update_account])],
    delete: [userHasAnyPermission([PERMISSIONS.ACCOUNTS.delete_account])],
  },
};
