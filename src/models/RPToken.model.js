import mongoose from "mongoose";
import "./Users.model";
const { Schema } = mongoose;

// Reset password token (for forgot password used throught phone)
const RPTokenSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    token: { type: String, required: true },
    expiresIn: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// RPTokenSchema.index({ token: 1 }, { unique: true });

export default mongoose.model("ResetPasswordTokens", RPTokenSchema);
