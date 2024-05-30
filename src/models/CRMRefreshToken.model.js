import mongoose from "mongoose";
import "./CRMUsers.model";
const { Schema } = mongoose;

// This token is for our crm users to refresh their JWT tokens
const CRMRefreshTokenSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CRMUsers",
      required: true,
    },
    token: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// CRMRefreshTokenSchema.index({ token: 1 }, { unique: true });

export default mongoose.model("CRMRefreshTokens", CRMRefreshTokenSchema);
