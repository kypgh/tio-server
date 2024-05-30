import mongoose from "mongoose";
import "./Users.model";
const { Schema } = mongoose;

// This token is used for our own purposes on logging in users
const UserRibbonSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    color: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    isExternal: { type: Boolean, default: false },
    enabled: { type: Boolean, default: false },
    closable: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserRibbons", UserRibbonSchema);

const SegmentRibbonSchema = new Schema(
  {
    segment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Segments",
      required: true,
    },
    color: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    isExternal: { type: Boolean, default: false },
    enabled: { type: Boolean, default: false },
    closable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SegmentRibbonsModel = mongoose.model(
  "SegmentRibbons",
  SegmentRibbonSchema
);
