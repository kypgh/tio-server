import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { countryDataCodes } from "../config/countries";
import {
  PRAXIS_SESSION_INTENTS,
  PRAXIS_SESSION_STATUS,
  PRAXIS_TRANSACTION_STATUS,
  PRAXIS_TRANSACTION_TYPE,
  USER_TRANSACTION_TYPES,
} from "../config/enums";
import "./UserAccounts.model";
import "./Users.model";
const { Schema } = mongoose;

const UserTransactionsSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    userAccount: {
      type: mongoose.Types.ObjectId,
      ref: "UserAccounts",
      required: true,
    },
    transaction_type: {
      type: String,
      enum: Object.values(USER_TRANSACTION_TYPES),
      required: true,
    },
    auth_token: String,
    intent: { type: String, enum: Object.values(PRAXIS_SESSION_INTENTS) },
    session_status: {
      type: String,
      enum: Object.values(PRAXIS_SESSION_STATUS),
    },
    praxis_transaction_type: {
      type: String,
      enum: Object.values(PRAXIS_TRANSACTION_TYPE),
    },
    transaction_status: {
      type: String,
      enum: Object.values(PRAXIS_TRANSACTION_STATUS),
    },
    tid: Number,
    transaction_id: String,
    platform_id: String,
    currency: String,
    amount: { type: mongoose.Types.Decimal128, get: (v) => v?.toString() },
    conversion_rate: Number,
    processed_currency: String,
    processed_amount: {
      type: mongoose.Types.Decimal128,
      get: (v) => v?.toString(),
    },
    processed_usd_conversion_rate: Number,
    processed_usd_amount: {
      type: mongoose.Types.Decimal128,
      get: (v) => v?.toString(),
    },
    fee: Number,
    fee_included: Number,
    fee_type: String,
    payment_method: String,
    payment_processor: String,
    gateway: String,
    card: {
      card_token: String,
      card_type: String,
      card_number: String,
      card_exp: String,
      card_issuer_name: String,
      card_issues_country: String,
    },
    wallet: {
      wallet_token: String,
      account_identifier: String,
      data: Object,
    },
    is_async: Boolean,
    is_cascade: Boolean,
    cascade_level: Number,
    refrence_id: Number,
    withdrawal_request_id: Number,
    created_by: String,
    edited_by: String,
    status_code: String,
    status_details: String,
    timestamp: Date,
    variable1: String,
    variable2: String,
    variable3: String,
    refund_amount: {
      type: mongoose.Types.Decimal128,
      default: mongoose.Types.Decimal128("0"),
    },
    customer: {
      customer_token: String,
      country: { type: String, enum: countryDataCodes.map((el) => el.iso2) },
      avs_alert: Number,
      verification_alert: Number,
    },
    // BitGo
    bitgoCoin: String,
    bitgoWalletId: String,
    bitgoTransferId: String,
    bitgoAddressId: String,
    // Transfers
    transferAccount: {
      type: mongoose.Types.ObjectId,
      ref: "UserAccounts",
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

UserTransactionsSchema.plugin(paginate);
UserTransactionsSchema.plugin(aggregatePaginate);

export default mongoose.model("UserTransactions", UserTransactionsSchema);

export const USERS_TRANSACTIONS_FIELDS = {
  readableId: { value: "userReadableId", label: "User ID" },
  transactionId: { value: "_id", label: "Transaction ID" },
  userId: { value: "user", label: "User ID" },
  accountId: { value: "userAccount", label: "User Account" },
  transactionType: { value: "transaction_type", label: "Transaction Type" },
  intent: { value: "intent", label: "Intent" },
  sessionStatus: { value: "session_status", label: "Session Status" },
  praxisTransactionType: {
    value: "praxis_transaction_type",
    label: "Praxis Transaction Type",
  },
  transactionStatus: {
    value: "transaction_status",
    label: "Transaction Status",
  },
  tid: { value: "tid", label: "TID" },
  praxisTransactionId: {
    value: "transaction_id",
    label: "Praxis Transaction Id",
  },
  currency: { value: "currency", label: "Currency" },
  amount: { value: "amount", label: "Amount" },
  conversionRate: { value: "conversion_rate", label: "Conversion Rate" },
  processedCurrency: {
    value: "processed_currency",
    label: "Processed Currency",
  },
  processedAmount: { value: "processed_amount", label: "Processed Amount" },
  processedUsdConversionRate: {
    value: "processed_usd_conversion_rate",
    label: "Processed USD Conversion Rate",
  },
  processedUsdAmount: {
    value: "processed_usd_amount",
    label: "Processed USD Amount",
  },
  fee: { value: "fee", label: "Fee" },
  paymentMethod: { value: "payment_method", label: "Payment Method" },
  paymentProcessor: { value: "payment_processor", label: "Payment Processor" },
  gateway: { value: "gateway", label: "Gateway" },
};
