import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import "./CRMUsers.model";
import "./Users.model";
const { Schema } = mongoose;

const UsersNotesSchema = new Schema(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "CRMUsers",
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    note: { type: String, required: true },
    isPinned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UsersNotesSchema.plugin(paginate);

export default mongoose.model("UsersNotes", UsersNotesSchema);
