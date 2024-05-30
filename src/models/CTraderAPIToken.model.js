import mongoose from "mongoose";
const { Schema } = mongoose;

// Reset password token (for forgot password used throught phone)
const CTraderAPIToken = new Schema(
  {
    name: { type: String, required: true },
    token: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// CTraderAPIToken.index({ name: 1 }, { unique: true });

export default mongoose.model("CtraderApiToken", CTraderAPIToken);
