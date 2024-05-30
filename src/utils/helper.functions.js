import { TIO_BRANDS, TIO_PLATFORMS, TRADE_SERVERS } from "../config/enums";
import { PAYMENT_GATEWAYS } from "../config/paymentGateways";

const serversMap = {
  [TIO_BRANDS.PIX]: {
    [TIO_PLATFORMS.ctrader]: {
      live: TRADE_SERVERS.PIX_CTRADER_LIVE_1,
      demo: TRADE_SERVERS.PIX_CTRADER_DEMO_1,
    },
  },
  [TIO_BRANDS.TIO]: {
    [TIO_PLATFORMS.ctrader]: {
      live: TRADE_SERVERS.TIO_CTRADER_LIVE_1,
      demo: TRADE_SERVERS.TIO_CTRADER_DEMO_1,
    },
    [TIO_PLATFORMS.mt5]: {
      live: TRADE_SERVERS.TIO_MT5_LIVE_1,
      demo: TRADE_SERVERS.TIO_MT5_DEMO_1,
    },
    [TIO_PLATFORMS.mt4]: {
      live: TRADE_SERVERS.TIO_MT4_LIVE_1,
      demo: TRADE_SERVERS.TIO_MT4_DEMO_1,
    },
  },
};

const helperFunctions = {
  getAccountServer: ({ platform, environment_type, brand }) => {
    try {
      return serversMap[brand][platform][environment_type];
    } catch (err) {
      console.error("Cannot find server for account: ", {
        platform,
        environment_type,
      });
    }
  },
  getTransactionMethod: (transaction) => {
    let payment = PAYMENT_GATEWAYS.find(
      (g) =>
        transaction.gateway === g.hash || transaction.payment_method === g.id
    );
    if (payment) return payment.name;
    return transaction.payment_method;
  },
};

export default helperFunctions;
