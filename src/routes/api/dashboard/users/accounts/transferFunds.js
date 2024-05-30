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
import userTransactionsService from "../../../../../services/userTransactions.service";
import userLogsService from "../../../../../services/userLogs.service";
import usersService from "../../../../../services/users.service";

const transferFundsBetweenAccountsSchema = Joi.object({
  accountFrom: Joi.string().custom(mongooseIDFunction).required(),
  accountTo: Joi.string().custom(mongooseIDFunction).required(),
  amount: Joi.number().min(0).required(),
  reason: Joi.string().allow(""),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = transferFundsBetweenAccountsSchema.validate(
    req.body
  );
  if (error) {
    throw new HTTPError("Invalid query params", 400, {
      ...errorCodes.invalidQueryParams,
      ...error,
    });
  }
  let [_accountFrom] = await userAccountsService.getAccountByIdAndBrand(
    value.accountFrom,
    req.selectedBrand
  );
  if (!_accountFrom) {
    throw new HTTPError(
      "Account not found",
      404,
      errorCodes.userAccountNotFound
    );
  }
  if (_accountFrom?.user?.brand !== req.selectedBrand) {
    throw new HTTPError(
      "Account not found",
      404,
      errorCodes.userAccountNotFound
    );
  }
  if (
    req.allowedCountries &&
    !req.allowedCountries.includes(_accountFrom?.user?.country)
  ) {
    throw new HTTPError("Not allowed to access this users accounts", 401, {
      message: "Unauthorized",
    });
  }

  let [_accountTo] = await userAccountsService.getAccountByIdAndBrand(
    value.accountTo,
    req.selectedBrand
  );
  if (!_accountTo) {
    throw new HTTPError(
      "Account not found",
      404,
      errorCodes.userAccountNotFound
    );
  }
  if (_accountTo?.user?.brand !== req.selectedBrand) {
    throw new HTTPError(
      "Account not found",
      404,
      errorCodes.userAccountNotFound
    );
  }
  const user = await usersService.getUserById(_accountFrom.user._id);
  const { transactionFrom, transactionTo, accountFrom, accountTo } =
    await userTransactionsService.transferFundsBetweenAccounts(
      user,
      _accountFrom,
      _accountTo,
      value.amount
    );

  await userLogsService.USER_ACTIONS.transferFundsBetweenAccounts(
    req.crm_user,
    user,
    accountFrom,
    accountTo,
    transactionFrom,
    transactionTo,
    value.reason
  );
  res
    .status(200)
    .json({ transactionFrom, transactionTo, accountFrom, accountTo });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.ACCOUNTS.transfer_opration])],
  },
};
