import mongoose from "mongoose";
import "./Users.model";
const { Schema } = mongoose;

// This token is used for our own purposes on logging in users
const UserTokenSchema = new Schema(
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

export default mongoose.model("UserTokens", UserTokenSchema);
