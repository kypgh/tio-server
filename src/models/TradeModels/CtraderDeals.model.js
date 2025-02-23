import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const CtraderDealsSchema = new mongoose.Schema(
  {
    // Our own fields
    user: { type: mongoose.Types.ObjectId, ref: "Users" },
    account: { type: mongoose.Types.ObjectId, ref: "UserAccounts" },
    order: { type: mongoose.Types.ObjectId, ref: "CtraderOrders" },
    position: { type: mongoose.Types.ObjectId, ref: "CtraderPositions" },
    environment_type: String,
    // Ctrader fields
    dealId: String,
    orderId: String,
    positionId: String,
    traderId: String,
    feedId: String,
    serverOrderId: String,
    volume: Number,
    filledVolume: Number,
    symbolId: String,
    createTimestamp: Date,
    executionTimestamp: Date,
    utcLastUpdateTimestamp: Date,
    executionPrice: Number,
    limitPrice: Number,
    tradeSide: String,
    dealStatus: String,
    dealType: String,
    marginRate: Number,
    commission: Number,
    clientRequestId: String,
    bookType: String,
    lpExecutionPrice: Number,
    lpOrderId: String,
    label: String,
    channel: String,
    priceSnapshotId: String,
    baseToUsdConversionRate: Number,
    introducingBrokerCommission: String,
    pocketCommission: String,
    pocketMarkup: String,
    introducedByBrokerId: String,
    mirroringCommission: String,
    measurementUnits: String,
    lotSize: String,
    markup: String,
    innerMirroringFee: Boolean,
    totalVolumeInUsd: String,
    spreadBetting: Boolean,
    stake: String,
    desiredVWAP: Number,
    marketVWAP: Number,
    tolerance: Number,
    rejectReason: String,
    manual: Boolean,
    filledEurVolume: String,
    filledGbpVolume: String,
    equity: String,
    moneyDigits: Number,
    closePositionDetail: {
      entryPrice: Number,
      profit: String,
      swap: String,
      commission: String,
      balance: String,
      comment: String,
      stopLoss: Number,
      takeProfit: Number,
      quoteToDepositConversionRate: Number,
      closedVolume: String,
      balanceVersion: String,
      introducingBrokerCommission: String,
      pocketCommission: String,
      pocketMarkup: String,
      equity: String,
      netProfit: String,
      mirroringCommission: String,
      depositToIbDepositRate: Number,
      minEquity: String,
      maxEquity: String,
      rebate: String,
      balanceHistoryId: String,
      markup: String,
      equityBasedRoi: Number,
      closedStake: String,
      ibCommissionsPaid: Boolean,
      nonWithdrawableBonus: String,
      stopLossTriggerMethod: String,
      offsetDealTimestamp: String,
      moneyDigits: Number,
      pnlConversionFee: String,
    },
  },
  { timestamps: true }
);

CtraderDealsSchema.plugin(paginate);
CtraderDealsSchema.plugin(aggregatePaginate);

export default mongoose.model("CtraderDeals", CtraderDealsSchema);

