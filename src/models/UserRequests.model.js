import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { USER_REQUEST_ACTIONS, USER_REQUEST_TYPES } from "../config/enums";

import "./Users.model";
const { Schema } = mongoose;

const UserRequestsSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    request_type: {
      type: String,
      required: true,
      enum: Object.values(USER_REQUEST_TYPES),
    },
    status: { type: String, required: true, default: "pending" },
    metadata: { type: Object, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        addActionsToRequest(ret);
      },
    },
  }
);

export function addActionsToRequest(ret) {
  if (ret.status === "pending") {
    if (ret.request_type === USER_REQUEST_TYPES.withdrawFromAccount) {
      ret.actions = Object.keys(USER_REQUEST_ACTIONS[ret.request_type]).filter(
        (action) =>
          action !== USER_REQUEST_ACTIONS.withdrawFromAccount.processed
      );
    } else {
      ret.actions = Object.keys(USER_REQUEST_ACTIONS[ret.request_type] ?? {});
    }
  } else {
    if (ret.request_type === USER_REQUEST_TYPES.withdrawFromAccount) {
      if (ret.status === USER_REQUEST_ACTIONS.withdrawFromAccount.delayed) {
        ret.actions = [
          USER_REQUEST_ACTIONS.withdrawFromAccount.approve,
          USER_REQUEST_ACTIONS.withdrawFromAccount.reject,
        ];
      } else if (
        ret.status === USER_REQUEST_ACTIONS.withdrawFromAccount.approve
      ) {
        ret.actions = [
          USER_REQUEST_ACTIONS.withdrawFromAccount.reject,
          USER_REQUEST_ACTIONS.withdrawFromAccount.processed,
        ];
      } else {
        ret.actions = [];
      }
    } else {
      ret.actions = [];
    }
  }
}

UserRequestsSchema.plugin(paginate);
UserRequestsSchema.plugin(aggregatePaginate);

export default mongoose.model("UserRequests", UserRequestsSchema);
