import axios from "axios";
import {
  ENV,
  MT4_ACCOUNT_SUFFIX,
  MT4_DEMO_API_KEY,
  MT4_DEMO_API_URL,
  MT4_LIVE_API_KEY,
  MT4_LIVE_API_URL,
} from "../config/envs";
import { TIO_BRANDS, TRADE_SERVERS } from "../config/enums";
import randomToken from "random-token";
import _ from "lodash";
import groupsService from "./groups.service";

const demoMT4Axios = axios.create({
  baseURL: MT4_DEMO_API_URL,
  headers: {
    "x-api-key": MT4_DEMO_API_KEY,
  },
});

const liveMT4Axios = axios.create({
  baseURL: MT4_LIVE_API_URL,
  headers: {
    "x-api-key": MT4_LIVE_API_KEY,
  },
});

const AXIOS_FOR_SERVER = {
  [TRADE_SERVERS.TIO_MT4_DEMO_1]: demoMT4Axios,
  [TRADE_SERVERS.TIO_MT4_LIVE_1]: liveMT4Axios,
};

export function createMt4AccountRandomPassword() {
  const lower = randomToken.create("abcdefghijklmnopqrstuvwxzy")(3);

  const upper = randomToken.create("ABCDEFGHIJKLMNOPQRSTUVWXYZ")(3);

  const number = randomToken.create("0123456789")(1);

  const special = randomToken.create("#@!")(1);

  const password = (lower + upper + number + special)
    .split("")
    .sort(() => (Math.random() > 0.5 ? 1 : -1))
    .join("");
  return password;
}

/**
 * REMINDER: MT4 platform does not have
 * a different entity for both user and account therefore
 * a user in terms of mt4 is just a single account!
 */
