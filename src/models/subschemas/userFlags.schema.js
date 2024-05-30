import mongoose from "mongoose";
import { USER_KYC_STATUS } from "../../config/enums";
const { Schema } = mongoose;

const usersFlagsSchema = new Schema({
  hasDocuments: { type: Boolean, default: false },
  clientApproved: { type: Boolean, default: false },
  kycApproved: { type: Boolean, default: false },
  kycStatus: {
    type: String,
    default: USER_KYC_STATUS.missingDocuments,
    enum: Object.values(USER_KYC_STATUS),
  },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  detailsVerified: { type: Boolean, default: false },
  receiveDailyEmails: { type: Boolean, default: true },
  shariaEnabled: { type: Boolean, default: false },
});

export default usersFlagsSchema;
