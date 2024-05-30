import { RequestHandler } from "express";
import Joi from "joi";
import { USER_REQUEST_ACTIONS } from "../../../../../../config/enums";
import errorCodes from "../../../../../../config/errorCodes";
import { PERMISSIONS } from "../../../../../../config/permissions";
import userRequestsController from "../../../../../../controllers/userRequests.controller";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import { checkPermissions } from "../../../../../../middleware/permissions.middleware";
import userRequestsService from "../../../../../../services/userRequests.service";
import { mongooseIDFunction } from "../../../../../../utils/customValidation";
import HTTPError from "../../../../../../utils/HTTPError";

const requestActionHandler = {
  deleteAccount: async (request, action, req, res) => {
    const actions = USER_REQUEST_ACTIONS.deleteAccount;
    if (request.status !== "pending") {
      throw new HTTPError(
        "Invalid Request Status",
        409,
        errorCodes.requestStatusIsNotPending
      );
    }
    if (!Object.keys(actions).includes(action)) {
      throw new HTTPError(
        "Invalid userRequest action",
        400,
        errorCodes.unsupportedRequestAction
      );
    }
    if (action === actions.approve) {
      await userRequestsController.approveDeleteAccount(request, req, res);
    } else if (action === actions.reject) {
      await userRequestsController.rejectDeleteAccount(request, req, res);
    } else {
      throw new HTTPError(
        "Invalid userRequest action",
        400,
        errorCodes.unsupportedRequestAction
      );
    }
  },
  withdrawFromAccount: async (request, action, req, res) => {
    const actions = USER_REQUEST_ACTIONS.withdrawFromAccount;

    if (!Object.keys(actions).includes(action)) {
      throw new HTTPError(
        "Invalid userRequest action",
        400,
        errorCodes.unsupportedRequestAction
      );
    }
    if (action === actions.processed) {
      await userRequestsController.processWithdrawFromAccount(
        request,
        req,
        res
      );
      return;
    }
    if (action === actions.approve) {
      await userRequestsController.approveWithdrawal(request, req, res);
      return;
    }
    if (action === actions.delayed) {
      await userRequestsController.delayWithdrawal(request, req, res);
      return;
    }
    if (action === actions.reject) {
      await userRequestsController.rejectWithdrawal(request, req, res);
      return;
    }
    throw new HTTPError(
      "Invalid userRequest action",
      400,
      errorCodes.unsupportedRequestAction
    );
  },
  depositCryptoToAccount: async (request, action, req, res) => {
    const actions = USER_REQUEST_ACTIONS.depositCryptoToAccount;
    if (request.status !== "pending") {
      throw new HTTPError(
        "Invalid Request Status",
        409,
        errorCodes.requestStatusIsNotPending
      );
    }
    if (!Object.keys(actions).includes(action)) {
      throw new HTTPError(
        "Invalid userRequest action",
        400,
        errorCodes.unsupportedRequestAction
      );
    }
    if (action === actions.processed) {
      await userRequestsController.approveDepositCryptoToAccount(
        request,
        req,
        res
      );
    } else if (action === actions.reject) {
      await userRequestsController.rejectDepositCryptoToAccount(
        request,
        req,
        res
      );
    } else {
      throw new HTTPError(
        "Invalid userRequest action",
        400,
        errorCodes.unsupportedRequestAction
      );
    }
  },
  transferFundsBetweenAccounts: async (request, action, req, res) => {
    const actions = USER_REQUEST_ACTIONS.transferFundsBetweenAccounts;
    if (request.status !== "pending") {
      throw new HTTPError(
        "Invalid Request Status",
        409,
        errorCodes.requestStatusIsNotPending
      );
    }
    if (!Object.keys(actions).includes(action)) {
      throw new HTTPError(
        "Invalid userRequest action",
        400,
        errorCodes.unsupportedRequestAction
      );
    }
    if (action === actions.approve) {
      await userRequestsController.approveTransferFundsBetweenAccounts(
        request,
        req,
        res
      );
    } else if (action === actions.reject) {
      await userRequestsController.rejectTransferFundsBetweenAccounts(
        request,
        req,
        res
      );
    } else {
      throw new HTTPError(
        "Invalid userRequest action",
        400,
        errorCodes.unsupportedRequestAction
      );
    }
  },
  changeAccountLeverage: async (request, action, req, res) => {
    const actions = USER_REQUEST_ACTIONS.changeAccountLeverage;
    if (request.status !== "pending") {
      throw new HTTPError(
        "Invalid Request Status",
        409,
        errorCodes.requestStatusIsNotPending
      );
    }
    if (!Object.keys(actions).includes(action)) {
      throw new HTTPError(
        "Invalid userRequest action",
        400,
        errorCodes.unsupportedRequestAction
      );
    }
    if (action === actions.approve) {
      await userRequestsController.approveChangeAccountLeverage(
        request,
        req,
        res
      );
    } else if (action === actions.reject) {
      await userRequestsController.rejectChangeAccountLeverage(
        request,
        req,
        res
      );
    } else {
      throw new HTTPError(
        "Invalid userRequest action",
        400,
        errorCodes.unsupportedRequestAction
      );
    }
  },
};

