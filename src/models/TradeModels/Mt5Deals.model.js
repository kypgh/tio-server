import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { TRADE_SERVERS } from "../../config/enums";

const Mt5DealsSchema = new mongoose.Schema(
  {
    // Our own fields
    account: { type: mongoose.Types.ObjectId, ref: "UserAccounts" },
    environment_type: { type: String, required: true },
    server: {
      type: String,
      enum: Object.values(TRADE_SERVERS),
      required: true,
    },
    archived: { type: Boolean, default: false },
    // Mt5 fields
    dealId: Number,
    action: String, // EnDealAction
    comment: String,
    commission: Number,
    contractSize: Number,
    dealer: Number,
    digits: Number,
    digitsCurrency: Number,
    entry: String, // EnEntryFlag
    expertId: Number,
    externalId: String,
    fee: Number,
    flags: Number,
    gateway: String,
    login: Number,
    marketAsk: Number,
    marketBid: Number,
    marketLast: Number,
    modificationFlags: String, // EnTradeModifyFlags
    obsoleteValue: Number,
    orderId: Number,
    positionId: Number,
    price: Number,
    priceGateway: Number,
    pricePosition: Number,
    priceSL: Number,
    priceTP: Number,
    print: String,
    profit: Number,
    profitRaw: Number,
    rateMargin: Number,
    rateProfit: Number,
    reason: String, // EnDealReason
    storage: Number,
    symbol: String,
    tickSize: Number,
    tickValue: Number,
    time: Number,
    timeMsc: Number,
    value: Number,
    volume: Number,
    volumeClosed: Number,
    volumeClosedExt: Number,
    volumeExt: Number,
  },
  { timestamps: true }
);

Mt5DealsSchema.plugin(paginate);
Mt5DealsSchema.plugin(aggregatePaginate);

export default mongoose.models.Mt5Deals ||
  mongoose.model("Mt5Deals", Mt5DealsSchema);
