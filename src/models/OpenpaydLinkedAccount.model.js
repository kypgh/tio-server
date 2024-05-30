import mongoose from "mongoose";
import "./UserAccounts.model";

const { Schema } = mongoose;

const OpenpaydLinkedAccountSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    accountId: {
      type: mongoose.Types.ObjectId,
      ref: "useraccounts",
      required: true,
    },
    linkedClientId: {
      type: String,
      required: true,
    },
    openpaydAccountId: { type: String, required: true },
    accountHolderId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model(
  "OpenpaydLinkedAccount",
  OpenpaydLinkedAccountSchema
);
