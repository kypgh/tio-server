import {
  MT5_ACCOUNT_SUFFIX,
  MT5_MANAGER_LOGIN,
  MT5_DEMO_API_PROXY_KEY,
  MT5_DEMO_API_PROXY_URL,
  MT5_LIVE_API_PROXY_KEY,
  MT5_LIVE_API_PROXY_URL,
} from "../config/envs";
import HTTPError from "../utils/HTTPError";
import axios from "axios";
import randomToken from "random-token";
import {
  MT5_DEMO_GROUPS,
  MT5_LIVE_GROUPS,
  MT5_LIVE_SWAP_FREE_GROUPS,
} from "../config/mt5Enums";
import { TRADE_SERVERS } from "../config/enums";
import groupsService from "./groups.service";

const demoMT5Axios = axios.create({
  baseURL: MT5_DEMO_API_PROXY_URL,
  headers: {
    "x-api-key": MT5_DEMO_API_PROXY_KEY,
  },
});

const liveMT5Axios = axios.create({
  baseURL: MT5_LIVE_API_PROXY_URL,
  headers: {
    "x-api-key": MT5_LIVE_API_PROXY_KEY,
  },
});

const ACCOUNTS_CHANGE_BALANCE_TYPE = {
  balanceOperation: 2, // a balance operation.
  creditOperation: 3, // a credit operation.
  additional: 4, // additional adding/withdrawing.
  correctiveOperations: 5, // corrective operations.
  bonus: 6, // adding bonuses.
};

const MT5_ACCOUNT_RIGHTS = Object.freeze({
  ENABLED: 0x1,
  PASSWORD: 0x2,
  TRADE_DISABLED: 0x4,
  // INVESTOR: 0x8, does not work this is internal use only in mt5
  CONFIRMED: 0x10,
  TRAILING: 0x20,
  EXPERT: 0x40,
  // OBSOLETE: 0x80, does not work this is just obsolete
  REPORTS: 0x100,
  // READONLY: 0x200, does not work this is internal use only in mt5
  RESET_PASS: 0x400,
  OTP_ENABLED: 0x800,
  SPONSORED_HOSTING: 0x2000,
  API_ENABLED: 0x4000,
  PUSH_NOTIFICATIONS: 0x8000,
  TECHNICAL: 0x10000,
  EXCLUDE_REPORTS: 0x20000,
});

/**
 * This are account permissions for mt5 accounts
 */
export const MT5_ACCOUNT_RIGHTS_KEYS = Object.freeze({
  ENABLED: "ENABLED",
  PASSWORD: "PASSWORD",
  TRADE_DISABLED: "TRADE_DISABLED",
  // INVESTOR: "INVESTOR", does not work this is internal use only in mt5
  CONFIRMED: "CONFIRMED",
  TRAILING: "TRAILING",
  EXPERT: "EXPERT",
  // OBSOLETE: "OBSOLETE", does not work this is just obsolete
  REPORTS: "REPORTS",
  // READONLY: "READONLY", does not work this is internal use only in mt5
  RESET_PASS: "RESET_PASS",
  OTP_ENABLED: "OTP_ENABLED",
  SPONSORED_HOSTING: "SPONSORED_HOSTING",
  API_ENABLED: "API_ENABLED",
  PUSH_NOTIFICATIONS: "PUSH_NOTIFICATIONS",
  TECHNICAL: "TECHNICAL",
  EXCLUDE_REPORTS: "EXCLUDE_REPORTS",
});

