import mongoose from "mongoose";
import { USER_LOGS_ACTION_TYPES } from "../config/enums";
import UserLogsModel from "../models/UserLogs.model";
import utilFunctions from "../utils/util.functions";

const userLogsService = {
  getLogs: async ({ type, limit = 50, cursor, brand, allowedCountries }) => {
    //prettier-ignore
    return UserLogsModel.aggregate([
      { $match: { action_type: type, ...(cursor ? { _id: { $lt: new mongoose.Types.ObjectId(cursor) } } : {}), }, },
      { $sort: { createdAt: -1 } },
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user", pipeline: [ { $match: { brand: brand, ...(allowedCountries ? { country: { $in: allowedCountries } } : {}), }, }, { $project: { email: 1, brand: 1, readableId: 1, country: 1 } }, ], }, },
      { $unwind: "$user" },
      { $lookup: { from: "crmusers", localField: "metadata.crmuser_id", foreignField: "_id", as: "crmuser", }, },
      { $limit: limit },
    ]);
  },
  getLogsForAUser: async (
    user_id,
    page = 1,
    limit = 50,
    action_type,
    filters
  ) => {
    let filter = {
      user: new mongoose.Types.ObjectId(user_id),
      action_type,
      ...filters,
    };
    filter = utilFunctions.pruneNullOrUndefinedFields(filter);
    //prettier-ignore
    const aggregation = UserLogsModel.aggregate([
      { $match: filter },
      { $addFields: { crmuser: { $toObjectId: "$metadata.crmuser_id" }, }, },
      { $lookup: { from: "crmusers", localField: "crmuser", foreignField: "_id", as: "crmuser", pipeline:[{$project: { first_name: 1, last_name: 1, email: 1 }}] }, },
      { $unwind: { path: "$crmuser", preserveNullAndEmptyArrays: true, }}
    ]);
    return UserLogsModel.aggregatePaginate(aggregation, {
      page,
      limit,
      sort: { createdAt: -1 },
    });
  },
  USER_ACTIONS: {
    registered: async (user) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.registered,
        description: `User ${user.email} has registered`,
        metadata: {},
      });
    },
    loggedIn: async (user) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.loggedIn,
        description: `User ${user.email} logged in (cID: ${user.ctrader_id})`,
        metadata: {},
      });
    },
    createAccount: async (user, account) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.createAccount,
        description: `[${account.platform}] Created a ${account.environment_type} ${account.account_type} account with leverage 1:${account.leverage} and currency ${account.currency}.`,
        metadata: { account_id: account._id },
      });
    },
    deleteAccountRequest: async (user, account, request) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.deleteAccountRequest,
        description: `Requested to delete an account (login ID: ${account.login_id}).`,
        metadata: { account_id: account._id, request_id: request._id },
      });
    },
    changePassword: async (user) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.changePassword,
        description: `Changed password.`,
        metadata: {},
      });
    },
    changeEmail: async (user, old_email, new_email) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.changeEmail,
        description: `Changed email (old: ${old_email}, new: ${new_email}).`,
        metadata: {},
      });
    },
    uploadKYCDocument: async (user, document) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.uploadKYCDocument,
        description: `Uploaded a KYC document (${document.document_type}).`,
        metadata: { document_id: document._id },
      });
    },
    depositTransaction: async (user, transaction, account) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.depositTransaction,
        description: `[${account.platform}] Deposited ${transaction.amount} ${transaction.currency} in account "${account.login_id}". (STATUS: ${transaction.transaction_status})`,
        metadata: {
          transaction_id: transaction._id,
          account_id: account._id,
        },
      });
    },
    withdrawTransaction: async (user, transaction, account) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.withdrawTransaction,
        description: `[${account.platform}] Withdraw ${transaction.amount} ${transaction.currency} from account "${account.login_id}". (STATUS: ${transaction.transaction_status})`,
        metadata: {
          transaction_id: transaction._id,
          account_id: account._id,
        },
      });
    },
    withdrawalRequest: async (user, transaction, account, request) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.withdrawalRequest,
        description: `[${account.platform}] Withdrawal request for ${transaction.currency} ${transaction.amount} from account ${account.login_id}.`,
        metadata: {
          request_id: request._id,
          transaction_id: transaction._id,
          account_id: account._id,
        },
      });
    },
    depositCryptoRequest: async (user, transaction, account, request) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.depositCryptoRequest,
        description: `[${account.platform}] Deposit crypto request ${transaction.currency} ${transaction.amount} to account ${account.login_id}.`,
        metadata: {
          request_id: request._id,
          transaction_id: transaction._id,
          account_id: account._id,
        },
      });
    },
    depositCrypto: async (user, transaction, account) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.depositCrypto,
        description: `[${account.platform}] Deposit crypto ${transaction.currency} ${transaction.amount} to account ${account.login_id}.`,
        metadata: {
          transaction_id: transaction._id,
          account_id: account._id,
        },
      });
    },
    requestTransferBetweenAccounts: async (
      user,
      accountFrom,
      accountTo,
      transactionFrom,
      transactionTo
    ) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.requestTransferBetweenAccounts,
        description: `Requested to transfer ${utilFunctions.formatCurrency(
          transactionFrom.amount,
          transactionFrom.currency
        )} from ${accountFrom.platform}-${accountFrom.login_id} account to ${
          accountTo.platform
        }-${accountTo.login_id} account (${utilFunctions.formatCurrency(
          transactionTo.amount,
          transactionTo.currency
        )}).`,
        metadata: {
          accountFrom: accountFrom._id,
          accountTo: accountTo._id,
          transactionFrom: transactionFrom._id,
          transactionTo: transactionTo._id,
        },
      });
    },
    requestchangeAccountLeverage: async (user, accountId, leverage) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.changeAccountLeverage,
        description: `Requested to change leverage to ${leverage}.`,
        metadata: {
          account_id: accountId,
          leverage,
        },
      });
    },
    transferFundsBetweenAccounts: async (
      user,
      accountFrom,
      accountTo,
      transactionFrom,
      transactionTo
    ) => {
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.transferFundsBetweenAccounts,
        description: `User transfered ${utilFunctions.formatCurrency(
          transactionFrom.amount,
          transactionFrom.currency
        )} from ${accountFrom.platform}-${accountFrom.login_id} account to ${
          accountTo.platform
        }-${accountTo.login_id} account (${utilFunctions.formatCurrency(
          transactionTo.amount,
          transactionTo.currency
        )}).`,
        metadata: {
          account_from_id: accountFrom._id,
          account_to_id: accountTo._id,
          transaction_from_id: transactionFrom._id,
          transaction_to_id: transactionTo._id,
        },
      });
    },
  },
  CRM_ACTIONS: {
    approveKYCDocument: async (user, document, crmuser) => {
      let crmuser_name = crmuser.first_name + " " + crmuser.last_name;
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.approveKYCDocument,
        description: `Approved KYC document (${document.document_type}).`,
        metadata: {
          document_id: document._id,
          crmuser_id: crmuser._id,
          crmuser_name,
        },
      });
    },
    pendingChangesKYCDocument: async (user, document, crmuser) => {
      let crmuser_name = crmuser.first_name + " " + crmuser.last_name;
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.approveKYCDocument,
        description: `Pending Changes status on KYC document (${document.document_type}).`,
        metadata: {
          document_id: document._id,
          crmuser_id: crmuser._id,
          crmuser_name,
        },
      });
    },
    rejectKYCDocument: async (user, document, crmuser) => {
      let crmuser_name = crmuser.first_name + " " + crmuser.last_name;
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.approveKYCDocument,
        description: `Rejected KYC document (${document.document_type}).`,
        metadata: {
          document_id: document._id,
          crmuser_id: crmuser._id,
          crmuser_name,
        },
      });
    },
    approveChangeAccountLeverage: async (user, account, crmuser) => {
      let crmuser_name = crmuser.first_name + " " + crmuser.last_name;
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.changeAccountLeverageApproved,
        description: `Approved leverage change of account ${account.platform} ${account.login_id} to ${account.leverage}`,
        metadata: {
          document_id: account._id,
          crmuser_id: crmuser._id,
          crmuser_name,
        },
      });
    },
    rejectChangeAccountLeverage: async (user, account, crmuser) => {
      let crmuser_name = crmuser.first_name + " " + crmuser.last_name;
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.changeAccountLeverageRejected,
        description: `Rejected leverage change of account ${account.platform} ${account.login_id} to ${account.leverage}`,
        metadata: {
          document_id: account._id,
          crmuser_id: crmuser._id,
          crmuser_name,
        },
      });
    },
    userRequestAction: async (request, action, crmuser) => {
      let crmuser_name = crmuser.first_name + " " + crmuser.last_name;
      return UserLogsModel.create({
        user: request.user._id,
        action_type: USER_LOGS_ACTION_TYPES.userRequestAction,
        description: `Requested type "${request.request_type}" was ${action}.`,
        metadata: {
          request_id: request._id,
          crmuser_id: crmuser._id,
          crmuser_name,
          action,
        },
      });
    },
    approveWithdrawal: async (
      request,
      action,
      crmuser,
      account,
      transactions
    ) => {
      let crmuser_name = crmuser.first_name + " " + crmuser.last_name;
      return UserLogsModel.create({
        user: request.user._id,
        action_type: USER_LOGS_ACTION_TYPES.withdrawalApproved,
        description: `[${account.platform}] Withdrawal processed and approved. (Amount: ${account?.currency} ${request?.metadata?.amount}, Account: ${account.login_id}, with ${transactions.length} transactions)`,
        metadata: {
          request_id: request._id,
          crmuser_id: crmuser._id,
          account_id: account._id,
          account_login_id: account.login_id,
          transactions: transactions.map((t) => t._id),
          crmuser_name,
          action,
        },
      });
    },
    rejectWithdrawal: async (
      request,
      action,
      crmuser,
      account,
      transaction
    ) => {
      let crmuser_name = crmuser.first_name + " " + crmuser.last_name;
      return UserLogsModel.create({
        user: request.user._id,
        action_type: USER_LOGS_ACTION_TYPES.withdrawalRejected,
        description: `[${account.platform}] Withdrawal rejected. (Amount: ${transaction.processed_currency} ${transaction.processed_amount}, Account: ${account.login_id})`,
        metadata: {
          request_id: request._id,
          crmuser_id: crmuser._id,
          account_id: account._id,
          account_login_id: account.login_id,
          transaction_id: transaction._id,
          crmuser_name,
          action,
        },
      });
    },
    approveCryptoDeposit: async (
      request,
      action,
      crmuser,
      account,
      transaction
    ) => {
      let crmuser_name = crmuser.first_name + " " + crmuser.last_name;
      return UserLogsModel.create({
        user: request.user._id,
        action_type: USER_LOGS_ACTION_TYPES.depositCryptoRequestApproved,
        description: `[${account.platform}] Crypto deposit processed and approved. (Amount: ${transaction.processed_currency} ${transaction.processed_amount}, Account: ${account.login_id})`,
        metadata: {
          request_id: request._id,
          crmuser_id: crmuser._id,
          account_id: account._id,
          account_login_id: account.login_id,
          transaction_id: transaction._id,
          crmuser_name,
          action,
        },
      });
    },
    rejectCryptoDeposit: async (
      request,
      action,
      crmuser,
      account,
      transaction
    ) => {
      let crmuser_name = crmuser.first_name + " " + crmuser.last_name;
      return UserLogsModel.create({
        user: request.user._id,
        action_type: USER_LOGS_ACTION_TYPES.depositCryptoRequestRejected,
        description: `[${account.platform}] Crypto deposit rejected. (Amount: ${transaction.processed_currency} ${transaction.processed_amount}, Account: ${account.login_id})`,
        metadata: {
          request_id: request._id,
          crmuser_id: crmuser._id,
          account_id: account._id,
          account_login_id: account.login_id,
          transaction_id: transaction._id,
          crmuser_name,
          action,
        },
      });
    },
    rejectTransferFundsBetweenAccounts: async (
      request,
      action,
      crmuser,
      accountFrom,
      accountTo,
      transactionFrom,
      transactionTo
    ) => {
      return UserLogsModel.create({
        user: request.user._id,
        action_type:
          USER_LOGS_ACTION_TYPES.requestTransferBetweenAccountsRejected,
        description: `Rejected to transfer ${utilFunctions.formatCurrency(
          transactionFrom.amount,
          transactionFrom.currency
        )} from ${accountFrom.platform}-${accountFrom.login_id} account to ${
          accountTo.platform
        }-${accountTo.login_id} account (${utilFunctions.formatCurrency(
          transactionTo.amount,
          transactionTo.currency
        )}).`,
        metadata: {
          request_id: request._id,
          crmuser_id: crmuser._id,
          account_from_id: accountFrom._id,
          account_to_id: accountTo._id,
          transaction_from_id: transactionFrom._id,
          transaction_to_id: transactionTo._id,
          crmuser_name: crmuser.first_name + " " + crmuser.last_name,
          action,
        },
      });
    },
    approveTransferFundsBetweenAccounts: async (
      request,
      action,
      crmuser,
      accountFrom,
      accountTo,
      transactionFrom,
      transactionTo
    ) => {
      return UserLogsModel.create({
        user: request.user._id,
        action_type:
          USER_LOGS_ACTION_TYPES.requestTransferBetweenAccountsApproved,
        description: `Approved and completed transfer ${utilFunctions.formatCurrency(
          transactionFrom.amount,
          transactionFrom.currency
        )} from ${accountFrom.platform}-${accountFrom.login_id} account to ${
          accountTo.platform
        }-${accountTo.login_id} account (${utilFunctions.formatCurrency(
          transactionTo.amount,
          transactionTo.currency
        )}).`,
        metadata: {
          request_id: request._id,
          crmuser_id: crmuser._id,
          account_from_id: accountFrom._id,
          account_to_id: accountTo._id,
          transaction_from_id: transactionFrom._id,
          transaction_to_id: transactionTo._id,
          crmuser_name: crmuser.first_name + " " + crmuser.last_name,
          action,
        },
      });
    },
    balanceOperationDeposit: async (
      user,
      transaction,
      account,
      reason,
      crmuser
    ) => {
      let crmuser_name = crmuser.first_name + " " + crmuser.last_name;
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.balanceOperationDeposit,
        description: `[${account.platform}] Manual deposit made by ${crmuser_name}. (Amount: ${transaction.processed_currency} ${transaction.processed_amount}, Account: ${account.login_id})`,
        metadata: {
          reason,
          crmuser_id: crmuser._id,
          account_id: account._id,
          account_login_id: account.login_id,
          transaction_id: transaction._id,
          crmuser_name,
        },
      });
    },
    balanceOperationWithdrawal: async (
      user,
      transaction,
      account,
      reason,
      crmuser
    ) => {
      let crmuser_name = crmuser.first_name + " " + crmuser.last_name;
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.balanceOperationDeposit,
        description: `[${account.platform}] Manual withdrawal made by ${crmuser_name}. (Amount: ${transaction.processed_currency} ${transaction.processed_amount}, Account: ${account.login_id})`,
        metadata: {
          reason,
          crmuser_id: crmuser._id,
          account_id: account._id,
          account_login_id: account.login_id,
          transaction_id: transaction._id,
          crmuser_name,
        },
      });
    },
    transferFundsBetweenAccounts: async (
      crmuser,
      user,
      accountFrom,
      accountTo,
      transactionFrom,
      transactionTo,
      reason
    ) => {
      let crmuser_name = crmuser.first_name + " " + crmuser.last_name;
      return UserLogsModel.create({
        user: user._id,
        action_type: USER_LOGS_ACTION_TYPES.transferFundsBetweenAccounts,
        description: `Transfered ${utilFunctions.formatCurrency(
          transactionFrom.amount,
          transactionFrom.currency
        )} from ${accountFrom.platform}-${accountFrom.login_id} account to ${
          accountTo.platform
        }-${accountTo.login_id} account (${utilFunctions.formatCurrency(
          transactionTo.amount,
          transactionTo.currency
        )}) by CRMUser ${crmuser_name}.`,
        metadata: {
          reason,
          crmuser_id: crmuser._id,
          account_from_id: accountFrom._id,
          account_to_id: accountTo._id,
          transaction_from_id: transactionFrom._id,
          transaction_to_id: transactionTo._id,
        },
      });
    },
  },
};

export default userLogsService;
