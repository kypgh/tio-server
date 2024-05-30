import {
  CTRADER_ACCOUNT_TYPES,
  CTRADER_DEMO_ACCOUNT_TYPES,
} from "../src/config/accountTypes";
import UserAccountsModel from "../src/models/UserAccounts.model";
import mt5Service from "../src/services/mt5.service";
import log from "./log";

const migration002 = {
  up: async () => {
    let accCursor = UserAccountsModel.find({ group: { $exists: false } })
      .populate("user")
      .cursor({ batchSize: 10 });
    await accCursor.eachAsync(async (doc) => {
      if (doc.platform === "ctrader") {
        if (doc.environment_type === "live") {
          doc.group = CTRADER_ACCOUNT_TYPES.find(
            (a) => a.name === doc.account_type
          ).groupName;
        } else {
          doc.group = CTRADER_DEMO_ACCOUNT_TYPES.find(
            (a) => a.name === doc.account_type
          ).groupName;
        }
        await doc.save();
      } else if (doc.platform === "mt5") {
        const group = mt5Service.getTraderGroupForUser(doc.user, doc);
        doc.group = group;
        await doc.save();
      }
    });
  },
  down: async () => {},
};

export default migration002;