export const mt5AccountRightsUtils = {
  /**
   *
   * @param {Number} rights Binary representation of the rights
   * @returns {String[]} list of rights from the MT5_USER_RIGHTS object
   */
  getRightsFromNumber: (rights) => {
    let accountRights = [];
    for (let key in MT5_ACCOUNT_RIGHTS) {
      if ((rights & MT5_ACCOUNT_RIGHTS[key]) > 0) {
        accountRights.push(key);
      }
    }
    return accountRights;
  },
  /**
   *
   * @param {Number} accountRights Binary representation of the rights
   * @param {String} right right from the MT5_USER_RIGHTS object
   * @returns {Boolean} true if the account has the right
   */
  checkIfAccountHasRight: (accountRights, right) => {
    return (
      right in MT5_ACCOUNT_RIGHTS &&
      (accountRights & MT5_ACCOUNT_RIGHTS[right]) > 0
    );
  },
  /**
   *
   * @param {String[]} rights list of rights from the MT5_USER_RIGHTS object
   * @returns {Number} Binary representation of the rights
   */
  constructAccountRights(rights) {
    let accountRights = 0;
    for (let right of rights) {
      if (right in MT5_ACCOUNT_RIGHTS) {
        accountRights |= MT5_ACCOUNT_RIGHTS[right];
      }
    }
    return accountRights;
  },
};

