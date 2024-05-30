import mongoose from "mongoose";
import "./Users.model";
const { Schema } = mongoose;

// This token is used by ctrader to verify the user for long term access
const AccessToken = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    token: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// AccessToken.index({ token: 1 }, { unique: true });

export default mongoose.model("AccessTokens", AccessToken);
