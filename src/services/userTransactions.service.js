import {
  PRAXIS_SESSION_INTENTS,
  PRAXIS_SESSION_STATUS,
  PRAXIS_TRANSACTION_STATUS,
  USER_TRANSACTION_TYPES,
} from "../config/enums";
import errorCodes from "../config/errorCodes";
import UserTransactionsModel from "../models/UserTransactions.model";
import HTTPError from "../utils/HTTPError";
import utilFunctions from "../utils/util.functions";
import currencyExchangeService from "./currencyExchange.service";
import userAccountsService from "./userAccounts.service";
import userRequestsService from "./userRequests.service";
import { transactionsPercentagePerMonth } from "../utils/customValidation";
import UserTransactionsDailyStatsModel from "../models/UserTransactionsDailyStats.model";
import { CTRADER_ACCOUNT_TYPES } from "../config/accountTypes";
import mongoose from "mongoose";
import { ENV } from "../config/envs";
import {
  CRYPTO_CURRENCIES,
  INNOVOULT_SUPPORTED_CURRENCIES,
} from "../config/currencies";
import { PAYMENT_GATEWAYS } from "../config/paymentGateways";
import Currency from "../utils/Currency";
import gigadatService from "./gigadat.service";
import { VP_RESPONSE_CODES } from "./virtualPay.service";

function virtualPayStatusToTransactionStatus(vpStatus) {
  if (vpStatus == "0") return PRAXIS_TRANSACTION_STATUS.payment_approved;
  if (vpStatus == "01") return PRAXIS_TRANSACTION_STATUS.payment_pending;
  return PRAXIS_TRANSACTION_STATUS.payment_rejected;
}