const mt5Service = {
  createUser: async ({ _id, first_name, last_name, email }) => {
    return liveMT5Axios
      .post("/api/client/add", [
        {
          PersonName: MT5_ACCOUNT_SUFFIX
            ? `${MT5_ACCOUNT_SUFFIX}-${first_name}`
            : first_name,
          PersonLasstName: MT5_ACCOUNT_SUFFIX
            ? `${MT5_ACCOUNT_SUFFIX}-${last_name}`
            : last_name,
          ClientType: "1", // 1 = Individual
          ClientStatus: "700",
          ContactEmail: email,
          ClientExternalID: String(_id),
          AssignedManager: String(MT5_MANAGER_LOGIN),
        },
      ])
      .then((res) => {
        if (
          res.data?.answer?.length > 0 &&
          res.data?.answer[0].retcode === "0 Done"
        ) {
          return res.data?.answer[0].id;
        } else {
          throw new HTTPError("Failed to create user (mt5)", 500, {
            retcode: res.data?.answer[0].retcode,
          });
        }
      });
  },
  changeAccountPassword: async ({ login, password, environment_type }) => {
    if (environment_type === "live") {
      return liveMT5Axios
        .post("/api/user/change_password", [
          {
            Login: Number(login),
            Type: "main",
            Password: password,
          },
        ])
        .then((res) => res.data);
    } else {
      return demoMT5Axios
        .post("/api/user/change_password", [
          {
            Login: Number(login),
            Type: "main",
            Password: password,
          },
        ])
        .then((res) => res.data);
    }
  },
  createAccountRandomPassword: () => {
    const lower = randomToken.create("abcdefghijklmnopqrstuvwxzy")(3);

    const upper = randomToken.create("ABCDEFGHIJKLMNOPQRSTUVWXYZ")(3);

    const number = randomToken.create("0123456789")(1);

    const special = randomToken.create("#@!")(1);

    const password = (lower + upper + number + special)
      .split("")
      .sort(() => (Math.random() > 0.5 ? 1 : -1))
      .join("");
    return password;
  },
  createAccountAndLinkUser: async ({
    user,
    password,
    currency,
    leverage = 100,
    account_type,
    environment_type,
  }) => {
    let group = groupsService.getTraderGroupForMt5({
      brand: user.brand,
      accountType: account_type,
      currency,
      env: environment_type,
      shariaEnabled: user?.flags?.shariaEnabled,
    });
    if (!group)
      throw new Error("No group found for this account type and currency");
    if (environment_type === "live") {
      const mt5LiveAccount = await liveMT5Axios
        .post(
          "/api/user/add",
          {
            PassMain: password,
            PassInvestor: password,
            Company: "Individual",
            Country: user.country,
            EMail: user.email,
            FirstName: `${MT5_ACCOUNT_SUFFIX || ""}${user.first_name}`,
            LastName: user.last_name,
          },
          {
            params: {
              group,
              leverage,
            },
          }
        )
        .then((res) => res.data.answer);
      await liveMT5Axios.post("/api/client/user/add", [
        {
          user: mt5LiveAccount.Login, // user is actually the account!
          client: user.mt5_id, // client is actually the user!
        },
      ]);
      return mt5LiveAccount;
    } else {
      const mt5DemoAccount = await demoMT5Axios
        .post(
          "/api/user/add",
          {
            PassMain: password,
            PassInvestor: password,
            Company: "Individual",
            Country: user.country,
            City: "",
          },
          {
            params: {
              group,
              leverage: String(leverage),
              name: `${MT5_ACCOUNT_SUFFIX || ""}${user.first_name}${
                user.last_name
              }`,
            },
          }
        )
        .then((res) => res.data.answer);
      await demoMT5Axios.post("/api/client/user/add", [
        {
          user: mt5DemoAccount.Login, // user is actually the account!
          client: user.mt5_id, // client is actually the user!
        },
      ]);
      await demoMT5Axios.post(
        "/api/trade/balance",
        {},
        {
          params: {
            login: mt5DemoAccount.Login,
            type: ACCOUNTS_CHANGE_BALANCE_TYPE.balanceOperation,
            balance: 50000,
            comment: "Any comment",
          },
        }
      );
      return mt5DemoAccount;
    }
  },
  changeAccountLeverage: async ({ login, leverage, environment_type }) => {
    if (environment_type === "live") {
      return liveMT5Axios
        .post(
          "/api/user/update",
          {
            Leverage: leverage,
          },
          {
            params: {
              login,
            },
          }
        )
        .then((res) => res.data.answer);
    } else {
      return demoMT5Axios
        .post(
          "/api/user/update",
          {
            Leverage: leverage,
          },
          {
            params: {
              login,
            },
          }
        )
        .then((res) => res.data.answer);
    }
  },
  changeAccountGroup: async ({ login, group, environment_type }) => {
    if (environment_type === "live") {
      return liveMT5Axios
        .post(
          "/api/user/update",
          {
            Group: group,
          },
          {
            params: {
              login,
            },
          }
        )
        .then((res) => res.data.answer);
    } else {
      return demoMT5Axios
        .post(
          "/api/user/update",
          {
            Group: group,
          },
          {
            params: {
              login,
            },
          }
        )
        .then((res) => res.data.answer);
    }
  },
  addRightsToAccount: async ({ account, newRights }) => {
    return mt5Service.setAccountRights({
      login: account.login_id,
      rights: (account.permissions || []).concat(newRights),
      environment_type: account.environment_type,
    });
  },
  removeRightsFromAccount: async ({ account, rightsToBeRemoved }) => {
    return mt5Service.setAccountRights({
      login: account.login_id,
      rights: (account.permissions || []).filter(
        (v) => !rightsToBeRemoved.includes(v)
      ),
      environment_type: account.environment_type,
    });
  },
  /**
   *  Warning this will replace all existing rights with the new specified ones.
   * @param {{
   *  login: String;
   *  rights: String[];
   *  environment_type: "live" | "demo";
   * }} param0
   */
  setAccountRights: async ({ login, rights, environment_type }) => {
    const rightsNumber = mt5AccountRightsUtils.constructAccountRights(rights);
    if (environment_type === "live") {
      return liveMT5Axios
        .post(
          "/api/user/update",
          {
            Rights: String(rightsNumber),
          },
          {
            params: {
              login,
            },
          }
        )
        .then((res) =>
          mt5AccountRightsUtils.getRightsFromNumber(
            Number(res.data.answer.Rights)
          )
        );
    } else {
      return demoMT5Axios
        .post(
          "/api/user/update",
          {
            Rights: String(rightsNumber),
          },
          {
            params: {
              login,
            },
          }
        )
        .then((res) =>
          mt5AccountRightsUtils.getRightsFromNumber(
            Number(res.data.answer.Rights)
          )
        );
    }
  },
  getUserDemoAccounts: async (userId) => {
    return demoMT5Axios.get("/api/client/user/get_logins", {
      params: { client: userId },
    });
  },
  getUserLiveAccounts: async (userId) => {
    return liveMT5Axios.get("/api/client/user/get_logins", {
      params: { client: userId },
    });
  },
  getUser: async (mt5_id) => {
    return liveMT5Axios
      .get("/api/client/get", {
        params: { id: mt5_id },
      })
      .then((res) => res.data);
  },
  getAccountDetails: async ({ login_id, environment_type }) => {
    if (environment_type === "live") {
      return liveMT5Axios
        .get("/api/user/get", { params: { login: Number(login_id) } })
        .then((res) => res.data.answer);
    } else {
      return demoMT5Axios
        .get("/api/user/get", { params: { login: Number(login_id) } })
        .then((res) => res.data.answer);
    }
  },
  getAccountTradeState: async ({ login_id, environment_type }) => {
    if (environment_type === "live") {
      return liveMT5Axios
        .get("/api/user/account/get", { params: { login: Number(login_id) } })
        .then((res) => res.data.answer);
    } else {
      return demoMT5Axios
        .get("/api/user/account/get", { params: { login: Number(login_id) } })
        .then((res) => res.data.answer);
    }
  },
  getAccountBalance: async ({ login_id, environment_type }) => {
    if (environment_type === "live") {
      return liveMT5Axios
        .get("/api/user/check_balance", {
          params: { login: login_id },
        })
        .then((res) => res.data.answer);
    } else {
      return demoMT5Axios
        .get("/api/user/check_balance", {
          params: { login: login_id },
        })
        .then((res) => res.data.answer);
    }
  },
  deleteAccount: async ({ login_id, environment_type }) => {
    if (environment_type === "live") {
      return liveMT5Axios.post(
        "/api/user/archive/add",
        {},
        {
          params: { login: login_id },
        }
      );
    } else {
      return demoMT5Axios.post(
        "/api/user/archive/add",
        {},
        {
          params: { login: login_id },
        }
      );
    }
  },
  /**
   *
   * @param {*} account
   * @param {*} amount
   * @param {*} param2
   * @returns {Promise<string>} Ticket id of the balance transaction
   */
  depositToAccount: async (
    account,
    amount,
    { paymentType = "", paymentMethod = "" }
  ) => {
    const { login_id, environment_type } = account;
    if (environment_type === "live") {
      return liveMT5Axios
        .post(
          "/api/trade/balance",
          {},
          {
            params: {
              login: login_id,
              type: ACCOUNTS_CHANGE_BALANCE_TYPE.balanceOperation,
              balance: amount,
              comment: paymentType + " - " + paymentMethod, // deposit type and payment method
            },
          }
        )
        .then((res) => res.data?.answer?.ticket);
    } else {
      return demoMT5Axios
        .post(
          "/api/trade/balance",
          {},
          {
            params: {
              login: login_id,
              type: ACCOUNTS_CHANGE_BALANCE_TYPE.balanceOperation,
              balance: amount,
              comment: paymentType + " - " + paymentMethod,
            },
          }
        )
        .then((res) => res.data?.answer?.ticket);
    }
  },
  /**
   *
   * @param {*} account
   * @param {*} amount
   * @param {*} param2
   * @returns {Promise<string>} Ticket id of the balance transaction
   */
  withdrawFromAccount: async (
    account,
    amount,
    { paymentType = "", paymentMethod = "" }
  ) => {
    const { login_id, environment_type } = account;
    if (environment_type === "live") {
      return liveMT5Axios
        .post(
          "/api/trade/balance",
          {},
          {
            params: {
              login: login_id,
              type: ACCOUNTS_CHANGE_BALANCE_TYPE.balanceOperation,
              balance: -amount,
              comment: paymentType + " - " + paymentMethod,
            },
          }
        )
        .then((res) => res.data?.answer?.ticket);
    } else {
      return demoMT5Axios
        .post(
          "/api/trade/balance",
          {},
          {
            params: {
              login: login_id,
              type: ACCOUNTS_CHANGE_BALANCE_TYPE.balanceOperation,
              balance: -amount,
              comment: paymentType + " - " + paymentMethod,
            },
          }
        )
        .then((res) => res.data?.answer?.ticket);
    }
  },
  /**
   *
   * @param {*} account
   * @param {*} amount
   * @param {*} param2
   * @returns {Promise<string>} Ticket id of the balance transaction
   */
  depositToAccountBonus: async (
    account,
    amount,
    { paymentType = "", paymentMethod = "" }
  ) => {
    const { login_id, environment_type } = account;
    if (environment_type === "live") {
      return liveMT5Axios
        .post(
          "/api/trade/balance",
          {},
          {
            params: {
              login: login_id,
              type: ACCOUNTS_CHANGE_BALANCE_TYPE.bonus,
              balance: amount,
              comment: paymentType + " - " + paymentMethod,
            },
          }
        )
        .then((res) => res.data?.answer?.ticket);
    } else {
      return demoMT5Axios
        .post(
          "/api/trade/balance",
          {},
          {
            params: {
              login: login_id,
              type: ACCOUNTS_CHANGE_BALANCE_TYPE.bonus,
              balance: amount,
              comment: paymentType + " - " + paymentMethod,
            },
          }
        )
        .then((res) => res.data?.answer?.ticket);
    }
  },
  /**
   *
   * @param {*} account
   * @param {*} amount
   * @param {*} param2
   * @returns {Promise<string>} Ticket id of the balance transaction
   */
  withdrawFromAccountBonus: async (
    account,
    amount,
    { paymentType = "", paymentMethod = "" }
  ) => {
    const { login_id, environment_type } = account;
    if (environment_type === "live") {
      return liveMT5Axios
        .post(
          "/api/trade/balance",
          {},
          {
            params: {
              login: login_id,
              type: ACCOUNTS_CHANGE_BALANCE_TYPE.bonus,
              balance: -amount,
              comment: paymentType + " - " + paymentMethod,
            },
          }
        )
        .then((res) => res.data?.answer?.ticket);
    } else {
      return demoMT5Axios
        .post(
          "/api/trade/balance",
          {},
          {
            params: {
              login: login_id,
              type: ACCOUNTS_CHANGE_BALANCE_TYPE.bonus,
              balance: -amount,
              comment: paymentType + " - " + paymentMethod,
            },
          }
        )
        .then((res) => res.data?.answer?.ticket);
    }
  },
  getTradeGroupsAmount: (environment_type) => {
    if (environment_type === "live") {
      return liveMT5Axios
        .get("/api/group/total")
        .then((res) => res.data.answer);
    } else {
      return demoMT5Axios
        .get("/api/group/total")
        .then((res) => res.data.answer);
    }
  },
  getTradeGroupByIndex: (index, environment_type) => {
    if (environment_type === "live") {
      return liveMT5Axios
        .get("/api/group/next", {
          params: { index },
        })
        .then((res) => res.data.answer);
    } else {
      return demoMT5Axios
        .get("/api/group/next", {
          params: { index },
        })
        .then((res) => res.data.answer);
    }
  },
  getTraderGroupForUser: (
    user,
    { account_type, currency, environment_type }
  ) => {
    if (environment_type === "live") {
      if (account_type === "standard") {
        if (user?.ib?.refId) {
          if (MT5_LIVE_GROUPS.standardIb[currency]) {
            return MT5_LIVE_GROUPS.standardIb[currency];
          } else {
            throw new Error(
              "No group found for this account type and currency"
            );
          }
        } else {
          if (MT5_LIVE_GROUPS.standard[currency]) {
            if (user?.flags?.shariaEnabled) {
              return MT5_LIVE_SWAP_FREE_GROUPS.standard[currency];
            } else {
              return MT5_LIVE_GROUPS.standard[currency];
            }
          } else {
            throw new Error(
              "No group found for this account type and currency"
            );
          }
        }
      } else {
        if (user?.flags?.shariaEnabled) {
          if (
            MT5_LIVE_SWAP_FREE_GROUPS[account_type] &&
            MT5_LIVE_SWAP_FREE_GROUPS[account_type][currency]
          ) {
            return MT5_LIVE_SWAP_FREE_GROUPS[account_type][currency];
          } else {
            throw new Error(
              "No group found for this account type and currency"
            );
          }
        } else {
          if (
            MT5_LIVE_GROUPS[account_type] &&
            MT5_LIVE_GROUPS[account_type][currency]
          ) {
            return MT5_LIVE_GROUPS[account_type][currency];
          } else {
            throw new Error(
              "No group found for this account type and currency"
            );
          }
        }
      }
    } else {
      if (
        MT5_DEMO_GROUPS[account_type] &&
        MT5_DEMO_GROUPS[account_type][currency]
      ) {
        return MT5_DEMO_GROUPS[account_type][currency];
      } else {
        throw new Error("No group found for this account type and currency");
      }
    }
  },
  /**
   * @param {{ symbol: String; server: String }[]} symbolList
   * @returns
   */
  getSymbolPrices: async (symbolList) => {
    const symbols = symbolList.reduce((acc, curr) => {
      if (!acc[curr.server]) acc[curr.server] = [];
      acc[curr.server].push(curr.symbol);
      return acc;
    }, {});
    let result = {};
    if (symbols[TRADE_SERVERS.TIO_MT5_LIVE_1]?.length > 0) {
      result[TRADE_SERVERS.TIO_MT5_LIVE_1] = await liveMT5Axios
        .get("/api/tick/last", {
          params: {
            SYMBOL: symbols[TRADE_SERVERS.TIO_MT5_LIVE_1].join(","),
          },
        })
        .then((res) => res.data.answer);
    }
    if (symbols[TRADE_SERVERS.TIO_MT5_DEMO_1]?.length > 0) {
      result[TRADE_SERVERS.TIO_MT5_DEMO_1] = await demoMT5Axios
        .get("/api/tick/last", {
          params: {
            SYMBOL: symbols[TRADE_SERVERS.TIO_MT5_DEMO_1].join(","),
          },
        })
        .then((res) => res.data?.answer);
    }

    return result;
  },
  /**
   * @param {{ login: String; server: String }[]} logins
   * @returns
   */
  getOpenPositionsFromLogins: async (logins) => {
    const positions = logins.reduce((acc, curr) => {
      if (!acc[curr.server]) acc[curr.server] = [];
      acc[curr.server].push(curr.login);
      return acc;
    }, {});
    let result = [];
    if (positions[TRADE_SERVERS.TIO_MT5_LIVE_1]?.length > 0) {
      result = await liveMT5Axios
        .get("/api/position/get_batch", {
          params: {
            login: positions[TRADE_SERVERS.TIO_MT5_LIVE_1].join(","),
          },
        })
        .then((res) =>
          Array.isArray(res.data.answer)
            ? res.data.answer.map((v) => ({
                ...v,
                server: TRADE_SERVERS.TIO_MT5_LIVE_1,
              }))
            : []
        );
    }
    if (positions[TRADE_SERVERS.TIO_MT5_DEMO_1]?.length > 0) {
      result = result.concat(
        await demoMT5Axios
          .get("/api/position/get_batch", {
            params: {
              SYMBOL: positions[TRADE_SERVERS.TIO_MT5_DEMO_1].join(","),
            },
          })
          .then((res) =>
            Array.isArray(res.data.answer)
              ? res.data.answer.map((v) => ({
                  ...v,
                  server: TRADE_SERVERS.TIO_MT5_DEMO_1,
                }))
              : []
          )
      );
    }

    return result;
  },
  /**
   * @param {String[] | String} symbols
   * @param {String} group
   * @param {"demo" | "live"} env
   * @returns
   */
  getSymbolPriceForGroup: async (symbols, group, env) => {
    if (env === "live") {
      return liveMT5Axios
        .get("/api/tick/last_group", {
          params: {
            symbol: typeof symbols === "string" ? symbols : symbols.join(","),
            group,
            trans_id: 0,
          },
        })
        .then((res) => res.data.answer);
    } else {
      return demoMT5Axios
        .get("/api/tick/last_group", {
          params: {
            symbol: typeof symbols === "string" ? symbols : symbols.join(","),
            group,
            trans_id: 0,
          },
        })
        .then((res) => res.data.answer);
    }
  },
  getSymbolList: async () => {
    return liveMT5Axios.get("/api/symbol/list").then((res) => res.data.answer);
  },
  getSymbolByIndex: async (index) => {
    return liveMT5Axios
      .get("/api/symbol/next", {
        params: {
          index,
        },
      })
      .then((res) => res.data.answer);
  },
};

export default mt5Service;