const mt4Service = (server) => {
  /** @type {import("axios").AxiosInstance} */
  const axiosInst = AXIOS_FOR_SERVER[server];
  if (!axiosInst) {
    throw new Error("Invalid server");
  }
  return {
    getAccountByLoginId: async (loginId) => {
      return axiosInst.get(`/users/${loginId}`).then((res) => res.data);
    },
    getAccountMargin: async (loginId) => {
      return axiosInst.get(`/users/${loginId}/margin`).then((res) => res.data);
    },
    createAccount: async ({
      name,
      email,
      password,
      accountType,
      currency,
      leverage,
      entity,
      environmentType,
      shariaEnabled,
    }) => {
      let group = groupsService.getTraderGroupForMT4({
        accountType,
        currency,
        brand: TIO_BRANDS.TIO,
        entity,
        env: environmentType,
        shariaEnabled,
      });
      if (!group) {
        throw new Error("No group found for this account");
      }
      if (ENV !== "production") {
        email = email.split("@").join(`+test@`);
        name = `${MT4_ACCOUNT_SUFFIX}-${name}`;
      }
      return axiosInst
        .post("/users", {
          name,
          email,
          password,
          group,
          leverage,
        })
        .then((res) => res.data);
    },
    updateUser: async ({ loginId, name, email, group, leverage }) => {
      const existingUser = await axiosInst
        .get(`/users/${loginId}`)
        .then((res) => res.data);

      return axiosInst
        .put(`/users/${loginId}`, {
          ...existingUser,
          ...(!_.isNil(name) ? { name } : {}),
          ...(!_.isNil(email) ? { email } : {}),
          ...(!_.isNil(group) ? { group } : {}),
          ...(!_.isNil(leverage) ? { leverage } : {}),
        })
        .then((res) => res.data);
    },
    changeAccountAccess: async ({ loginId, readOnly }) => {
      const existingUser = await axiosInst
        .get(`/users/${loginId}`)
        .then((res) => res.data);

      return axiosInst
        .put(`/users/${loginId}`, {
          ...existingUser,
          enable_read_only: readOnly ? 1 : 0,
        })
        .then((res) => res.data);
    },
    /**
     *
     * @param {{
     *  loginId: number;
     *  amount: number;
     *  paymentMethod: string;
     * }} param0
     * @returns {Promise<import("../interfaces/mt4Types").Mt4TransactionInfo>}
     */
    depositToAccount: async ({ loginId, amount, paymentMethod = "" }) => {
      return axiosInst
        .put(`/users/${loginId}/balance_operations`, {
          type: 0, // 0 for deposit
          amount: Number(amount),
          comment: paymentMethod, // 32 max characters so i removed paymentType to fit the comment
        })
        .then((res) => res.data);
    },
    /**
     *
     * @param {{
     *  loginId: number;
     *  amount: number;
     *  paymentMethod: string;
     * }} param0
     * @returns {Promise<import("../interfaces/mt4Types").Mt4TransactionInfo>}
     */
    withdrawFromAccount: async ({ loginId, amount, paymentMethod = "" }) => {
      return axiosInst
        .put(`/users/${loginId}/balance_operations`, {
          type: 1, // 1 for withdrawal
          amount: Number(amount),
          comment: paymentMethod, // 32 max characters so i removed paymentType to fit the comment
        })
        .then((res) => res.data);
    },
    /**
     *
     * @param {{
     *  loginId: number;
     *  amount: number;
     *  paymentMethod: string;
     * }} param0
     * @returns {Promise<import("../interfaces/mt4Types").Mt4TransactionInfo>}
     */
    bonusDepositToAccount: async ({ loginId, amount, paymentMethod = "" }) => {
      return axiosInst
        .put(`/users/${loginId}/balance_operations`, {
          type: 2, // 2 for bonus deposit
          amount: Number(amount),
          comment: paymentMethod, // 32 max characters so i removed paymentType to fit the comment
        })
        .then((res) => res.data);
    },
    /**
     *
     * @param {{
     *  loginId: number;
     *  amount: number;
     *  paymentMethod: string;
     * }} param0
     * @returns {Promise<import("../interfaces/mt4Types").Mt4TransactionInfo>}
     */
    bonusWithdrawFromAccount: async ({
      loginId,
      amount,
      paymentMethod = "",
    }) => {
      return axiosInst
        .put(`/users/${loginId}/balance_operations`, {
          type: 3, // 3 for bonus withdrawal
          amount: Number(amount),
          comment: paymentMethod, // 32 max characters so i removed paymentType to fit the comment
        })
        .then((res) => res.data);
    },
    changeAccountPassword: async ({ loginId, password }) => {
      return axiosInst.put(`/users/${loginId}/change_password`, { password });
    },
    getGroups: async () => {
      return axiosInst.get("/groups").then((res) => res.data);
    },
    /**
     *
     * @param {{
     *  symbol: string;
     *  from: number; timestamp in seconds
     *  to: number; timestamp in seconds
     * }} param0
     * @returns
     */
    getTickData: async ({ symbol, from, to }) => {
      return axiosInst
        .get(`/tickdata/${symbol}`, {
          params: {
            from,
            to,
          },
        })
        .then((res) => res.data);
    },
    deleteAccount: async (loginId) => {
      const existingUser = await axiosInst
        .get(`/users/${loginId}`)
        .then((res) => res.data);

      return axiosInst
        .put(`/users/${loginId}`, {
          ...existingUser,
          enable: 0,
        })
        .then((res) => res.data);
    },
    updateAccountPermissions: async ({
      login,
      enabled,
      enable_change_password,
      enable_send_reports,
      read_only,
    }) => {
      const existingUser = await axiosInst
        .get(`/users/${login}`)
        .then((res) => res.data);
      existingUser.enable = enabled ? 1 : 0;
      existingUser.enable_change_password = enable_change_password ? 1 : 0;
      existingUser.enable_read_only = read_only ? 1 : 0;
      existingUser.send_reports = enable_send_reports ? 1 : 0;
      return axiosInst
        .put(`/users/${login}`, existingUser)
        .then((res) => res.data);
    },
  };
};

export default mt4Service;
