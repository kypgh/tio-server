import mongoose from "mongoose";
import "./Users.model";
const { Schema } = mongoose;

// This token is used by ctrader to verify the user
// (One time token) deleted after use
const OTtoken = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    token: { type: String, required: true },
    expiresIn: { type: Date, required: true },
    keep_logged_in: { type: Boolean, default: () => false },
  },
  {
    timestamps: true,
  }
);

// OTtoken.index({ token: 1 }, { unique: true });

export default mongoose.model("OTtokens", OTtoken);
