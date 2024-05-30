import BigNumber from "bignumber.js";
import {
  USER_REQUEST_ACTIONS,
  USER_REQUEST_TYPES,
  PRAXIS_TRANSACTION_STATUS,
} from "../config/enums";
import errorCodes from "../config/errorCodes";
import UserRequestsModel, {
  addActionsToRequest,
} from "../models/UserRequests.model";
import HTTPError from "../utils/HTTPError";
import utilFunctions from "../utils/util.functions";
import userAccountsService from "./userAccounts.service";
import userTransactionsService from "./userTransactions.service";
import usersService from "./users.service";

const userRequestsService = {
  getRequestById: async (request_id, brand, allowedCountries) => {
    let request = await UserRequestsModel.findById(request_id).populate("user");
    if (request.user.brand !== brand) {
      throw new HTTPError("Invalid request", 400, { message: "Not found" });
    }
    if (allowedCountries && !allowedCountries.includes(request.user.country)) {
      throw new HTTPError("Invalid country", 401, { message: "Unauthorized" });
    }
    return request;
  },
  getRequests: async ({
    page = 1,
    limit = 50,
    filters = {},
    sort,
    paginated = true,
    brand,
    allowedCountries,
  }) => {
    // prettier-ignore
    const aggregation = UserRequestsModel.aggregate([
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user", pipeline: [ { $project: { _id: 1, first_name: 1, last_name: 1, email: 1, ctrader_id: 1, readableId: 1, brand: 1, country: 1 }, }, ], }, },
      { $unwind: "$user" },
      { $match: { "user.brand": brand, ...(allowedCountries? { "user.country": {$in: allowedCountries}}: {}) } },
      { $lookup: { from: "usersfinancialnotes", localField: "user._id", foreignField: "user", as: "hasFinancialNotes" }, },
      { $addFields: { hasFinancialNotes: { $toBool: { $size: "$hasFinancialNotes" } }, }, },
      { $match: filters },
      { $lookup: { from: "useraccounts", localField: "metadata.account_id", foreignField: "_id", as: "account", }, },
      { $unwind: { path: "$account", preserveNullAndEmptyArrays: true } },
    ]);
    if (!paginated) {
      let docs = await aggregation
        .collation({ locale: "en", numericOrdering: true })
        .sort(sort || { createdAt: -1 });
      return docs.map((v) => {
        utilFunctions.decimal2JSON(v);
        return v;
      });
    }
    const result = await UserRequestsModel.aggregatePaginate(aggregation, {
      page,
      limit,
      sort: sort ?? { createdAt: -1 },
      collation: { locale: "en", numericOrdering: true },
    });

    result.docs = result.docs.map((doc) => {
      addActionsToRequest(doc);
      utilFunctions.decimal2JSON(doc);
      return doc;
    });
    return result;
  },
  _getDetailedRequestByIdWithoutCheck: async (request_id) => {
    const request = await UserRequestsModel.findById(request_id).populate(
      "user"
    );
    let result = {};
    if (
      request.request_type === USER_REQUEST_TYPES.transferFundsBetweenAccounts
    ) {
      const [accountFrom, accountTo, transactionFrom, transactionTo] =
        await Promise.all([
          userAccountsService.getAccountById(request.metadata.accountFrom),
          userAccountsService.getAccountById(request.metadata.accountTo),
          userTransactionsService.getTransactionById(
            request.metadata.transactionFrom
          ),
          userTransactionsService.getTransactionById(
            request.metadata.transactionTo
          ),
        ]);
      result = {
        request,
        accountFrom,
        accountTo,
        transactionFrom,
        transactionTo,
      };
    } else if (request.request_type === USER_REQUEST_TYPES.deleteAccount) {
      const account = await userAccountsService.getAccountById(
        request.metadata.account_id
      );
      result = {
        request,
        account,
      };
    } else if (
      request.request_type === USER_REQUEST_TYPES.withdrawFromAccount
    ) {
      const [account, transaction, depositMethods] = await Promise.all([
        userAccountsService.getAccountById(request.metadata.account_id),
        userTransactionsService.getTransactionById(
          request.metadata.transaction_id
        ),
        userTransactionsService.getDepositMethodsOfAccount(
          request.metadata.account_id
        ),
      ]);
      result = { request, account, transaction, depositMethods };
    } else if (
      request.request_type === USER_REQUEST_TYPES.changeAccountLeverage
    ) {
      const account = await userAccountsService.getAccountById(
        request.metadata.account_id
      );
      result = { request, account };
    } else if (
      request.request_type === USER_REQUEST_TYPES.depositCryptoToAccount
    ) {
      const account = await userAccountsService.getAccountById(
        request.metadata.account_id
      );
      const transaction = await userTransactionsService.getTransactionById(
        request.metadata.transaction_id
      );
      result = { request, account, transaction };
    }
    return { ...result, user: usersService.formatUserForSend(request.user) };
  },
  getDetailedRequestById: async (request_id, brand, allowedCountries) => {
    const request = await UserRequestsModel.findById(request_id).populate(
      "user"
    );
    let result = {};
    if (request.user.brand !== brand) {
      throw new HTTPError("Invalid brand", 404, { message: "Not found" });
    }
    if (allowedCountries && !allowedCountries.includes(request.user.country)) {
      throw new HTTPError("Invalid country", 401, { message: "Unauthorized" });
    }
    if (
      request.request_type === USER_REQUEST_TYPES.transferFundsBetweenAccounts
    ) {
      const [accountFrom, accountTo, transactionFrom, transactionTo] =
        await Promise.all([
          userAccountsService.getAccountById(request.metadata.accountFrom),
          userAccountsService.getAccountById(request.metadata.accountTo),
          userTransactionsService.getTransactionById(
            request.metadata.transactionFrom
          ),
          userTransactionsService.getTransactionById(
            request.metadata.transactionTo
          ),
        ]);
      result = {
        request,
        accountFrom,
        accountTo,
        transactionFrom,
        transactionTo,
      };
    } else if (request.request_type === USER_REQUEST_TYPES.deleteAccount) {
      const account = await userAccountsService.getAccountById(
        request.metadata.account_id
      );
      result = {
        request,
        account,
      };
    } else if (
      request.request_type === USER_REQUEST_TYPES.withdrawFromAccount
    ) {
      const [account, transaction, depositMethods] = await Promise.all([
        userAccountsService.getAccountById(request.metadata.account_id),
        userTransactionsService.getTransactionById(
          request.metadata.transaction_id
        ),
        userTransactionsService.getDepositMethodsOfAccount(
          request.metadata.account_id
        ),
      ]);
      result = { request, account, transaction, depositMethods };
    } else if (
      request.request_type === USER_REQUEST_TYPES.changeAccountLeverage
    ) {
      const account = await userAccountsService.getAccountById(
        request.metadata.account_id
      );
      result = { request, account };
    } else if (
      request.request_type === USER_REQUEST_TYPES.depositCryptoToAccount
    ) {
      const account = await userAccountsService.getAccountById(
        request.metadata.account_id
      );
      const transaction = await userTransactionsService.getTransactionById(
        request.metadata.transaction_id
      );
      result = { request, account, transaction };
    }
    return { ...result, user: usersService.formatUserForSend(request.user) };
  },
  getUserRequests: (user_id, page = 1, limit = 50) => {
    return UserRequestsModel.paginate(
      { user: user_id },
      { page, limit, sort: { createdAt: -1 } }
    );
  },
  CHANGE_LEVERAGE: {
    request: (user, account_id, leverage, reason) => {
      return UserRequestsModel.create({
        user: user._id,
        request_type: USER_REQUEST_TYPES.changeAccountLeverage,
        metadata: {
          account_id,
          leverage,
          description: reason,
        },
      });
    },
    approve: async (request) => {
      request.status = USER_REQUEST_ACTIONS.changeAccountLeverage.approve;
      return request.save();
    },
    reject: async (request, reason) => {
      request.status = USER_REQUEST_ACTIONS.changeAccountLeverage.reject;
      request.metadata.rejection_reason = reason;
      return request.save();
    },
  },
  DELETE_ACCOUNT: {
    request: (user_id, account_id, account_login_id, description) => {
      return UserRequestsModel.findOneAndUpdate(
        {
          user: user_id,
          request_type: USER_REQUEST_TYPES.deleteAccount,
          "metadata.account_id": account_id,
          status: "pending",
        },
        {
          metadata: {
            description,
            account_id,
            account_login_id,
          },
        },
        { upsert: true, returnDocument: "after" }
      );
    },
    approve: async (request) => {
      let userAccount = await userAccountsService.deleteUserAccount(
        request.user._id,
        request.metadata.account_id
      );
      request.metadata.account = userAccount;
      request.markModified("metadata");
      request.status = USER_REQUEST_ACTIONS.deleteAccount.approve;
      return request.save();
    },
    reject: async (request, reject_reason) => {
      request.metadata.reject_reason = reject_reason;
      request.status = USER_REQUEST_ACTIONS.deleteAccount.reject;
      return request.save();
    },
  },
  WITHDRAW_FUNDS: {
    request: async (user_id, transaction, type, details, requestedCurrency) => {
      return UserRequestsModel.create({
        user: user_id,
        request_type: USER_REQUEST_TYPES.withdrawFromAccount,
        metadata: {
          transaction_id: transaction._id,
          account_id: transaction.userAccount._id ?? transaction.userAccount,
          amount: transaction.amount,
          currency: transaction.currency,
          type: type,
          details,
          requestedCurrency,
        },
      });
    },
    approveStatus: async (request) => {
      request.status = USER_REQUEST_ACTIONS.withdrawFromAccount.approve;
      return request.save();
    },
    delayedStatus: async (request, delayed_reason) => {
      request.status = USER_REQUEST_ACTIONS.withdrawFromAccount.delayed;
      request.metadata.delayed_reason = delayed_reason;
      request.markModified("metadata");
      return request.save();
    },
    process: async (request, { methods, fee }) => {
      const transaction = await userTransactionsService.getTransactionById(
        request.metadata.transaction_id
      );
      if (!transaction) {
        throw new HTTPError(
          "Transaction not found",
          500,
          errorCodes.serverError
        );
      }
      if (
        !methods
          .reduce((acc, method) => acc.plus(method.amount), new BigNumber(0))
          .plus(fee ? fee.amount : 0)
          .isEqualTo(request?.metadata?.amount)
      ) {
        throw new HTTPError("Invalid methods amount", 400, {
          message:
            "Invalid methods amount does not add up to the requested amount",
        });
      }
      let transactions = await userTransactionsService.withdrawalApproved(
        transaction,
        methods,
        fee
      );
      const account = await userAccountsService.withdrawRequestApprove(
        transaction.userAccount._id,
        transaction.processed_amount,
        transaction,
        methods
      );
      if (request?.metadata?.type === "fiat") {
        delete request.metadata.details;
      }
      if (fee) {
        request.metadata.fee = fee;
      }
      request.markModified("metadata");
      request.status = USER_REQUEST_ACTIONS.withdrawFromAccount.processed;
      const updated_request = await request.save();
      return { transactions, account, request: updated_request };
    },
    reject: async (request, reject_reason) => {
      let transaction = await userTransactionsService.getTransactionById(
        request.metadata.transaction_id
      );
      const account = await userAccountsService.withdrawRequestReject(
        transaction._id,
        transaction.userAccount._id,
        transaction.processed_amount
      );
      transaction = await userTransactionsService.withdrawalRejected(
        transaction,
        reject_reason
      );
      request.status = USER_REQUEST_ACTIONS.withdrawFromAccount.reject;
      request.metadata.reject_reason = reject_reason;
      if (request?.metadata?.type === "fiat") {
        delete request.metadata.details;
      }
      request.markModified("metadata");
      const updated_request = await request.save();
      return { account, transaction, request: updated_request };
    },
  },
  DEPOSIT_FUNDS: {
    request: async (user_id, transaction) => {
      return UserRequestsModel.create({
        user: user_id,
        request_type: USER_REQUEST_TYPES.depositCryptoToAccount,
        metadata: {
          transaction_id: transaction._id,
          account_id: transaction.userAccount._id ?? transaction.userAccount,
          amount: transaction.amount,
          currency: transaction.currency,
        },
      });
    },
    approve: async (request) => {
      let transaction = await userTransactionsService.getTransactionById(
        request.metadata.transaction_id
      );
      const account = await userAccountsService.depositToAccount(
        request.metadata.account_id,
        transaction
      );
      transaction = await userTransactionsService.depositCryptoApproved(
        transaction
      );
      request.status = USER_REQUEST_ACTIONS.depositCryptoToAccount.processed;
      request.markModified("metadata");
      await request.save();
      return { transaction, account, request };
    },
    reject: async (request, reject_reason) => {
      let transaction = await userTransactionsService.getTransactionById(
        request.metadata.transaction_id
      );
      transaction = await userTransactionsService.depositCryptoRejected(
        transaction
      );
      request.status = USER_REQUEST_ACTIONS.depositCryptoToAccount.reject;
      request.metadata.reject_reason = reject_reason;
      request.markModified("metadata");
      await request.save();
      return { transaction, account: transaction.userAccount, request };
    },
  },
  TRANSFER_FUNDS: {
    request: async (
      user,
      accountFrom,
      accountTo,
      transactionFrom,
      transactionTo
    ) => {
      return UserRequestsModel.create({
        user: user._id,
        request_type: USER_REQUEST_TYPES.transferFundsBetweenAccounts,
        metadata: {
          accountFrom: accountFrom._id,
          accountTo: accountTo._id,
          transactionFrom: transactionFrom._id,
          transactionTo: transactionTo._id,
          amountFrom: transactionFrom.amount,
          amountTo: transactionTo.amount,
          currencyFrom: transactionFrom.currency,
          currencyTo: transactionTo.currency,
          amountUsd: transactionFrom.processed_usd_amount,
        },
      });
    },
    reject: async (request, reject_reason) => {
      const accountFrom = await userAccountsService.getAccountById(
        request.metadata.accountFrom
      );
      const accountTo = await userAccountsService.getAccountById(
        request.metadata.accountTo
      );
      const transactionFrom = await userTransactionsService.getTransactionById(
        request.metadata.transactionFrom
      );
      const transactionTo = await userTransactionsService.getTransactionById(
        request.metadata.transactionTo
      );
      transactionFrom.transaction_status =
        PRAXIS_TRANSACTION_STATUS.withdrawal_rejected;
      transactionTo.transaction_status =
        PRAXIS_TRANSACTION_STATUS.payment_rejected;
      await transactionFrom.save();
      await transactionTo.save();
      request.status = USER_REQUEST_ACTIONS.transferFundsBetweenAccounts.reject;
      request.metadata.reject_reason = reject_reason;
      request.markModified("metadata");
      await request.save();
      return {
        request,
        accountFrom,
        accountTo,
        transactionFrom,
        transactionTo,
      };
    },
    approve: async (request) => {
      const transactionFrom = await userTransactionsService.getTransactionById(
        request.metadata.transactionFrom
      );
      const transactionTo = await userTransactionsService.getTransactionById(
        request.metadata.transactionTo
      );
      const accountFrom = await userAccountsService.withdrawFromAccount(
        request.metadata.accountFrom,
        transactionFrom
      );
      const accountTo = await userAccountsService.depositToAccount(
        request.metadata.accountTo,
        transactionTo
      );
      transactionFrom.transaction_status =
        PRAXIS_TRANSACTION_STATUS.withdrawal_approved;
      transactionTo.transaction_status =
        PRAXIS_TRANSACTION_STATUS.payment_approved;
      await transactionFrom.save();
      await transactionTo.save();
      request.status =
        USER_REQUEST_ACTIONS.transferFundsBetweenAccounts.approve;
      await request.save();
      return {
        request,
        accountFrom,
        accountTo,
        transactionFrom,
        transactionTo,
      };
    },
  },
};

export default userRequestsService;
