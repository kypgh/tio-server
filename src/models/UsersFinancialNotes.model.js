import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import "./CRMUsers.model";
import "./Users.model";
const { Schema } = mongoose;

const UsersFinancialNotesSchema = new Schema(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "CRMUsers",
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    note: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

UsersFinancialNotesSchema.plugin(paginate);

export default mongoose.model("UsersFinancialNotes", UsersFinancialNotesSchema);
