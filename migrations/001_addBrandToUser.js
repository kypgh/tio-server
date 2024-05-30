import UsersModel from "../src/models/Users.model";
import log from "./log";

const migration001 = {
  up: async () => {
    const users = await UsersModel.updateMany({}, { $set: { brand: "TIO" } });
    log.info("INFO", users);
  },
  down: async () => {},
};

export default migration001;
