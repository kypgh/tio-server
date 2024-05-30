import mongoose from "mongoose";
import bcrypt from "bcrypt";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import usersFlagsSchema from "./subschemas/userFlags.schema";
import {
  LANGUAGE_CODES,
  TIO_BRANDS,
  TIO_ENTITIES,
  USER_EPC_STATUS,
} from "../config/enums";
import longModifier from "mongoose-long";
longModifier(mongoose);

import "./CRMUsers.model";
import "./UserTransactions.model";
const { Schema } = mongoose;

const UsersSchema = new Schema(
  {
    readableId: mongoose.Types.Long,
    email: String,
    secondaryEmail: String,
    password: String,
    entity: { type: String, enum: Object.values(TIO_ENTITIES), required: true },
    brand: { type: String, enum: Object.values(TIO_BRANDS), required: true },
    ctrader_password: String,
    ctrader_id: String,
    mt5_id: String,
    phone: String,
    first_name: String,
    last_name: String,
    country: String,
    city: String,
    title: String,
    gender: String,
    address: String,
    postcode: String,
    houseNumber: String,
    unitNumber: String,
    nationality: String,
    identificationNumber: String,
    terms: Boolean,
    last_login: { type: Date, default: Date.now },
    metadata: Object,
    innoVoultID: String,
    dob: Date,
    epc_status: {
      type: String,
      enum: Object.values(USER_EPC_STATUS),
      default: USER_EPC_STATUS.notApplied,
    },
    language: {
      type: String,
      enum: Object.values(LANGUAGE_CODES),
      default: "en",
    },
    sales_agent: { type: mongoose.Types.ObjectId, ref: "CRMUsers" },
    active_ribbon: String,
    ib: {
      id: String,
      cmp: String,
      refId: String,
      isValidRef: Boolean,
    },
    first_time_deposit: {
      date_at: Date,
      amount: { type: mongoose.Types.Decimal128, get: (v) => v?.toString() },
      transaction: { type: mongoose.Types.ObjectId, ref: "UserTransactions" },
    },
    first_time_withdrawal: {
      date_at: Date,
      amount: { type: mongoose.Types.Decimal128, get: (v) => v?.toString() },
      transaction: { type: mongoose.Types.ObjectId, ref: "UserTransactions" },
    },
    first_time_trade: {
      date_at: Date,
      amount: { type: mongoose.Types.Decimal128, get: (v) => v?.toString() },
      deal: { type: mongoose.Types.ObjectId },
    },
    isSuspended: { type: Boolean, default: false },
    flags: {
      type: usersFlagsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
      },
    },
  }
);

// UsersSchema.index({ email: 1, entity: 1 }, { unique: true });
UsersSchema.plugin(paginate);
UsersSchema.plugin(aggregatePaginate);

UsersSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model("Users", UsersSchema);

export const USERS_FIELDS = {
  userId: { value: "_id", label: "User ID" },
  email: { value: "email", label: "Email" },
  cid: { value: "ctrader_id", label: "CTrader ID" },
  phone: { value: "phone", label: "Phone" },
  firstName: { value: "first_name", label: "First Name" },
  lastName: { value: "last_name", label: "Last Name" },
  country: { value: "country", label: "Country" },
  city: { value: "city", label: "City" },
  terms: { value: "terms", label: "Terms" },
  lastLogin: { value: "last_login", label: "Last Login" },
  language: { value: "metadata.language", label: "Language" },
  deviceType: { value: "metadata.deviceType", label: "Device Type" },
  dob: { value: "dob", label: "Date of Birth" },
  salesAgentId: { value: "sales_agent", label: "Sales Agent ID" },
  hasDocuments: { value: "flags.hasDocuments", label: "Has Documents" },
  kycStatus: { value: "flags.kycStatus", label: "KYC Status" },
  createdAt: { value: "createdAt", label: "Created At" },
  updatedAt: { value: "updatedAt", label: "Updated At" },
};
