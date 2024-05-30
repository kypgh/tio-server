import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const CtraderPositionsSchema = new mongoose.Schema(
  {
    // Our fields
    user: { type: mongoose.Types.ObjectId, ref: "Users" },
    account: { type: mongoose.Types.ObjectId, ref: "UserAccounts" },
    // Ctrader fields
    positionId: String,
    positionStatus: String,
    swap: String,
    price: Number,
    stopLoss: Number,
    takeProfit: Number,
    utcLastUpdateTimestamp: String,
    bookType: String,
    commission: String,
    marginRate: Number,
    introducingBrokerCommission: String,
    pocketCommission: String,
    pocketMarkup: String,
    mirroringCommission: String,
    guaranteedStopLoss: Boolean,
    usedMargin: String,
    trailingStopLoss: Boolean,
    stopLossTriggerMethod: String,
    moneyDigits: Number,
    pnlConversionFeeRate: Number,
    environment_type: String,
    tradeData: {
      symbolId: String,
      volume: String,
      tradeSide: String,
      traderId: String,
      openTimestamp: String,
      closeTimestamp: String,
      label: String,
      comment: String,
      channel: String,
      measurementUnits: String,
      lotSize: String,
      spreadBetting: Boolean,
      stake: String,
      desiredVWAP: Number,
      guaranteedStopLoss: Boolean,
    },
  },
  { timestamps: true }
);

CtraderPositionsSchema.plugin(paginate);
CtraderPositionsSchema.plugin(aggregatePaginate);

export default mongoose.models.CtraderPositions ||
  mongoose.model("CtraderPositions", CtraderPositionsSchema);

export const CTRADER_POSITIONS_FIELDS = {
  userId: { value: "user", label: "User ID" },
  accountId: { value: "account", label: "Account ID" },
  positionId: { value: "positionId", label: "Position ID" },
  positionStatus: { value: "positionStatus", label: "Position Status" },
  swap: { value: "swap", label: "Swap" },
  price: { value: "price", label: "Price" },
  stopLoss: { value: "stopLoss", label: "Stop Loss" },
  takeProfit: { value: "takeProfit", label: "Take Profit" },
  utcLastUpdateTimestamp: {
    value: "utcLastUpdateTimestamp",
    label: "Last Update Timestamp",
  },
  bookType: { value: "bookType", label: "Book Type" },
  commission: { value: "commission", label: "Commission" },
  marginRate: { value: "marginRate", label: "Margin Rate" },
  introducingBrokerCommission: {
    value: "introducingBrokerCommission",
    label: "Introducing Broker Commission",
  },
  pocketCommission: { value: "pocketCommission", label: "Pocket Commission" },
  pocketMarkup: { value: "pocketMarkup", label: "Pocket Markup" },
  mirroringCommission: {
    value: "mirroringCommission",
    label: "Mirroring Commission",
  },
  guaranteedStopLoss: {
    value: "guaranteedStopLoss",
    label: "Guaranteed Stop Loss",
  },
  usedMargin: { value: "usedMargin", label: "Used Margin" },
  trailingStopLoss: { value: "trailingStopLoss", label: "Trailing Stop Loss" },
  stopLossTriggerMethod: {
    value: "stopLossTriggerMethod",
    label: "Stop Loss Trigger Method",
  },
  moneyDigits: { value: "moneyDigits", label: "Money Digits" },
  pnlConversionFeeRate: {
    value: "pnlConversionFeeRate",
    label: "Pnl Conversion Fee Rate",
  },
  symbolId: { value: "tradeData.symbolId", label: "Symbol ID" },
  volume: { value: "tradeData.volume", label: "Volume" },
  tradeSide: { value: "tradeData.tradeSide", label: "Trade Side" },
  traderId: { value: "tradeData.traderId", label: "Trader ID" },
  openTimestamp: { value: "tradeData.openTimestamp", label: "Open Timestamp" },
  closeTimestamp: {
    value: "tradeData.closeTimestamp",
    label: "Close Timestamp",
  },
  label: { value: "tradeData.label", label: "Label" },
  comment: { value: "tradeData.comment", label: "Comment" },
  channel: { value: "tradeData.channel", label: "Channel" },
  measurementUnits: {
    value: "tradeData.measurementUnits",
    label: "Measurement Units",
  },
  lotSize: { value: "tradeData.lotSize", label: "Lot Size" },
  spreadBetting: { value: "tradeData.spreadBetting", label: "Spread Betting" },
  stake: { value: "tradeData.stake", label: "Stake" },
  desiredVWAP: { value: "tradeData.desiredVWAP", label: "Desired VWAP" },
  guaranteedStopLoss: {
    value: "tradeData.guaranteedStopLoss",
    label: "Guaranteed Stop Loss",
  },
  createdAt: { value: "createdAt", label: "Created At" },
  updatedAt: { value: "updatedAt", label: "Updated At" },
};
