import mongoose from "mongoose";
import "./UserAccounts.model";
const { Schema } = mongoose;

const BitgoWalletAddressSchema = new Schema(
  {
    accountId: {
      type: mongoose.Types.ObjectId,
      ref: "UserAccounts",
      required: true,
    },
    walletId: {
      type: String,
      required: true,
    },
    addressId: {
      type: String,
      required: true,
    },
    coin: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BitgoWalletAddress", BitgoWalletAddressSchema);
