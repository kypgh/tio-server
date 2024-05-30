import axios from "axios";
import {
  CTRADER_APP_URL,
  HOST_URL,
  MEMBERS_AREA_URL,
  PRAXIS_API_APP_KEY,
  PRAXIS_API_MERCHANT_ID,
  PRAXIS_API_MERCHANT_SECRET,
  PRAXIS_API_PROXY_URL,
  PRAXIS_ENV,
  TIO_PROXY_API_KEY,
} from "../config/envs";
import { PRAXIS_MAPPED_LOCALES } from "../config/enums";
import HTTPError from "../utils/HTTPError";
import jsSHA from "jssha";
import errorCodes from "../config/errorCodes";
import UserTransactionsModel from "../models/UserTransactions.model";
import userTransactionsService from "./userTransactions.service";
import userLogsService from "./userLogs.service";
import userAccountsService from "./userAccounts.service";
import utilFunctions from "../utils/util.functions";
import currencyExchangeService from "./currencyExchange.service";
import { CTRADER_ACCOUNT_TYPES } from "../config/accountTypes";

const praxisAxios = axios.create({
  baseURL: PRAXIS_API_PROXY_URL,
  headers: {
    "x-api-key": TIO_PROXY_API_KEY,
  },
});

const TEST_GATEWAY = "g0sFedjSthRmXt4pP9n2urlqwT2_zRU3";

function signatureGenerator(data) {
  let concatenatedString = [...data, PRAXIS_API_MERCHANT_SECRET].join("");
  let signature = new jsSHA("SHA-384", "TEXT");
  signature.update(concatenatedString);
  return signature.getHash("HEX");
}

function validateSignature(signature, data) {
  const generatedSignature = signatureGenerator(data);
  return signature === generatedSignature;
}

function returnHookData() {
  let data = {
    userId: "customer.pin",
    firstName: "customer.first_name",
    lastName: "customer.last_name",
    // dob: "customer.dob",
    transactionType: "transaction.transaction_type",
    status: "transaction.transaction_status",
    transactionId: "transaction.id", // id in our system
    // traceId: "transaction.trace_id", // id in praxis system
    orderId: "transaction.order_id",
    amount: "transaction.amount",
    currency: "transaction.currency",
    paymentMethod: "transaction.payment_method",
    paymentProcessor: "transaction.payment_processor",
    // authToken: "transaction.auth_token",
  };
  return (
    "get=1" +
    Object.entries(data)
      .map(([key, value]) => `${key}={{${value}}}`)
      .join("&")
  );
}
/**
 *
 * @param {"ctraderApp" | "membersArea"} calledFrom
 */
function returnURLDependingOnCallingLocation(calledFrom, account) {
  if (calledFrom === "ctraderApp") {
    return `${CTRADER_APP_URL}/success?from=deposit&${returnHookData()}`;
  }
  if (calledFrom === "membersArea") {
    return `${MEMBERS_AREA_URL}/funds?tab=transaction-history&account=${account._id}&from=praxis`;
  }
  return "";
}

/**
 * @returns {timestamp}
 *
 * Date.now() in javascript returns timestamp in milliseconds,
 * we need it in seconds so we divide it by 1000.
 *
 * Sometimes there is a synchronization issue of about 100s between praxis and our system,
 * therefore if needed add 100s to timestamp.
 */
function getCurrentTimeStamp() {
  return Math.floor(Date.now() / 1000);
}

function mapNotificationResultToTransaction(result) {
  result.transaction.praxis_transaction_type =
    result.transaction.transaction_type;
  delete result.transaction.transaction_type;
  let amount = utilFunctions.convertCentToCurrency(
    result.transaction.currency,
    result.transaction.amount
  );
  let processed_amount = result.transaction.processed_currency
    ? utilFunctions.convertCentToCurrency(
        result.transaction.processed_currency,
        result.transaction.processed_amount
      )
    : 0;
  return {
    conversion_rate: result.conversion_rate,
    timestamp: result.timestamp * 1000, // seconds to milliseconds
    customer: result.customer,
    auth_token: result.session.auth_token,
    intent: result.session.intent,
    session_status: result.session.session_status,
    variable1: result.session.variable1,
    variable2: result.session.variable2,
    variable3: result.session.variable3,
    ...result.transaction,
    amount,
    processed_amount,
  };
}

