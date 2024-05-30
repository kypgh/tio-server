import mongoose from "mongoose";
const { Schema } = mongoose;

const UserTransactionsDailyStatsSchema = new Schema(
  {
    brand: { type: String, required: true },
    date: { type: Date, required: true },
    date_id: { type: String, required: true },
    total_deposits: { type: Number, required: true },
    total_deposits_amount: {
      type: mongoose.Types.Decimal128,
      required: true,
      get: (v) => v?.toString(),
    },
    total_withdrawals: { type: Number, required: true },
    total_withdrawals_amount: {
      type: mongoose.Types.Decimal128,
      required: true,
      get: (v) => v?.toString(),
    },
    allowed_countries: { type: [String], default: () => [] },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

export default mongoose.model(
  "UserTransactionsDailyStats",
  UserTransactionsDailyStatsSchema
);
