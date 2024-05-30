import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import paginate from "mongoose-paginate-v2";
import "./Users.model";
import "./UserSegment.model";
const { Schema } = mongoose;

// This token is used for our own purposes on logging in users
const UsersJoinSegmentsSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  segment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSegments",
    required: true,
  },
});

// UsersJoinSegmentsSchema.index({ user: 1, segment: 1 }, { unique: true });
UsersJoinSegmentsSchema.plugin(mongooseAggregatePaginate);
UsersJoinSegmentsSchema.plugin(paginate);

export default mongoose.model("UsersJoinSegments", UsersJoinSegmentsSchema);
