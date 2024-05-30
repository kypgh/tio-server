import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../../config/permissions";
import HTTPError from "../../../../../../utils/HTTPError";
import errorCodes from "../../../../../../config/errorCodes";
import userTransactionsService from "../../../../../../services/userTransactions.service";
import userAccountsService from "../../../../../../services/userAccounts.service";
import userLogsService from "../../../../../../services/userLogs.service";
import { mongooseIDFunction } from "../../../../../../utils/customValidation";
import Joi from "joi";
import { RequestHandler } from "express";
import utilFunctions from "../../../../../../utils/util.functions";
import { PAYMENT_GATEWAYS } from "../../../../../../config/paymentGateways";

const balanceOperationSchema = Joi.object({
  account_id: Joi.string().custom(mongooseIDFunction).required(),
  amount: Joi.number().required(),
  type: Joi.string().valid("deposit", "withdrawal").required(),
  reason: Joi.string().required(),
  comment: Joi.string().default(""),
  payment_method: Joi.string()
    .valid(...PAYMENT_GATEWAYS.map((psp) => psp.id))
    .required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = balanceOperationSchema.validate({
    ...req.query,
    ...req.body,
  });
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...error,
      ...errorCodes.invalidRequest,
    });
  }

  let [account] = await userAccountsService.getAccountByIdAndBrand(
    value.account_id,
    req.selectedBrand
  );
  if (!account) {
    throw new HTTPError(
      "Account not found",
      404,
      errorCodes.userAccountNotFound
    );
  }
  if (
    req.allowedCountries &&
    !req.allowedCountries.includes(account?.user?.country)
  ) {
    throw new HTTPError("Not allowed to access this users accounts", 401, {
      message: "Unauthorized",
    });
  }

  if (value.type === "deposit") {
    const transaction =
      await userTransactionsService.depositManualBalanceOperation(
        account.user._id,
        account._id,
        value.amount,
        account.currency,
        value.payment_method,
        value.reason,
        value.comment
      );
    account = await userAccountsService
      .depositToAccount(account._id, transaction)
      .catch(async (err) => {
        console.error("Error depositing to Account");
        await transaction.remove();
        throw err;
      });
    await userLogsService.CRM_ACTIONS.balanceOperationDeposit(
      account.user,
      transaction,
      account,
      value.reason,
      req.crm_user
    );
    res.status(200).json({ account, transaction });
    return;
  }

  if (value.type === "withdrawal") {
    const transaction =
      await userTransactionsService.withdrawManualBalanceOperation(
        account.user._id,
        account._id,
        value.amount,
        account.currency,
        value.payment_method,
        value.reason,
        value.comment
      );
    account = await userAccountsService
      .withdrawFromAccount(account._id, transaction)
      .catch(async (err) => {
        console.error("Error withdrawing to Account");
        await transaction.remove();
        throw err;
      });
    await userLogsService.CRM_ACTIONS.balanceOperationWithdrawal(
      account.user,
      transaction,
      account,
      value.reason,
      req.crm_user
    );

    res.status(200).json({ account, transaction });
    return;
  }

  res.status(400).json({ message: "Invalid type" });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    post: [userHasAnyPermission([PERMISSIONS.ACCOUNTS.balance_operation])],
  },
};
