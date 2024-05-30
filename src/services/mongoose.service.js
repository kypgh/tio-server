import mongoose from "mongoose";
import { MONGO_DB_CONNECTION_URI } from "../config/envs";

const mongooseService = {
  async connect() {
    return new Promise((resolve, reject) => {
      mongoose.set("strictQuery", false);
      mongoose.connect(MONGO_DB_CONNECTION_URI);
      mongoose.connection.on("connected", () => {
        console.log("Connected to database");
        resolve();
      });
      mongoose.connection.on("error", (err) => {
        reject(err);
      });
    });
  },
};

export default mongooseService;
