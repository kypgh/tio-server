import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { TRADE_SERVERS } from "../../config/enums";

const Mt5OrdersSchema = new mongoose.Schema(
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
    // Mt5 fields
    orderId: Number,
    activationFlags: String, //EnTradeActivationFlags,
    activationMode: String, //EnOrderActivation,
    activationPrice: Number,
    activationTime: Number,
    comment: String,
    contractSize: Number,
    dealer: Number,
    digits: Number,
    digitsCurrency: Number,
    expertId: Number,
    externalId: String,
    login: Number,
    modificationFlags: String, //EnTradeModifyFlags,
    positionById: Number,
    positionId: Number,
    priceCurrent: Number,
    priceOrder: Number,
    priceSL: Number,
    priceTP: Number,
    priceTrigger: Number,
    print: String,
    rateMargin: Number,
    reason: String, //EnOrderReason,
    state: String, //EnOrderState,
    symbol: String,
    timeDone: Number,
    timeDoneMsc: Number,
    timeExpiration: Number,
    timeSetup: Number,
    timeSetupMsc: Number,
    type: String, //EnOrderType,
    typeFill: String, //EnOrderFilling,
    typeTime: String, //EnOrderTime,
    volumeCurrent: Number,
    volumeCurrentExt: Number,
    volumeInitial: Number,
    volumeInitialExt: Number,
  },
  { timestamps: true }
);

Mt5OrdersSchema.plugin(paginate);
Mt5OrdersSchema.plugin(aggregatePaginate);

export default mongoose.models.Mt5Orders ||
  mongoose.model("Mt5Orders", Mt5OrdersSchema);