export const CTRADER_DEALS_FIELDS = {
  userId: { value: "user", label: "User" },
  accountId: { value: "account", label: "Account" },
  order: { value: "order", label: "Order" },
  position: { value: "position", label: "Position" },
  dealId: { value: "dealId", label: "Deal ID" },
  orderId: { value: "orderId", label: "Order ID" },
  positionId: { value: "positionId", label: "Position ID" },
  traderId: { value: "traderId", label: "Trader ID" },
  feedId: { value: "feedId", label: "Feed ID" },
  serverOrderId: { value: "serverOrderId", label: "Server Order ID" },
  volume: { value: "volume", label: "Volume" },
  filledVolume: { value: "filledVolume", label: "Filled Volume" },
  symbolId: { value: "symbolId", label: "Symbol ID" },
  createTimestamp: { value: "createTimestamp", label: "Create Timestamp" },
  executionTimestamp: {
    value: "executionTimestamp",
    label: "Execution Timestamp",
  },
  utcLastUpdateTimestamp: {
    value: "utcLastUpdateTimestamp",
    label: "UTC Last Update Timestamp",
  },
  executionPrice: { value: "executionPrice", label: "Execution Price" },
  limitPrice: { value: "limitPrice", label: "Limit Price" },
  tradeSide: { value: "tradeSide", label: "Trade Side" },
  dealStatus: { value: "dealStatus", label: "Deal Status" },
  dealType: { value: "dealType", label: "Deal Type" },
  marginRate: { value: "marginRate", label: "Margin Rate" },
  commission: { value: "commission", label: "Commission" },
  clientRequestId: { value: "clientRequestId", label: "Client Request ID" },
  bookType: { value: "bookType", label: "Book Type" },
  lpExecutionPrice: { value: "lpExecutionPrice", label: "LP Execution Price" },
  lpOrderId: { value: "lpOrderId", label: "LP Order ID" },
  label: { value: "label", label: "Label" },
  channel: { value: "channel", label: "Channel" },
  priceSnapshotId: { value: "priceSnapshotId", label: "Price Snapshot ID" },
  baseToUsdConversionRate: {
    value: "baseToUsdConversionRate",
    label: "Base To USD Conversion Rate",
  },
  introducingBrokerCommission: {
    value: "introducingBrokerCommission",
    label: "Introducing Broker Commission",
  },
  pocketCommission: { value: "pocketCommission", label: "Pocket Commission" },
  pocketMarkup: { value: "pocketMarkup", label: "Pocket Markup" },
  introducedByBrokerId: {
    value: "introducedByBrokerId",
    label: "Introduced By Broker ID",
  },
  mirroringCommission: {
    value: "mirroringCommission",
    label: "Mirroring Commission",
  },
  measurementUnits: { value: "measurementUnits", label: "Measurement Units" },
  lotSize: { value: "lotSize", label: "Lot Size" },
  markup: { value: "markup", label: "Markup" },
  innerMirroringFee: {
    value: "innerMirroringFee",
    label: "Inner Mirroring Fee",
  },
  totalVolumeInUsd: { value: "totalVolumeInUsd", label: "Total Volume In USD" },
  spreadBetting: { value: "spreadBetting", label: "Spread Betting" },
  stake: { value: "stake", label: "Stake" },
  desiredVWAP: { value: "desiredVWAP", label: "Desired VWAP" },
  marketVWAP: { value: "marketVWAP", label: "Market VWAP" },
  tolerance: { value: "tolerance", label: "Tolerance" },
  rejectReason: { value: "rejectReason", label: "Reject Reason" },
  manual: { value: "manual", label: "Manual" },
  filledEurVolume: { value: "filledEurVolume", label: "Filled EUR Volume" },
  filledGbpVolume: { value: "filledGbpVolume", label: "Filled GBP Volume" },
  equity: { value: "equity", label: "Equity" },
  moneyDigits: { value: "moneyDigits", label: "Money Digits" },
  "closePositionDetail.entryPrice": {
    value: "closePositionDetail.entryPrice",
    label: "Entry Price",
  },
  "closePositionDetail.profit": {
    value: "closePositionDetail.profit",
    label: "Profit",
  },
  "closePositionDetail.swap": {
    value: "closePositionDetail.swap",
    label: "Swap",
  },
  "closePositionDetail.commission": {
    value: "closePositionDetail.commission",
    label: "Commission",
  },
  "closePositionDetail.balance": {
    value: "closePositionDetail.balance",
    label: "Balance",
  },
  "closePositionDetail.comment": {
    value: "closePositionDetail.comment",
    label: "Comment",
  },
  "closePositionDetail.stopLoss": {
    value: "closePositionDetail.stopLoss",
    label: "Stop Loss",
  },
  "closePositionDetail.takeProfit": {
    value: "closePositionDetail.takeProfit",
    label: "Take Profit",
  },
  "closePositionDetail.quoteToDepositConversionRate": {
    value: "closePositionDetail.quoteToDepositConversionRate",
    label: "Quote To Deposit Conversion Rate",
  },
  "closePositionDetail.closedVolume": {
    value: "closePositionDetail.closedVolume",
    label: "Closed Volume",
  },
  "closePositionDetail.balanceVersion": {
    value: "closePositionDetail.balanceVersion",
    label: "Balance Version",
  },
  "closePositionDetail.introducingBrokerCommission": {
    value: "closePositionDetail.introducingBrokerCommission",
    label: "Introducing Broker Commission",
  },
  "closePositionDetail.pocketCommission": {
    value: "closePositionDetail.pocketCommission",
    label: "Pocket Commission",
  },
  "closePositionDetail.pocketMarkup": {
    value: "closePositionDetail.pocketMarkup",
    label: "Pocket Markup",
  },
  "closePositionDetail.equity": {
    value: "closePositionDetail.equity",
    label: "Equity",
  },
  "closePositionDetail.netProfit": {
    value: "closePositionDetail.netProfit",
    label: "Net Profit",
  },
  "closePositionDetail.mirroringCommission": {
    value: "closePositionDetail.mirroringCommission",
    label: "Mirroring Commission",
  },
  "closePositionDetail.depositToIbDepositRate": {
    value: "closePositionDetail.depositToIbDepositRate",
    label: "Deposit To IB Deposit Rate",
  },
  "closePositionDetail.minEquity": {
    value: "closePositionDetail.minEquity",
    label: "Min Equity",
  },
  "closePositionDetail.maxEquity": {
    value: "closePositionDetail.maxEquity",
    label: "Max Equity",
  },
  "closePositionDetail.rebate": {
    value: "closePositionDetail.rebate",
    label: "Rebate",
  },
  "closePositionDetail.balanceHistoryId": {
    value: "closePositionDetail.balanceHistoryId",
    label: "Balance History ID",
  },
  "closePositionDetail.markup": {
    value: "closePositionDetail.markup",
    label: "Markup",
  },
  "closePositionDetail.equityBasedRoi": {
    value: "closePositionDetail.equityBasedRoi",
    label: "Equity Based ROI",
  },
  "closePositionDetail.closedStake": {
    value: "closePositionDetail.closedStake",
    label: "Closed Stake",
  },
  "closePositionDetail.ibCommissionsPaid": {
    value: "closePositionDetail.ibCommissionsPaid",
    label: "IB Commissions Paid",
  },
  "closePositionDetail.nonWithdrawableBonus": {
    value: "closePositionDetail.nonWithdrawableBonus",
    label: "Non Withdrawable Bonus",
  },
  "closePositionDetail.stopLossTriggerMethod": {
    value: "closePositionDetail.stopLossTriggerMethod",
    label: "Stop Loss Trigger Method",
  },
  "closePositionDetail.offsetDealTimestamp": {
    value: "closePositionDetail.offsetDealTimestamp",
    label: "Offset Deal Timestamp",
  },
  "closePositionDetail.moneyDigits": {
    value: "closePositionDetail.moneyDigits",
    label: "Money Digits",
  },
  "closePositionDetail.pnlConversionFee": {
    value: "closePositionDetail.pnlConversionFee",
    label: "PnL Conversion Fee",
  },
  createdAt: { value: "createdAt", label: "Created At" },
  updatedAt: { value: "updatedAt", label: "Updated At" },
};