const praxisService = {
  /**
   * @param {*} account
   * @param {*} user
   * @param {"ctraderApp" | "membersArea" } calledFrom
   * @returns
   */
  deposit: async (account, user, calledFrom = "ctraderApp") => {
    const depositTransaction = await userTransactionsService.deposit(
      user._id,
      account._id
    );
    const timestamp = getCurrentTimeStamp();
    const intent = "payment";
    const CID = String(user.ctrader_id);
    const transactionID = String(depositTransaction._id);
    let signature = signatureGenerator([
      PRAXIS_API_MERCHANT_ID,
      PRAXIS_API_APP_KEY,
      timestamp,
      intent,
      CID,
      transactionID,
    ]);
    let returnURL = returnURLDependingOnCallingLocation(calledFrom, account);
    const response = await praxisAxios
      .post(
        "/cashier/cashier",
        {
          merchant_id: PRAXIS_API_MERCHANT_ID,
          application_key: PRAXIS_API_APP_KEY,
          intent,
          currency: account.currency,
          cid: CID,
          locale: PRAXIS_MAPPED_LOCALES[user?.metadata?.language ?? "en"],
          customer_data: {
            country: user.country,
            city: user.city ?? "",
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
          },
          notification_url: `${HOST_URL}/api/webhooks/praxis/notification`,
          validation_url: `${HOST_URL}/api/webhooks/praxis/validation`,
          return_url: returnURL,
          order_id: transactionID,
          gateway: PRAXIS_ENV === "production" ? null : TEST_GATEWAY,
          version: "1.3",
          variable1: "ctrader",
          timestamp,
        },
        {
          headers: {
            "GT-Authentication": signature,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      )
      .then(async (res) => {
        if (res.data.status === 0) {
          return res;
        }
        await depositTransaction.remove();
        return Promise.reject(
          new HTTPError("Praxis API error", res.data.status, {
            type: "praxis error",
            message: res.data.description,
          })
        );
      });

    if (
      !validateSignature(response.headers["gt-authentication"], [
        response.data?.status,
        response.data?.timestamp,
        response.data?.redirect_url,
        response.data?.customer?.customer_token,
      ])
    ) {
      throw new HTTPError(
        "Invalid praxis signature",
        400,
        errorCodes.invalidPraxisSignature
      );
    }
    return response.data;
  },
  NOTIFICATION: {
    validateSignature: (
      signature,
      timestamp,
      customer,
      session,
      transaction
    ) => {
      return validateSignature(signature, [
        PRAXIS_API_MERCHANT_ID,
        PRAXIS_API_APP_KEY,
        timestamp,
        customer.customer_token,
        session.order_id,
        transaction.tid,
        transaction.currency,
        transaction.amount,
        transaction.conversion_rate,
        transaction.processed_currency,
        transaction.processed_amount,
      ]);
    },
    generateSignature: (status) => {
      const timestamp = getCurrentTimeStamp();
      const signature = signatureGenerator([status, timestamp]);
      return { timestamp, signature };
    },
    savePraxisNotification: async (transaction_id, data) => {
      const mappedResults = mapNotificationResultToTransaction(data);
      const result = await UserTransactionsModel.updateOne(
        { _id: transaction_id },
        mappedResults
      );
      let transaction = await userTransactionsService.getTransactionById(
        transaction_id
      );
      if (transaction.transaction_status === "approved") {
        if (transaction.intent === "payment") {
          transaction =
            await userTransactionsService.addTransactionProcessedUSD(
              transaction._id,
              transaction.processed_currency
            );
          await userAccountsService.depositToAccount(
            transaction.userAccount._id,
            transaction
          );
        }
      }
      if (transaction.intent === "payment") {
        await userLogsService.USER_ACTIONS.depositTransaction(
          transaction.user,
          transaction,
          transaction.userAccount
        );
      }
      return result;
    },
  },
  VALIDATION: {
    validateSignature: (
      signature,
      timestamp,
      customer,
      session,
      transaction_attempt
    ) => {
      return validateSignature(signature, [
        PRAXIS_API_MERCHANT_ID,
        PRAXIS_API_APP_KEY,
        timestamp,
        customer.customer_token,
        session.order_id,
        transaction_attempt.currency,
        transaction_attempt.amount,
        transaction_attempt.conversion_rate,
        transaction_attempt.attempted_currency,
        transaction_attempt.attempted_amount,
      ]);
    },
    generateSignature: (status) => {
      const timestamp = getCurrentTimeStamp();
      const signature = signatureGenerator([status, timestamp]);
      return { timestamp, signature };
    },
    validateAmountBasedOnAccountType: async (
      transaction_id,
      amount,
      currency
    ) => {
      const transaction = await userTransactionsService.getTransactionById(
        transaction_id
      );
      const usedConversionRate =
        await currencyExchangeService.getCurrencyExchangeFromUSD(currency);
      const usdAmount =
        utilFunctions.convertCentToCurrency(currency, amount) *
        usedConversionRate;
      const account = transaction.userAccount;
      const accountType = CTRADER_ACCOUNT_TYPES.find(
        (type) => type.name === account.account_type
      );
      if (!accountType) {
        return { valid: false, error: "Account type not found" };
      }
      if (accountType.minDeposit > usdAmount) {
        return {
          valid: false,
          error: `Minimum deposit amount is $${accountType.minDeposit} for ${accountType.name} accounts`,
        };
      }
      return { valid: true };
    },
  },
};

export default praxisService;
