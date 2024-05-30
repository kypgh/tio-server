import { TRADE_SERVERS } from "../src/config/enums";
import Mt5DealsModel from "../src/models/TradeModels/Mt5Deals.model";
import Mt5OrdersModel from "../src/models/TradeModels/Mt5Orders.model";
import Mt5PositionsModel from "../src/models/TradeModels/Mt5Positions.model";

const migration003 = {
  up: async () => {
    await Mt5DealsModel.find({ server: { $exists: false } })
      .cursor({ batchSize: 10 })
      .eachAsync(async (doc) => {
        if (doc.environment_type === "live") {
          doc.server = TRADE_SERVERS.TIO_MT5_LIVE_1;
        } else {
          doc.server = TRADE_SERVERS.TIO_MT5_DEMO_1;
        }
        await doc.save();
      });
    await Mt5OrdersModel.find({ server: { $exists: false } })
      .cursor({ batchSize: 10 })
      .eachAsync(async (doc) => {
        if (doc.environment_type === "live") {
          doc.server = TRADE_SERVERS.TIO_MT5_LIVE_1;
        } else {
          doc.server = TRADE_SERVERS.TIO_MT5_DEMO_1;
        }
        await doc.save();
      });
    await Mt5PositionsModel.find({ server: { $exists: false } })
      .cursor({ batchSize: 10 })
      .eachAsync(async (doc) => {
        if (doc.environment_type === "live") {
          doc.server = TRADE_SERVERS.TIO_MT5_LIVE_1;
        } else {
          doc.server = TRADE_SERVERS.TIO_MT5_DEMO_1;
        }
        await doc.save();
      });
  },
  down: async () => {},
};

export default migration003;
