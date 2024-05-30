import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { TRADE_SERVERS } from "../../config/enums";

const Mt5PositionsSchema = new mongoose.Schema(
  {
    // Our fields
    account: { type: mongoose.Types.ObjectId, ref: "UserAccounts" },
    environment_type: { type: String, required: true },
    server: {
      type: String,
      enum: Object.values(TRADE_SERVERS),
      required: true,
    },
    archived: { type: Boolean, default: false },
    // MT5 fields
    positionId: Number,
    action: String, //EnPositionAction,
    activationFlags: String, //EnTradeActivationFlags,
    activationMode: String, //EnActivation,
    activationPrice: Number,
    activationTime: Number,
    comment: String,
    contractSize: Number,
    dealer: Number,
    digits: Number,
    digitsCurrency: Number,
    expertID: Number,
    expertPositionID: Number,
    externalID: String,
    login: Number,
    modificationFlags: String, //EnTradeModifyFlags,
    obsoleteValue: Number,
    priceCurrent: Number,
    priceOpen: Number,
    priceSL: Number,
    priceTP: Number,
    profit: Number,
    rateMargin: Number,
    rateProfit: Number,
    reason: String, //EnPositionReason,
    storage: Number,
    symbol: String,
    timeCreate: Number,
    timeCreateMsc: Number,
    timeUpdate: Number,
    timeUpdateMsc: Number,
    volume: Number,
    volumeExt: Number,
  },
  { timestamps: true }
);

Mt5PositionsSchema.plugin(paginate);
Mt5PositionsSchema.plugin(aggregatePaginate);

export default mongoose.models.Mt5Positions ||
  mongoose.model("Mt5Positions", Mt5PositionsSchema);
