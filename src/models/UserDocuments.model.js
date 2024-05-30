import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import {
  USER_ALLOWED_DOCUMENTS,
  USER_DOCUMENTS_STATUSES,
} from "../config/enums";
import "./Users.model";
import "./CRMUsers.model";
const { Schema } = mongoose;

const UserDocumentsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    document_type: {
      type: String,
      enum: Object.values(USER_ALLOWED_DOCUMENTS),
      required: true,
    },
    document: { type: Object, required: true },
    status: {
      type: String,
      enum: Object.values(USER_DOCUMENTS_STATUSES),
      default: () => USER_DOCUMENTS_STATUSES.pending,
    },
    crm_user_action: { type: Schema.Types.ObjectId, ref: "CRMUsers" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.document.bucket;
        delete ret.document.id;
        delete ret.document.selfLink;
        delete ret.document.mediaLink;
      },
    },
  }
);

UserDocumentsSchema.plugin(paginate);
UserDocumentsSchema.plugin(aggregatePaginate);

export default mongoose.model("UserDocuments", UserDocumentsSchema);
