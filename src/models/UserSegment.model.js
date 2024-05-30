import mongoose from "mongoose";
const { Schema } = mongoose;

// This token is used for our own purposes on logging in users
const UserSegmentSchema = new Schema(
  {
    name: { type: String, required: true },
    filters: { type: Object, required: true },
    filtersString: { type: String, required: true },
    brand: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserSegments", UserSegmentSchema);
