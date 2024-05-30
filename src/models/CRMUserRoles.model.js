import mongoose from "mongoose";
import { TIO_BRANDS } from "../config/enums";
const { Schema } = mongoose;

const CRMUserRoles = new Schema(
  {
    brand: { type: String, required: true, enum: Object.values(TIO_BRANDS) },
    name: { type: String, required: true },
    permissions: { type: [String], default: () => [] },
  },
  {
    timestamps: true,
  }
);

// CRMUserRoles.index({ name: 1 }, { unique: true });

export default mongoose.model("CRMUserRoles", CRMUserRoles);
