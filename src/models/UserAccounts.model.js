import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { CTRADER_ACCOUNT_TYPES } from "../config/accountTypes";
import { CURRENCIES } from "../config/currencies";
import { ACCOUNT_STATUS, TIO_PLATFORMS, TRADE_SERVERS } from "../config/enums";

import "./Users.model";
const { Schema } = mongoose;

export const ACCOUNT_PROVIDER = Object.freeze({
  pending: "pending",
  TIO: "tio",
  INNOVOULT: "innovoult",
});

const UserAccountsSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    login_id: { type: String, required: true },
    trader_id: { type: String },
    linking_id: { type: String },
    platform: { type: String, enum: Object.values(TIO_PLATFORMS) },
    server: { type: String, enum: Object.values(TRADE_SERVERS) },
    account_type: { type: String },
    group: { type: String },
    leverage: { type: Number },
    currency: { type: String, enum: CURRENCIES },
    environment_type: { type: String, enum: ["live", "demo"] },
    first_account: { type: Boolean, default: false },
    openpaydHolderId: { type: String },
    provider: {
      type: String,
      enum: Object.values(ACCOUNT_PROVIDER),
    },
    permissions: {
      type: [String],
      default: [],
    },
    innovoultWalletId: { type: String },
    balance: {
      type: mongoose.Types.Decimal128,
      default: 0,
      get: (v) => v?.toString(),
    },
    bonus_balance: {
      type: mongoose.Types.Decimal128,
      default: 0,
      get: (v) => v?.toString(),
    },
    equity: {
      type: mongoose.Types.Decimal128,
      default: 0,
      get: (v) => v?.toString(),
    },
    used_margin: {
      type: mongoose.Types.Decimal128,
      default: 0,
      get: (v) => v?.toString(),
    },
    free_margin: {
      type: mongoose.Types.Decimal128,
      default: 0,
      get: (v) => v?.toString(),
    },
    total_withdrawals: {
      type: mongoose.Types.Decimal128,
      default: 0,
      get: (v) => v?.toString(),
    },
    total_withdrawals_usd: {
      type: mongoose.Types.Decimal128,
      default: 0,
      get: (v) => v?.toString(),
    },
    total_deposits: {
      type: mongoose.Types.Decimal128,
      default: 0,
      get: (v) => v?.toString(),
    },
    total_deposits_usd: {
      type: mongoose.Types.Decimal128,
      default: 0,
      get: (v) => v?.toString(),
    },
    withdrawal_hold: {
      type: mongoose.Types.Decimal128,
      default: 0,
      get: (v) => v?.toString(),
    },
    deposits_by_method: Object,
    withdrawals_by_method: Object,
    crypto_deposit_address: String,
    status: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
    },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { getters: true } }
);

UserAccountsSchema.plugin(paginate);

export default mongoose.model("UserAccounts", UserAccountsSchema);

export const USER_ACCOUNTS_FIELD = {
  accountId: { value: "_id", label: "Account ID" },
  userId: { value: "user", label: "User ID" },
  loginId: { value: "login_id", label: "Login ID" },
  traderId: { value: "trader_id", label: "Trader ID" },
  accountType: { value: "account_type", label: "Account Type" },
  leverage: { value: "leverage", label: "Leverage" },
  currency: { value: "currency", label: "Currency" },
  environment_type: { value: "environment_type", label: "Environment Type" },
  first_account: { value: "first_account", label: "First Account" },
  balance: { value: "balance", label: "Balance" },
  usedMargin: { value: "used_margin", label: "Used Margin" },
  totalWithdrawals: { value: "total_withdrawals", label: "Total Withdrawals" },
  totalDeposits: { value: "total_deposits", label: "Total Deposits" },
  withdrawalHold: { value: "withdrawal_hold", label: "Withdrawal Hold" },
};
