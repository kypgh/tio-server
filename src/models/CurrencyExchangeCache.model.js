import mongoose from "mongoose";
import { CURRENCIES } from "../config/currencies";
const { Schema } = mongoose;

const CurrencyExchangeCacheSchema = new Schema(
  {
    base_currency: { type: String, enum: CURRENCIES, required: true },
    exchange_rates: { type: Object, required: true },
  },
  { timestamps: true }
);

export default mongoose.model(
  "CurrencyExchangeCache",
  CurrencyExchangeCacheSchema
);