const actionPermissions = {
  deleteAccount: {
    [USER_REQUEST_ACTIONS.deleteAccount.approve]: [
      PERMISSIONS.REQUESTS.delete_account,
    ],
    [USER_REQUEST_ACTIONS.deleteAccount.reject]: [
      PERMISSIONS.REQUESTS.delete_account,
    ],
  },
  withdrawFromAccount: {
    [USER_REQUEST_ACTIONS.withdrawFromAccount.approve]: [
      PERMISSIONS.REQUESTS.withdraw_from_account_status,
    ],
    [USER_REQUEST_ACTIONS.withdrawFromAccount.delayed]: [
      PERMISSIONS.REQUESTS.withdraw_from_account_status,
    ],
    [USER_REQUEST_ACTIONS.withdrawFromAccount.reject]: [
      PERMISSIONS.REQUESTS.withdraw_from_account_status,
    ],
    [USER_REQUEST_ACTIONS.withdrawFromAccount.processed]: [
      PERMISSIONS.REQUESTS.withdraw_from_account,
    ],
  },
  depositCryptoToAccount: {
    [USER_REQUEST_ACTIONS.depositCryptoToAccount.approve]: [
      PERMISSIONS.REQUESTS.crypto_deposit,
    ],
    [USER_REQUEST_ACTIONS.depositCryptoToAccount.reject]: [
      PERMISSIONS.REQUESTS.crypto_deposit,
    ],
  },
  transferFundsBetweenAccounts: {
    [USER_REQUEST_ACTIONS.transferFundsBetweenAccounts.approve]: [
      PERMISSIONS.REQUESTS.transfer_funds_between_accounts,
    ],
    [USER_REQUEST_ACTIONS.transferFundsBetweenAccounts.reject]: [
      PERMISSIONS.REQUESTS.transfer_funds_between_accounts,
    ],
  },
  changeAccountLeverage: {
    [USER_REQUEST_ACTIONS.changeAccountLeverage.approve]: [
      PERMISSIONS.REQUESTS.change_account_leverage,
    ],
    [USER_REQUEST_ACTIONS.changeAccountLeverage.reject]: [
      PERMISSIONS.REQUESTS.change_account_leverage,
    ],
  },
};

const userRequestsActionQuerySchema = Joi.object({
  request_id: Joi.string().custom(mongooseIDFunction).required(),
  action: Joi.string().required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = userRequestsActionQuerySchema.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid request query", 400, {
      ...error,
      ...errorCodes.queryValidation,
    });
  }
  const request = await userRequestsService.getRequestById(
    value.request_id,
    req.selectedBrand,
    req.allowedCountries
  );
  if (requestActionHandler[request.request_type]) {
    if (actionPermissions[request.request_type]) {
      if (
        !checkPermissions(
          req.crm_user,
          actionPermissions[request.request_type][value.action] || []
        )
      ) {
        throw new HTTPError(
          "Permission denied",
          403,
          errorCodes.permissionDenied
        );
      }
    }
    await requestActionHandler[request.request_type](
      request,
      value.action,
      req,
      res
    );
  } else {
    throw new HTTPError("Invalid Request Type", 400);
  }
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
  },
};
