import { TRADE_SERVERS } from "../src/config/enums";
import Mt5DealsModel from "../src/models/TradeModels/Mt5Deals.model";
import Mt5OrdersModel from "../src/models/TradeModels/Mt5Orders.model";
import Mt5PositionsModel from "../src/models/TradeModels/Mt5Positions.model";
import UserAccountsModel from "../src/models/UserAccounts.model";

const migration004 = {
  up: async () => {
    await UserAccountsModel.find({})
      .cursor({ batchSize: 10 })
      .eachAsync(async (doc) => {
        if (doc.platform === "mt5") {
          if (doc.environment_type === "live") {
            doc.server = TRADE_SERVERS.TIO_MT5_LIVE_1;
          } else {
            doc.server = TRADE_SERVERS.TIO_MT5_DEMO_1;
          }
        } else {
          if (doc.environment_type === "live") {
            doc.server = TRADE_SERVERS.TIO_CTRADER_LIVE_1;
          } else {
            doc.server = TRADE_SERVERS.TIO_CTRADER_DEMO_1;
          }
        }
        await doc.save();
      });
  },
  down: async () => {},
};

export default migration004;
