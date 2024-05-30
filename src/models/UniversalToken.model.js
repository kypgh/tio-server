import mongoose from "mongoose";
import "./Users.model";
const { Schema } = mongoose;

export const UNIVERSAL_TOKEN_TYPE = Object.freeze({
  accessToken: "accessToken",
  resetPasswordToken: "resetPasswordToken",
  verifyEmailToken: "verifyEmailToken",
});

export const UNIVERSAL_TOKEN_LENGTH = 64;

// This token is used by ctrader to verify the user
// (One time token) deleted after use
const UniversalToken = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    token_type: {
      type: String,
      enum: Object.values(UNIVERSAL_TOKEN_TYPE),
      required: true,
    },
    token: { type: String, required: true },
    expiresIn: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// UniversalToken.index({ token: 1, token_type: 1 }, { unique: true });

export default mongoose.model("UniversalToken", UniversalToken);