const userTransactionsService = {
  getUserTransactions: async ({
    page,
    limit,
    filters = {},
    sort,
    paginated = true,
    brand,
    allowedCountries,
  }) => {
    // prettier-ignore
    const aggregation = UserTransactionsModel.aggregate([
      { $match: { amount: { $exists: true }, transaction_status: { $ne: PRAXIS_TRANSACTION_STATUS.payment_initialized, }, }, },
      { $match: filters },
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user", pipeline: [ { $project: { _id: 1, first_name: 1, last_name: 1, email: 1, ctrader_id: 1, readableId: 1, mt5_id: 1, mt4_id: 1, brand: 1, country: 1, metadata: 1 }, }, ], }, },
      { $unwind: "$user" },
      { $match: { "user.brand": brand, ...(allowedCountries ? { "user.country": { $in: allowedCountries}}: {}) } },
      { $lookup: { from: "useraccounts", localField: "userAccount", foreignField: "_id", as: "userAccount", pipeline: [ { $project: { login_id: 1, platform: 1 }, }, ], }, },
      { $unwind: "$userAccount" },
      { $lookup: { from: "useraccounts", localField: "transferAccount", foreignField: "_id", as: "transferAccount", pipeline: [ { $project: { login_id: 1, platform: 1 }, }, ], }, },
      { $unwind: { path: "$transferAccount", preserveNullAndEmptyArrays: true } },
    ]);
    if (paginated) {
      return UserTransactionsModel.aggregatePaginate(aggregation, {
        page,
        limit,
        sort: sort ?? { createdAt: -1 },
        collation: { locale: "en", numericOrdering: true },
      }).then((res) => {
        utilFunctions.decimal2JSON(res.docs);
        return res;
      });
    } else {
      return aggregation
        .collation({ locale: "en", numericOrdering: true })
        .sort(sort ?? { createdAt: -1 })
        .then((res) => {
          utilFunctions.decimal2JSON(res);
          return res;
        });
    }
  },
  getAccountTransactions: async ({
    accountId,
    page,
    limit,
    brand,
    allowedCountries,
  }) => {
    // prettier-ignore
    const aggregation = UserTransactionsModel.aggregate([
      { $match: { userAccount: new mongoose.Types.ObjectId(accountId), amount: { $exists: true }, transaction_status: { $ne: PRAXIS_TRANSACTION_STATUS.payment_initialized, }, }, },
      { $match: filters },
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user", pipeline: [ { $project: { _id: 1, first_name: 1, last_name: 1, email: 1, ctrader_id: 1, readableId: 1, mt5_id: 1, mt4_id: 1, brand: 1, country: 1, metadata: 1 }, }, ], }, },
      { $unwind: "$user" },
      { $match: { "user.brand": brand, ...(allowedCountries ? { "user.country": { $in: allowedCountries}}: {}) } },
      { $lookup: { from: "useraccounts", localField: "transferAccount", foreignField: "_id", as: "transferAccount", pipeline: [ { $project: { login_id: 1, platform: 1 }, }, ], }, },
      { $unwind: { path: "$transferAccount", preserveNullAndEmptyArrays: true } },
    ]);
    return UserTransactionsModel.aggregatePaginate(aggregation, {
      page,
      limit,
      sort: sort ?? { createdAt: -1 },
      collation: { locale: "en", numericOrdering: true },
    }).then((res) => {
      utilFunctions.decimal2JSON(res.docs);
      return res;
    });
  },
  getFirstTimeDepositsPaginated: async ({
    page,
    limit,
    filters,
    brand,
    allowedCountries,
  }) => {
    // prettier-ignore
    const aggregation = UserTransactionsModel.aggregate([
      { $match: { amount: { $exists: true }, transaction_status: PRAXIS_TRANSACTION_STATUS.payment_approved, transaction_type: {$in: [USER_TRANSACTION_TYPES.deposit, USER_TRANSACTION_TYPES.balance_operation_deposit]} }, },
      { $group: { _id: "$user", firstDeposit: { $first: "$$ROOT" }, }, },
      { $replaceRoot: { newRoot: "$$ROOT.firstDeposit", }, },
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user", pipeline: [ { $project: { _id: 1, first_name: 1, last_name: 1, email: 1, ctrader_id: 1, readableId: 1, mt5_id: 1, mt4_id: 1, brand: 1, country: 1, metadata: 1}, }, ], }, },
      { $unwind: "$user" },
      { $match: { "user.brand": brand, ...(allowedCountries ? { "user.country": { $in: allowedCountries } } : {}), }, },
    ]);

    if (filters) {
      aggregation.match(filters);
    }

    return UserTransactionsModel.aggregatePaginate(aggregation, {
      page,
      limit,
      sort: { updatedAt: -1 },
      collation: { locale: "en", numericOrdering: true },
    }).then((res) => {
      utilFunctions.decimal2JSON(res.docs);
      return res;
    });
  },
  getTransactionsStatus: async () => {
    var currentYear = new Date(new Date().getFullYear, 0, 1);
    // prettier-ignore
    const transactionsStatus = await UserTransactionsModel.aggregate([
      { $match: { createdAt: { $gte: currentYear }, transaction_status: "approved", }, },
      { $group: { _id: { Year: { $year: "$createdAt" }, Month: { $month: "$createdAt" }, }, totalTransactions: { $sum: 1 }, total_deposits: { $sum: { $cond: [ { $eq: ["$transaction_type", USER_TRANSACTION_TYPES.deposit] }, 1, 0, ], }, }, total_deposits_amount: { $sum: { $cond: [ { $eq: ["$transaction_type", USER_TRANSACTION_TYPES.deposit] }, "$processed_usd_amount", 0, ], }, }, total_withdrawals: { $sum: { $cond: [ { $eq: ["$transaction_type", USER_TRANSACTION_TYPES.withdrawal], }, 1, 0, ], }, }, total_withdrawals_amount: { $sum: { $cond: [ { $eq: ["$transaction_type", USER_TRANSACTION_TYPES.withdrawal], }, "$processed_usd_amount", 0, ], }, }, }, },
      { $replaceRoot: { newRoot: { $mergeObjects: ["$_id", "$$ROOT"] } } },
      { $sort: { Year: 1, Month: 1 } },
      { $project: { _id: 0, Year: 1, totalTransactions: 1, total_deposits: 1, total_deposits_amount: 1, total_withdrawals: 1, total_withdrawals_amount: 1, Month: { $arrayElemAt: [ [ "", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ], "$Month", ], }, }, },
    ]);

    return transactionsStatus.map((elem) =>
      transactionsPercentagePerMonth(
        JSON.parse(elem.total_deposits_amount),
        JSON.parse(elem.total_withdrawals_amount),
        elem.Month,
        elem.Year
      )
    );
  },
  getTransactionsCsv: async (filters, brand, allowedCountries) => {
    // prettier-ignore
    const transactionsCsv =  await UserTransactionsModel.aggregate([
      { $match: {...filters,transaction_status:{$in:['approved','rejected']}}  },
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "users_info",pipeline: [ { $project: { email: 1 ,first_name:1, last_name:1,ctrader_id:1,readableId:1, country: 1, brand: 1}, }, { $sort: { createdAt: 1 }, }, ] }, },
      { $unwind: "$users_info" },
      { $match: { "users_info.brand": brand, ...(allowedCountries ? { "users_info.country": { $in: allowedCountries } } : {}) }},
      { $sort: { date: 1 } },
    ]);
    utilFunctions.decimal2JSON(transactionsCsv);
    return transactionsCsv;
  },
  getTransactionById: async (transaction_id) => {
    return UserTransactionsModel.findById(transaction_id).populate(
      "user userAccount"
    );
  },
  getUserTotalDepositsWithdrawals: async (user_id) => {
    // prettier-ignore
    return await  UserTransactionsModel.aggregate([
      { $match: { user: mongoose.Types.ObjectId(user_id), transaction_status: "approved", }, },
      {
        $group: {
          _id: "$user",
          totalDeposits: { $sum: { $cond: [ { $or: 
            [{$eq: ["$transaction_type", USER_TRANSACTION_TYPES.deposit]}, 
            {$eq: ["$transaction_type", USER_TRANSACTION_TYPES.balance_operation_deposit]},
          ]
           }, "$processed_usd_amount", 0, ], }, },
          totalCreditDeposits: { $sum: { $cond: [{ $eq: ["$transaction_type", USER_TRANSACTION_TYPES.credit_operation_deposit]}, "$processed_usd_amount", 0,]}, },
          totalWithdrawals: { $sum: { $cond: [ { $or:
             [{$eq: ["$transaction_type", USER_TRANSACTION_TYPES.withdrawal]},
             {$eq: ["$transaction_type", USER_TRANSACTION_TYPES.balance_operation_withdrawal]}] 
            }, "$processed_usd_amount", 0, ], }, },
          totalCreditWithdrawals: { $sum: { $cond: [{ $eq: ["$transaction_type", USER_TRANSACTION_TYPES.credit_operation_withdrawal]}, "$processed_usd_amount", 0,]}, },
        },
      },
    ]).then(res => {
      utilFunctions.decimal2JSON(res[0] ?? {});
      return ({
        _id: user_id,
        totalDeposits: res[0] ? res[0].totalDeposits : 0,
        totalWithdrawals: res[0] ? res[0].totalWithdrawals : 0,
        totalCreditDeposits: res[0] ? res[0].totalCreditDeposits : 0,
        totalCreditWithdrawals: res[0] ? res[0].totalCreditWithdrawals : 0,
      })
    });
  },
  calculateDailyTransactionStats: async (
    startDate,
    endDate,
    brand,
    allowedCountries
  ) => {
    if (!endDate) {
      endDate = new Date();
    }

    // prettier-ignore
    let transactionsDailyStats = await UserTransactionsModel.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, transaction_status: "approved", }, },
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "users_info", pipeline: [ { $match: { brand, ...(allowedCountries ? { country: { $in: allowedCountries } } : {}), }, }, ], }, },
      { $unwind: "$users_info" },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total_deposits: { $sum: { $cond: [ { $or: [ { $eq: [ "$transaction_type", USER_TRANSACTION_TYPES.deposit, ], }, { $eq: [ "$transaction_type", USER_TRANSACTION_TYPES.balance_operation_deposit, ], }, ], }, 1, 0, ], }, }, total_deposits_amount: { $sum: { $cond: [ { $or: [ { $eq: [ "$transaction_type", USER_TRANSACTION_TYPES.deposit, ], }, { $eq: [ "$transaction_type", USER_TRANSACTION_TYPES.balance_operation_deposit, ], }, ], }, "$processed_usd_amount", 0, ], }, }, total_withdrawals: { $sum: { $cond: [ { $or: [ { $eq: [ "$transaction_type", USER_TRANSACTION_TYPES.withdrawal, ], }, { $eq: [ "$transaction_type", USER_TRANSACTION_TYPES.balance_operation_withdrawal, ], }, ], }, 1, 0, ], }, }, total_withdrawals_amount: { $sum: { $cond: [ { $or: [ { $eq: [ "$transaction_type", USER_TRANSACTION_TYPES.withdrawal, ], }, { $eq: [ "$transaction_type", USER_TRANSACTION_TYPES.balance_operation_withdrawal, ], }, ], }, "$processed_usd_amount", 0, ], }, }, }, },
      { $project: { _id: 0, date: { $convert: { input: "$_id", to: "date" } }, date_id: "$_id", total_deposits: 1, total_deposits_amount: 1, total_withdrawals: 1, total_withdrawals_amount: 1, brand: brand, allowed_countries: allowedCountries ?? [] }, },
      { $sort: { date: 1 } },
    ]);
    let tempDate = new Date(startDate.getTime());
    tempDate.setDate(tempDate.getDate() + 1);
    let datesBetween = [];
    //get all date between
    while (tempDate < endDate) {
      datesBetween.push(new Date(tempDate).toISOString().split("T")[0]);
      tempDate.setDate(tempDate.getDate() + 1);
    }

    let transactionDates = transactionsDailyStats?.map(
      (transaction) => transaction.date_id
    );

    const unTrakcedDates = datesBetween.filter((date) => {
      // return those elements not in the namesToDeleteSet
      return !transactionDates.includes(date);
    });
    for (const uDate of unTrakcedDates) {
      const transaction = new UserTransactionsDailyStatsModel({
        total_deposits: 0,
        total_deposits_amount: 0,
        total_withdrawals: 0,
        total_withdrawals_amount: 0,
        date: uDate,
        date_id: uDate,
        brand: brand,
        ...(allowedCountries
          ? { allowed_countries: allowedCountries }
          : { allowed_countries: [] }),
      });
      transactionsDailyStats.push(transaction);
    }
    return transactionsDailyStats;
  },
  getWithdrawalTransactionById: async (transaction_id) => {
    const transaction = await UserTransactionsModel.findOne({
      _id: transaction_id,
      intent: PRAXIS_SESSION_INTENTS.withdrawal,
    }).populate("user userAccount");
    if (!transaction) {
      throw new HTTPError(
        "Withdraw Transaction with that Id not found",
        404,
        errorCodes.userWithdrawalTransactionNotFound
      );
    }
    return transaction;
  },
  getDepositMethodsOfAccount: async (account_id) => {
    // prettier-ignore
    let depositMethods = await UserTransactionsModel.aggregate([
      { $match: { userAccount: mongoose.Types.ObjectId(account_id), transaction_type: USER_TRANSACTION_TYPES.deposit, transaction_status: "approved", }, },
      { $group: { _id: { gateway: "$gateway", payment_method: "$payment_method", processed_currency: "$processed_currency", card: "$card", wallet: "$wallet", }, processed_amount: { $sum: "$processed_amount" }, processed_usd_amount: { $sum: "$processed_usd_amount" }, }, },
      { $group: { _id: { gateway: "$_id.gateway", payment_method: "$_id.payment_method", processed_currency: "$_id.processed_currency", }, processed_amount: { $sum: "$processed_amount" }, processed_usd_amount: { $sum: "$processed_usd_amount" }, details: { $push: { card: "$_id.card", wallet: "$_id.wallet", processed_amount: { $sum: "$processed_amount" }, processed_usd_amount: { $sum: "$processed_usd_amount" }, }, }, }, },
      { $project: { _id: 1, payment_method: "$_id.payment_method", processed_currency: "$_id.processed_currency", gateway: "$_id.gateway", processed_amount: 1, processed_usd_amount: 1, details: 1, }, },
    ]);
    utilFunctions.decimal2JSON(depositMethods);
    return depositMethods.map((v) => ({
      ...v,
      gateway: PAYMENT_GATEWAYS.find((g) => g.hash === v.gateway)?.id || "",
    }));
  },
  getAccountRefundableBalances: async (account_id) => {
    // prettier-ignore
    const refundableBalance = await UserTransactionsModel.aggregate([
      { $match: { userAccount: mongoose.Types.ObjectId(account_id), transaction_status: "approved", }, },
      { $group: { _id: { gateway: "$gateway", payment_method: "$payment_method", processed_currency: "$processed_currency", }, deposit_amount: { $sum: { $cond: [ { $eq: ["$transaction_type", USER_TRANSACTION_TYPES.deposit], }, "$processed_amount", 0, ], }, }, withdraw_amount: { $sum: { $cond: [ { $eq: ["$transaction_type", USER_TRANSACTION_TYPES.withdrawal], }, "$processed_amount", 0, ], }, }, }, },
      { $project: { _id: 0, payment_method: "$_id.payment_method", processed_currency: "$_id.processed_currency", gateway: "$_id.gateway", refundable_balance: { $subtract: ["$deposit_amount", "$withdraw_amount"], }, }, },
    ]);
    utilFunctions.decimal2JSON(refundableBalance);

    return refundableBalance.reduce((acc, curr) => {
      let gateway =
        PAYMENT_GATEWAYS.find(
          (g) => g.hash === curr.gateway || g.id === curr.payment_method
        ) || "";
      if (gateway.refund && Number(curr.refundable_balance) > 0) {
        return acc + Number(curr.refundable_balance);
      }
      return acc;
    }, 0);
  },
  updateTransactionById: async ({ transactionId, refundAmount }) => {
    return UserTransactionsModel.findOneAndUpdate(
      {
        _id: transactionId,
      },
      {
        $set: {
          refund_amount: mongoose.Types.Decimal128(String(refundAmount)),
        },
      },
      {
        returnDocument: "after",
      }
    );
  },
  deposit: async (user_id, account_id) => {
    return UserTransactionsModel.create({
      user: user_id,
      userAccount: account_id,
      transaction_type: USER_TRANSACTION_TYPES.deposit,
    });
  },
  depositManualBalanceOperation: async (
    user_id,
    account_id,
    preciseAmount,
    currency,
    payment_method,
    reason,
    comment
  ) => {
    const amount = Currency.fromPrecise({ amount: preciseAmount, currency });
    return UserTransactionsModel.create({
      user: user_id,
      userAccount: account_id,
      transaction_type: USER_TRANSACTION_TYPES.balance_operation_deposit,
      transaction_status: PRAXIS_TRANSACTION_STATUS.payment_approved,
      amount: amount.getAmountPrecise(),
      currency,
      processed_amount: amount.getAmountPrecise(),
      processed_currency: currency,
      processed_usd_amount: (
        await amount.convertToCurrency("USD")
      ).getAmountPrecise(),
      processed_usd_conversion_rate: await amount.getExchangeRate("USD"),
      payment_method,
      variable1: reason,
      variable2: comment,
    });
  },
  depositManualCreditOperation: async (
    user_id,
    account_id,
    amount,
    currency,
    payment_method,
    reason,
    comment
  ) => {
    const usdRate = await currencyExchangeService.getCurrencyExchangeFromUSD(
      currency
    );
    return UserTransactionsModel.create({
      user: user_id,
      userAccount: account_id,
      transaction_type: USER_TRANSACTION_TYPES.credit_operation_deposit,
      transaction_status: PRAXIS_TRANSACTION_STATUS.payment_approved,
      amount,
      currency,
      processed_amount: amount,
      processed_currency: currency,
      processed_usd_amount: amount * usdRate,
      processed_usd_conversion_rate: usdRate,
      payment_method,
      variable1: reason,
      variable2: comment,
    });
  },
  withdrawManualBalanceOperation: async (
    user_id,
    account_id,
    amount,
    currency,
    payment_method,
    reason,
    comment
  ) => {
    const usdRate = await currencyExchangeService.getCurrencyExchangeFromUSD(
      currency
    );
    return UserTransactionsModel.create({
      user: user_id,
      userAccount: account_id,
      transaction_type: USER_TRANSACTION_TYPES.balance_operation_withdrawal,
      transaction_status: PRAXIS_TRANSACTION_STATUS.withdrawal_approved,
      amount,
      currency,
      processed_amount: amount,
      processed_currency: currency,
      processed_usd_amount: amount * usdRate,
      processed_usd_conversion_rate: usdRate,
      payment_method,
      variable1: reason,
      variable2: comment,
    });
  },
  withdrawManualCreditOperation: async (
    user_id,
    account_id,
    amount,
    currency,
    payment_method,
    reason,
    comment
  ) => {
    const usdRate = await currencyExchangeService.getCurrencyExchangeFromUSD(
      currency
    );
    return UserTransactionsModel.create({
      user: user_id,
      userAccount: account_id,
      transaction_type: USER_TRANSACTION_TYPES.credit_operation_withdrawal,
      transaction_status: PRAXIS_TRANSACTION_STATUS.withdrawal_approved,
      amount,
      currency,
      processed_amount: amount,
      processed_currency: currency,
      processed_usd_amount: amount * usdRate,
      processed_usd_conversion_rate: usdRate,
      payment_method,
      variable1: reason,
      variable2: comment,
    });
  },
  depositBitgoCrypto: async ({
    account,
    amount: _amount,
    pending = false,
    bitgoWalletId,
    bitgoCoin,
    bitgoTransferId,
    bitgoAddressId,
  }) => {
    const amount = new Currency({
      amount: _amount,
      currency: account.currency,
    });
    return UserTransactionsModel.create({
      user: account.user?._id ?? account.user,
      userAccount: account._id,
      transaction_type: USER_TRANSACTION_TYPES.deposit,
      currency: account.currency,
      intent: PRAXIS_SESSION_INTENTS.payment,
      amount: amount.getAmountPrecise(),
      processed_amount: amount.getAmountPrecise(),
      processed_currency: account.currency,
      timestamp: new Date(),
      payment_method: "tioMarketsBitgo",
      transaction_status: pending
        ? PRAXIS_TRANSACTION_STATUS.payment_pending
        : PRAXIS_TRANSACTION_STATUS.payment_approved,
      processed_usd_conversion_rate: await amount.getExchangeRate("USD"),
      processed_usd_amount: (
        await amount.convertToCurrency("USD")
      ).getAmountPrecise(),

      bitgoWalletId,
      bitgoCoin,
      bitgoTransferId,
      bitgoAddressId,
    });
  },
  withdrawRequest: async ({
    user,
    account,
    requestedCurrency,
    amount,
    details,
  }) => {
    const usdRate = await currencyExchangeService.getCurrencyExchangeFromUSD(
      account.currency
    );
    const transaction = await UserTransactionsModel.create({
      user: user._id,
      userAccount: account._id,
      transaction_type: USER_TRANSACTION_TYPES.withdrawal,
      intent: PRAXIS_SESSION_INTENTS.withdrawal,
      transaction_status: PRAXIS_TRANSACTION_STATUS.withdrawal_pending,
      currency: account.currency,
      amount,
      conversion_rate: 1,
      processed_currency: account.currency,
      processed_amount: amount,
      processed_usd_conversion_rate: usdRate,
      processed_usd_amount: amount * usdRate,
    });
    try {
      const _account = await userAccountsService.withdrawRequest(
        transaction._id,
        account._id,
        amount,
        "withdrawal"
      );
      const request = await userRequestsService.WITHDRAW_FUNDS.request(
        user._id,
        transaction,
        CRYPTO_CURRENCIES.includes(requestedCurrency) ? "crypto" : "fiat",
        details,
        requestedCurrency
      );
      await transaction.save();
      return { transaction, request, account: _account };
    } catch (err) {
      await transaction.remove();
      throw err;
    }
  },
  withdrawalApproved: async (transaction, methods, fee) => {
    let transactions = [];
    const usdRate = transaction.processed_usd_conversion_rate;
    // Gigadat automation
    const gigadataPresent = methods.find(
      (m) => m.type === "tiomarketGigadatInterac"
    );
    if (!!gigadataPresent) {
      const lastGigadataDeposit = await UserTransactionsModel.findOne({
        user: transaction.user,
        transaction_type: USER_TRANSACTION_TYPES.deposit,
        gateway: "I9omVfzqHMnKpI02YaDjJqdSB-GFOy-I",
        transaction_status: PRAXIS_TRANSACTION_STATUS.payment_approved,
        tid: { $exists: true },
      });
      if (!lastGigadataDeposit) {
        throw new HTTPError("No gigadata deposit found", 409, {
          message: "No previous gigadata deposit found",
        });
      }
      const gigadataWithdrawResult = await gigadatService.withdraw({
        gigadatTransactionId: lastGigadataDeposit.tid,
        preciseAmount: gigadataPresent.amount,
        currency: transaction.currency,
      });
      if (!gigadataWithdrawResult) {
        throw new HTTPError("Unable to create withdrawal with gigadata", 500, {
          message: "Unable to create withdrawal with gigadata",
        });
      }
    }
    // -----------------
    if (methods.length > 0) {
      transaction.payment_method = methods[0].type;
      transaction.amount = methods[0].amount;
      transaction.processed_amount = methods[0].amount;
      transaction.processed_usd_amount = methods[0].amount * usdRate;
      transaction.markModified("payment_method");
      transaction.transaction_status =
        PRAXIS_TRANSACTION_STATUS.withdrawal_approved;
      if (fee) {
        transaction.fee = fee.amount;
        transaction.fee_type = fee.reason;
      }
      transaction = await transaction.save();
    }
    if (methods.length > 1) {
      transactions = await Promise.all(
        methods.slice(1).map(async (m) => {
          let obj = {
            ...transaction.toJSON(),
            user: transaction.user?._id || transaction.user,
            userAccount:
              transaction.userAccount?._id || transaction.userAccount,
            payment_method: m.type,
            amount: m.amount,
            processed_amount: m.amount,
            processed_usd_amount: m.amount * usdRate,
            transaction_status: PRAXIS_TRANSACTION_STATUS.withdrawal_approved,
          };
          delete obj._id;
          delete obj.createdAt;
          delete obj.updatedAt;
          return UserTransactionsModel.create(obj);
        })
      );
    }
    return [transaction, ...transactions];
  },
  withdrawalRejected: async (transaction, reason) => {
    transaction.transaction_status =
      PRAXIS_TRANSACTION_STATUS.withdrawal_rejected;
    transaction.variable2 = reason;
    return transaction.save();
  },
  depositCryptoApproved: async (transaction) => {
    transaction.transaction_status = PRAXIS_TRANSACTION_STATUS.payment_approved;
    return transaction.save();
  },
  depositCryptoRejected: async (transaction) => {
    transaction.transaction_status = PRAXIS_TRANSACTION_STATUS.payment_rejected;
    return transaction.save();
  },
  addTransactionProcessedUSD: async (transaction_id, processed_currency) => {
    const usdRate = await currencyExchangeService.getCurrencyExchangeFromUSD(
      processed_currency
    );
    return UserTransactionsModel.findOneAndUpdate(
      { _id: transaction_id },
      [
        {
          $set: {
            processed_usd_conversion_rate: usdRate,
            processed_usd_amount: { $multiply: ["$processed_amount", usdRate] },
          },
        },
      ],
      { returnDocument: "after" }
    );
  },
  createInnoVoultDepositTransaction: async ({ user, account, amount }) => {
    const usdRate = await currencyExchangeService.getCurrencyExchangeFromUSD(
      account.currency
    );
    const usdAmount = amount * usdRate;
    let minDeposit = CTRADER_ACCOUNT_TYPES.find(
      (acc) => acc.name === account.account_type
    ).minDeposit;
    if (
      (ENV === "staging" || ENV === "development") &&
      INNOVOULT_SUPPORTED_CURRENCIES.includes(account.currency)
    ) {
      minDeposit = 0;
    }
    if (usdAmount < minDeposit) {
      throw new HTTPError("Minimum deposit amount is not reached", 409, {
        messasge: `Minimum deposit amount for ${account.account_type} account is ${minDeposit} USD`,
        amount: usdAmount,
      });
    }

    return UserTransactionsModel.create({
      user: user._id,
      userAccount: account._id,
      intent: PRAXIS_SESSION_INTENTS.payment,
      transaction_type: USER_TRANSACTION_TYPES.deposit,
      transaction_status: PRAXIS_TRANSACTION_STATUS.payment_initialized,
      currency: account.currency,
      amount,
      session_status: PRAXIS_SESSION_STATUS.open,
      processed_currency: account.currency,
      processed_amount: amount,
      processed_usd_conversion_rate: usdRate,
      processed_usd_amount: usdAmount,
      payment_method: "crypto",
      payment_processor: "innovoult",
      gateway: "innovoult",
      timestamp: new Date(),
    });
  },
  createInnoVoultWithdrawTransaction: async ({ user, account, amount }) => {
    const usdRate = await currencyExchangeService.getCurrencyExchangeFromUSD(
      account.currency
    );
    const usdAmount = amount * usdRate;
    const minWithdrawal = CTRADER_ACCOUNT_TYPES.find(
      (acc) => acc.name === account.account_type
    ).minWithdrawal;
    if (usdAmount < minWithdrawal) {
      throw new HTTPError("Minimum withdrawal amount is not reached", 409, {
        messasge: `Minimum withdrawal amount for ${account.account_type} account is ${minWithdrawal} USD`,
        amount: usdAmount,
      });
    }

    return UserTransactionsModel.create({
      user: user._id,
      userAccount: account._id,
      intent: PRAXIS_SESSION_INTENTS.withdrawal,
      transaction_type: USER_TRANSACTION_TYPES.withdrawal,
      transaction_status: PRAXIS_TRANSACTION_STATUS.payment_initialized,
      currency: account.currency,
      amount,
      session_status: PRAXIS_SESSION_STATUS.open,
      processed_currency: account.currency,
      processed_amount: amount,
      processed_usd_conversion_rate: usdRate,
      processed_usd_amount: usdAmount,
      payment_method: "crypto",
      payment_processor: "innovoult",
      gateway: "innovoult",
      timestamp: new Date(),
    });
  },
  createPendingVirtualPayDeposit: async ({ account, amount }) => {
    return UserTransactionsModel.create({
      user: account.user?._id ?? account.user,
      userAccount: account._id,
      intent: PRAXIS_SESSION_INTENTS.payment,
      transaction_type: USER_TRANSACTION_TYPES.deposit,
      transaction_status: PRAXIS_TRANSACTION_STATUS.payment_initialized,
      currency: account.currency,
      amount,
      payment_method: "pixVirtualPay",
      payment_processor: "pixVirtualPay",
      gateway: "pixVirtualPay",
      timestamp: new Date(),
    });
  },
  updatePendingVirtualPayDeposit: async ({
    transactionId,
    amount,
    currency,
    vpStatus,
    card,
  }) => {
    const currObj = Currency.fromPrecise({ amount, currency });
    let vpStatusToTransactionStatus =
      virtualPayStatusToTransactionStatus(vpStatus);
    let vpResponse = VP_RESPONSE_CODES.find((v) => v.code == vpStatus);
    return UserTransactionsModel.findOneAndUpdate(
      {
        _id: transactionId,
      },
      {
        $set: {
          transaction_status: vpStatusToTransactionStatus,
          processed_amount: mongoose.Types.Decimal128(amount),
          processed_currency: currency,
          processed_usd_conversion_rate: await currObj.getExchangeRate("USD"),
          processed_usd_amount: mongoose.Types.Decimal128(
            (await currObj.convertToCurrency("USD")).getAmountPrecise()
          ),
          variable2: vpResponse?.message || "",
          "card.card_number": card || "",
        },
      },
      { returnDocument: "after" }
    );
  },
  createTransferTransactions: async (user, accountFrom, accountTo, amount) => {
    const currFrom = Currency.fromPrecise({
      amount,
      currency: accountFrom.currency,
    });
    const currTo = await currFrom.convertToCurrency(accountTo.currency);
    if (currFrom.isGreaterThan(accountFrom.balance, 0)) {
      throw new HTTPError("Insufficient funds", 409, {
        message: "Insufficient funds in account",
      });
    }
    const transactionFrom = await UserTransactionsModel.create({
      user: user._id,
      userAccount: accountFrom._id,
      intent: PRAXIS_SESSION_INTENTS.withdrawal,
      transaction_type: USER_TRANSACTION_TYPES.transfer_between_accounts,
      transaction_status: PRAXIS_TRANSACTION_STATUS.payment_pending,
      currency: accountFrom.currency,
      amount: currFrom.getAmountPrecise(),
      processed_currency: accountFrom.currency,
      processed_amount: currFrom.getAmountPrecise(),
      processed_usd_conversion_rate: await currFrom.getExchangeRate("USD"),
      processed_usd_amount: (
        await currFrom.convertToCurrency("USD")
      ).getAmountPrecise(),
      payment_method: "tioAccountTransfer",
      payment_processor: "tioAccountTransfer",
      gateway: "tioAccountTransfer",
      timestamp: new Date(),
      transferAccount: accountTo._id,
    });
    const transactionTo = await UserTransactionsModel.create({
      user: user._id,
      userAccount: accountTo._id,
      intent: PRAXIS_SESSION_INTENTS.payment,
      transaction_type: USER_TRANSACTION_TYPES.transfer_between_accounts,
      transaction_status: PRAXIS_TRANSACTION_STATUS.payment_pending,
      currency: accountTo.currency,
      amount: currTo.getAmountPrecise(),
      processed_currency: accountTo.currency,
      processed_amount: currTo.getAmountPrecise(),
      processed_usd_conversion_rate: await currTo.getExchangeRate("USD"),
      processed_usd_amount: (
        await currTo.convertToCurrency("USD")
      ).getAmountPrecise(),
      payment_method: "tioAccountTransfer",
      payment_processor: "tioAccountTransfer",
      gateway: "tioAccountTransfer",
      timestamp: new Date(),
      transferAccount: accountFrom._id,
    });
    return { transactionFrom, transactionTo };
  },
  transferFundsBetweenAccounts: async (
    user,
    accountFrom,
    accountTo,
    amount
  ) => {
    const { transactionFrom, transactionTo } =
      await userTransactionsService.createTransferTransactions(
        user,
        accountFrom,
        accountTo,
        amount
      );
    accountFrom = await userAccountsService.withdrawFromAccount(
      accountFrom._id,
      transactionFrom
    );
    accountTo = await userAccountsService.depositToAccount(
      accountTo._id,
      transactionTo
    );

    transactionFrom.transaction_status =
      PRAXIS_TRANSACTION_STATUS.payment_approved;
    transactionTo.transaction_status =
      PRAXIS_TRANSACTION_STATUS.payment_approved;
    await transactionFrom.save();
    await transactionTo.save();

    return { transactionFrom, transactionTo, accountFrom, accountTo };
  },
  addTransactionPlatformId: async (transaction_id, platform_id) => {
    return UserTransactionsModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(transaction_id) },
      { $set: { platform_id } },
      { returnDocument: "after" }
    );
  },
};

export default userTransactionsService;
