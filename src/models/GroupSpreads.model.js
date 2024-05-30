import mongoose from "mongoose";
const { Schema } = mongoose;

const GroupSpreads = new Schema({
  platform: String,
  group: String,
  symbol: String,
  symbolType: String,
  spread: Number,
  bid: Number,
  ask: Number,
  digits: Number,
});

export default mongoose.model("groupspreads", GroupSpreads);
