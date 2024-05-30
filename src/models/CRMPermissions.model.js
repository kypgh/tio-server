import mongoose from "mongoose";
import { CRM_USER_DEPARTMENTS } from "../config/enums";
import "./CRMUserRoles.model";
import "./CRMUsers.model";
const { Schema } = mongoose;

const CRMPermissionsSchema = new Schema(
  {
    crmuserId: {
      type: mongoose.Types.ObjectId,
      ref: "CRMUsers",
      required: true,
    },
    brand: { type: String, required: true },
    department: { type: String, enum: Object.values(CRM_USER_DEPARTMENTS) },
    role: {
      type: mongoose.Types.ObjectId,
      ref: "CRMUserRoles",
      required: true,
    },
    permissions: { type: [String], default: () => [] },
    suspended: { type: Boolean, default: false },
    sales_rotation_countries: { type: [String], default: () => [] },
    enable_country_whitelist: { type: Boolean, default: false },
    whitelist_countries: { type: [String], default: () => [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CRMPermissions", CRMPermissionsSchema);
