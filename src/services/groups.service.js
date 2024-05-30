import {
  CTRADER_CURRENCIES,
  MT5_CURRENCIES,
  PIX_CTRADER_CURRENCIES,
} from "../config/currencies";
import { TIO_BRANDS } from "../config/enums";
import { CTRADER_LEVERAGES } from "../config/leverages";
import {
  MT4_DEMO_GROUPS,
  MT4_LIVE_GROUPS,
  MT4_SWAP_FREE_LIVE_GROUPS,
} from "../config/mt4Enums";
import {
  MT5_DEMO_GROUPS,
  MT5_LIVE_GROUPS,
  MT5_LIVE_SWAP_FREE_GROUPS,
} from "../config/mt5Enums";

const groupsService = {
  getAllowedAccountTypes: ({ brand, env, shariaEnabled = false }) => {
    let ctrader = [];
    try {
      ctrader = groupsService.getCtraderAccountTypes({
        brand,
        env,
        shariaEnabled,
      });
    } catch (err) {
      console.error(err);
    }
    let mt5 = [];
    try {
      mt5 = groupsService.getMt5AccountTypes({ brand, env, shariaEnabled });
    } catch (err) {
      console.error(err);
    }
    let mt4 = [];
    try {
      mt4 = groupsService.getMt4AccountTypes({ brand, env, shariaEnabled });
    } catch (err) {
      console.error(err);
    }
    return {
      ctrader,
      mt5,
      mt4,
    };
  },
  getMt5AccountTypes: ({ brand, env, shariaEnabled = false }) => {
    const res = {
      [TIO_BRANDS.PIX]: {
        live: [],
        demo: [],
      },
      [TIO_BRANDS.TIO]: {
        live: shariaEnabled
          ? [
              {
                name: "Standard",
                value: "standard",
                currencies: Object.keys(
                  MT5_LIVE_SWAP_FREE_GROUPS.standard
                ).filter((v) => MT5_CURRENCIES.includes(v)),
                leverages: [50, 100, 200, 300, 400, 500],
              },
              {
                name: "Spread",
                value: "spreadOnly",
                currencies: Object.keys(
                  MT5_LIVE_SWAP_FREE_GROUPS.spreadOnly
                ).filter((v) => MT5_CURRENCIES.includes(v)),
                leverages: [50, 100, 200, 300, 400, 500],
              },
              {
                name: "VIP",
                value: "vip",
                currencies: Object.keys(MT5_LIVE_SWAP_FREE_GROUPS.vip).filter(
                  (v) => MT5_CURRENCIES.includes(v)
                ),
                leverages: [50, 100, 200],
              },
              {
                name: "VIP Black",
                value: "vipblack",
                currencies: Object.keys(
                  MT5_LIVE_SWAP_FREE_GROUPS.vipblack
                ).filter((v) => MT5_CURRENCIES.includes(v)),
                leverages: [50, 100, 200],
              },
            ]
          : [
              {
                name: "Standard",
                value: "standard",
                currencies: Object.keys(MT5_LIVE_GROUPS.standard).filter((v) =>
                  MT5_CURRENCIES.includes(v)
                ),
                leverages: [50, 100, 200, 300, 400, 500],
              },
              {
                name: "Spread",
                value: "spreadOnly",
                currencies: Object.keys(MT5_LIVE_GROUPS.spreadOnly).filter(
                  (v) => MT5_CURRENCIES.includes(v)
                ),
                leverages: [50, 100, 200, 300, 400, 500],
              },
              {
                name: "Copy Trading",
                value: "copyTrading",
                currencies: Object.keys(MT5_LIVE_GROUPS.copyTrading).filter(
                  (v) => MT5_CURRENCIES.includes(v)
                ),
                leverages: [50, 100, 200, 300, 400, 500],
              },
              {
                name: "VIP",
                value: "vip",
                currencies: Object.keys(MT5_LIVE_GROUPS.vip).filter((v) =>
                  MT5_CURRENCIES.includes(v)
                ),
                leverages: [50, 100, 200],
              },
              {
                name: "VIP Black",
                value: "vipblack",
                currencies: Object.keys(MT5_LIVE_GROUPS.vipblack).filter((v) =>
                  MT5_CURRENCIES.includes(v)
                ),
                leverages: [50, 100, 200],
              },
            ],
        demo: [
          {
            name: "Standard",
            value: "standard",
            currencies: Object.keys(MT5_DEMO_GROUPS.standard).filter((v) =>
              MT5_CURRENCIES.includes(v)
            ),
            leverages: [50, 100, 200, 300, 400, 500],
          },
        ],
      },
    };
    if (!res[brand]) {
      throw new Error(`No mt5 account types for brand ${brand}`);
    }
    if (!res[brand][env]) {
      throw new Error(`No mt5 account types for env ${env}`);
    }
    return res[brand][env];
  },
  getMt4AccountTypes: ({ brand, env, shariaEnabled = false }) => {
    const res = {
      [TIO_BRANDS.PIX]: {
        live: [],
        demo: [],
      },
      [TIO_BRANDS.TIO]: {
        live: shariaEnabled
          ? [
              {
                name: "Standard",
                value: "standard",
                currencies: Object.keys(
                  MT4_SWAP_FREE_LIVE_GROUPS.TIOSV.standard
                ),
                leverages: [50, 100, 200, 300, 400, 500],
              },
              {
                name: "Spread",
                value: "spreadOnly",
                currencies: Object.keys(
                  MT4_SWAP_FREE_LIVE_GROUPS.TIOSV.spreadOnly
                ),
                leverages: [50, 100, 200, 300, 400, 500],
              },
              {
                name: "VIP",
                value: "vip",
                currencies: Object.keys(MT4_SWAP_FREE_LIVE_GROUPS.TIOSV.vip),
                leverages: [50, 100, 200],
              },
              {
                name: "VIP Black",
                value: "vipblack",
                currencies: Object.keys(
                  MT4_SWAP_FREE_LIVE_GROUPS.TIOSV.vipblack
                ),
                leverages: [50, 100, 200],
              },
            ]
          : [
              {
                name: "Standard",
                value: "standard",
                currencies: Object.keys(MT4_LIVE_GROUPS.TIOSV.standard),
                leverages: [50, 100, 200, 300, 400, 500],
              },
              {
                name: "Spread",
                value: "spreadOnly",
                currencies: Object.keys(MT4_LIVE_GROUPS.TIOSV.spreadOnly),
                leverages: [50, 100, 200, 300, 400, 500],
              },
              {
                name: "VIP",
                value: "vip",
                currencies: Object.keys(MT4_LIVE_GROUPS.TIOSV.vip),
                leverages: [50, 100, 200],
              },
              {
                name: "VIP Black",
                value: "vipblack",
                currencies: Object.keys(MT4_LIVE_GROUPS.TIOSV.vipblack),
                leverages: [50, 100, 200],
              },
            ],
        demo: [
          {
            name: "Standard",
            value: "standard",
            currencies: Object.keys(MT4_DEMO_GROUPS.TIOSV.standard),
            leverages: [50, 100, 200, 300, 400, 500],
          },
        ],
      },
    };
    if (!res[brand]) {
      throw new Error(`No mt4 account types for brand ${brand}`);
    }
    if (!res[brand][env]) {
      throw new Error(`No mt4 account types for env ${env}`);
    }
    let result = res[brand][env];
    return result;
  },
  getCtraderAccountTypes: ({ brand, env }) => {
    const res = {
      [TIO_BRANDS.PIX]: {
        live: [
          {
            name: "Spread",
            value: "standard",
            currencies: PIX_CTRADER_CURRENCIES,
            leverages: CTRADER_LEVERAGES.standard,
          },
          {
            name: "VIP",
            value: "vip",
            currencies: PIX_CTRADER_CURRENCIES,
            leverages: CTRADER_LEVERAGES.vip,
          },
          {
            name: "Prime",
            value: "vipblack",
            currencies: PIX_CTRADER_CURRENCIES,
            leverages: CTRADER_LEVERAGES.vipblack,
          },
        ],
        demo: [
          {
            name: "Spread",
            value: "standard",
            currencies: PIX_CTRADER_CURRENCIES,
            leverages: CTRADER_LEVERAGES.standard,
          },
        ],
      },
      [TIO_BRANDS.TIO]: {
        live: [
          {
            name: "Standard",
            value: "standard",
            currencies: CTRADER_CURRENCIES,
            leverages: CTRADER_LEVERAGES.standard,
          },
          {
            name: "VIP",
            value: "vip",
            currencies: CTRADER_CURRENCIES,
            leverages: CTRADER_LEVERAGES.vip,
          },
          {
            name: "VIP Black",
            value: "vipblack",
            currencies: CTRADER_CURRENCIES,
            leverages: CTRADER_LEVERAGES.vipblack,
          },
        ],
        demo: [
          {
            name: "Standard",
            value: "standard",
            currencies: CTRADER_CURRENCIES,
            leverages: CTRADER_LEVERAGES.standard,
          },
        ],
      },
    };
    if (!res[brand]) {
      throw new Error(`No ctrader account types for brand ${brand}`);
    }
    if (!res[brand][env]) {
      throw new Error(`No ctrader account types for env ${env}`);
    }
    return res[brand][env];
  },
  getTraderGroupForMt5: ({
    brand,
    env,
    accountType,
    currency,
    shariaEnabled = false,
  }) => {
    if (brand === TIO_BRANDS.TIO) {
      if (env === "live") {
        if (shariaEnabled) {
          try {
            return MT5_LIVE_SWAP_FREE_GROUPS[accountType][currency];
          } catch (err) {
            console.error(err);
            return;
          }
        }
        try {
          return MT5_LIVE_GROUPS[accountType][currency];
        } catch (err) {
          console.error(err);
          return;
        }
      } else {
        try {
          return MT5_DEMO_GROUPS[accountType][currency];
        } catch (err) {
          console.error(err);
          return;
        }
      }
    }
  },
  getTraderGroupForMT4({
    env,
    brand,
    entity,
    accountType,
    currency,
    shariaEnabled = false,
  }) {
    if (brand === TIO_BRANDS.TIO) {
      let groups = env === "live" ? MT4_LIVE_GROUPS : MT4_DEMO_GROUPS;
      if (shariaEnabled && entity === "TIOSV" && env === "live") {
        groups = MT4_SWAP_FREE_LIVE_GROUPS;
      }
      let entityGroups = groups[entity];
      if (!entityGroups) {
        throw new Error(`No live groups for entity ${entity}`);
      }
      let accountTypeGroups = entityGroups[accountType];
      if (!accountTypeGroups) {
        throw new Error(`No live groups for account type ${accountType}`);
      }
      let group = accountTypeGroups[currency];
      if (!group) {
        throw new Error(`No live group for currency ${currency}`);
      }
      return group;
    }
  },
};

export default groupsService;
