import Joi from "joi";
import { FIAT_WITHDRAWAL_METHODS, USER_REQUEST_ACTIONS } from "../config/enums";
import userLogsService from "../services/userLogs.service";
import userRequestsService from "../services/userRequests.service";
import HTTPError from "../utils/HTTPError";
import errorCodes from "../config/errorCodes";
import { PAYMENT_GATEWAYS } from "../config/paymentGateways";
import userAccountsService from "../services/userAccounts.service";
import emailService from "../services/email.service";
import usersService from "../services/users.service";

const userRequestsRejectReasonSchema = Joi.object({
  reject_reason: Joi.string().required(),
}).unknown(true);

const userRequestsProcessWithdrawalSchema = Joi.object({
  methods: Joi.array()
    .items(
      Joi.object({
        type: Joi.string()
          .valid(...PAYMENT_GATEWAYS.map((gateway) => gateway.id))
          .required(),
        amount: Joi.number().min(0).required(),
      })
    )
    .min(0)
    .required(),
  fee: Joi.object({
    amount: Joi.number().min(0).required(),
    reason: Joi.string().required(),
  }).optional(),
}).unknown(true);

const userRequestsDelayedWithdrawalSchema = Joi.object({
  delayed_reason: Joi.string().required(),
});

const userRequestsController = {
  approveDeleteAccount: async (request, req, res) => {
    const result = await userRequestsService.DELETE_ACCOUNT.approve(request);
    await userLogsService.CRM_ACTIONS.userRequestAction(
      request,
      "approved",
      req.crm_user
    );
    res.status(200).json({ message: "Request approved", result });
  },
  rejectDeleteAccount: async (request, req, res) => {
    const { error, value } = userRequestsRejectReasonSchema.validate(req.body);
    if (error) {
      throw new HTTPError("Invalid request body", 400, {
        ...error,
        ...errorCodes.bodyValidation,
      });
    }
    const result = await userRequestsService.DELETE_ACCOUNT.reject(
      request,
      value.reject_reason
    );
    await userLogsService.CRM_ACTIONS.userRequestAction(
      request,
      "rejected",
      req.crm_user
    );
    res.status(200).json({ message: "Request rejected", result });
  },
  processWithdrawFromAccount: async (request, req, res) => {
    const { value, error } = userRequestsProcessWithdrawalSchema.validate(
      req.body
    );

    if (error) {
      throw new HTTPError("Invalid request body", 400, {
        ...error,
        ...errorCodes.bodyValidation,
      });
    }
    const result = await userRequestsService.WITHDRAW_FUNDS.process(
      request,
      value
    );
    await userLogsService.CRM_ACTIONS.approveWithdrawal(
      result.request,
      USER_REQUEST_ACTIONS.withdrawFromAccount.processed,
      req.crm_user,
      result.account,
      result.transactions
    );
    const user = await usersService.getUserById(
      result.request.user?._id || result.request.user
    );
    emailService
      .withdrawalProcessedEmail({
        user,
        account: result?.account,
        amount: result?.request?.metadata?.amount,
        currency: result?.account?.currency,
      })
      .catch((err) =>
        console.error("[ERROR] - Withdrawal processed email not send", err)
      );
    res
      .status(200)
      .json({ message: "Request approved", request: result.request });
  },
  approveWithdrawal: async (request, req, res) => {
    const result = await userRequestsService.WITHDRAW_FUNDS.approveStatus(
      request
    );
    res.status(200).json({ message: "Request updated" });
  },
  delayWithdrawal: async (request, req, res) => {
    const { error, value } = userRequestsDelayedWithdrawalSchema.validate(
      req.body
    );
    if (error) {
      throw new HTTPError("Invalid request body", 400, {
        ...error,
        ...errorCodes.bodyValidation,
      });
    }
    const result = await userRequestsService.WITHDRAW_FUNDS.delayedStatus(
      request,
      value.delayed_reason
    );
    res.status(200).json({ message: "Request updated" });
  },
  rejectWithdrawal: async (request, req, res) => {
    const { error, value } = userRequestsRejectReasonSchema.validate(req.body);
    if (error) {
      throw new HTTPError("Invalid request body", 400, {
        ...error,
        ...errorCodes.bodyValidation,
      });
    }
    const result = await userRequestsService.WITHDRAW_FUNDS.reject(
      request,
      value.reject_reason
    );
    await userLogsService.CRM_ACTIONS.rejectWithdrawal(
      result.request,
      "rejected",
      req.crm_user,
      result.account,
      result.transaction
    );
    res
      .status(200)
      .json({ message: "Request rejected", request: result.request });
  },
  approveDepositCryptoToAccount: async (request, req, res) => {
    const result = await userRequestsService.DEPOSIT_FUNDS.approve(request);
    await userLogsService.CRM_ACTIONS.approveCryptoDeposit(
      result.request,
      "approved",
      req.crm_user,
      result.account,
      result.transaction
    );
    res
      .status(200)
      .json({ message: "Request approved", request: result.request });
  },
  rejectDepositCryptoToAccount: async (request, req, res) => {
    const { error, value } = userRequestsRejectReasonSchema.validate(req.body);
    if (error) {
      throw new HTTPError("Invalid request body", 400, {
        ...error,
        ...errorCodes.bodyValidation,
      });
    }
    const result = await userRequestsService.DEPOSIT_FUNDS.reject(
      request,
      value.reject_reason
    );
    await userLogsService.CRM_ACTIONS.rejectCryptoDeposit(
      result.request,
      "rejected",
      req.crm_user,
      result.account,
      result.transaction
    );
    res
      .status(200)
      .json({ message: "Request rejected", request: result.request });
  },
  approveTransferFundsBetweenAccounts: async (request, req, res) => {
    const { accountFrom, accountTo, transactionFrom, transactionTo } =
      await userRequestsService.TRANSFER_FUNDS.approve(request);
    await userLogsService.CRM_ACTIONS.approveTransferFundsBetweenAccounts(
      request,
      "approved",
      req.crm_user,
      accountFrom,
      accountTo,
      transactionFrom,
      transactionTo
    );
    res
      .status(200)
      .json({ message: "Request rejected", request: result.request });
  },
  rejectTransferFundsBetweenAccounts: async (request, req, res) => {
    const { error, value } = userRequestsRejectReasonSchema.validate(req.body);
    if (error) {
      throw new HTTPError("Invalid request body", 400, {
        ...error,
        ...errorCodes.bodyValidation,
      });
    }
    const { accountFrom, accountTo, transactionFrom, transactionTo } =
      await userRequestsService.TRANSFER_FUNDS.reject(
        request,
        value.reject_reason
      );
    await userLogsService.CRM_ACTIONS.rejectTransferFundsBetweenAccounts(
      request,
      "rejected",
      req.crm_user,
      accountFrom,
      accountTo,
      transactionFrom,
      transactionTo
    );
    res
      .status(200)
      .json({ message: "Request rejected", request: result.request });
  },
  approveChangeAccountLeverage: async (request, req, res) => {
    let account = await userAccountsService.changeAccountLeverage(
      request.metadata.account_id,
      request.metadata.leverage
    );
    const result = await userRequestsService.CHANGE_LEVERAGE.approve(request);
    await userLogsService.CRM_ACTIONS.approveChangeAccountLeverage(
      request.user,
      account,
      req.crm_user
    );
    res.status(200).json({ message: "Success", request: result });
  },
  rejectChangeAccountLeverage: async (request, req, res) => {
    const { error, value } = userRequestsRejectReasonSchema.validate(req.body);
    if (error) {
      throw new HTTPError("Invalid request body", 400, {
        ...error,
        ...errorCodes.bodyValidation,
      });
    }
    const result = await userRequestsService.CHANGE_LEVERAGE.reject(
      request,
      value.reject_reason
    );
    const account = await userAccountsService.getAccountById(
      request.metadata.account_id
    );
    await userLogsService.CRM_ACTIONS.rejectChangeAccountLeverage(
      request.user,
      account,
      req.crm_user
    );
    res.status(200).json({ message: "Request rejected", request: result });
  },
};

export default userRequestsController;
