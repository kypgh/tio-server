import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { USER_LOGS_ACTION_TYPES } from "../config/enums";
import "./Users.model";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const { Schema } = mongoose;

const UserLogsSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    action_type: {
      type: String,
      required: true,
      enum: Object.values(USER_LOGS_ACTION_TYPES),
    },
    description: { type: String, required: true },
    metadata: { type: Object, required: true },
  },
  { timestamps: true }
);

UserLogsSchema.plugin(paginate);
UserLogsSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model("UserLogs", UserLogsSchema);
