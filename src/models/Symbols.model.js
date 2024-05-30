import mongoose from "mongoose";
const { Schema } = mongoose;

const SymbolsSchema = new Schema({
  platform: String,
  symbol: String,
  server: String,
  category: String,
  metadata: Object,
});

export default mongoose.model("symbols", SymbolsSchema);
