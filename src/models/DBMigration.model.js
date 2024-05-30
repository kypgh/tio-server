import mongoose from "mongoose";
const { Schema } = mongoose;

// This token is used by ctrader to verify the user for long term access
const DBMigration = new Schema(
  {
    version: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

DBMigration.index({ version: 1 }, { unique: true });

export default mongoose.model("dbmigrations", DBMigration);
