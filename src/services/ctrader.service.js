import axios, { AxiosInstance } from "axios";
import {
  CTRADER_ACCOUNT_TYPES,
  CTRADER_DEMO_ACCOUNT_TYPES,
  PIX_CTRADER_LIVE_ACCOUNT_TYPES,
  PIX_CTRADER_DEMO_ACCOUNT_TYPES,
} from "../config/accountTypes";
import {
  CTRADER_API_PROXY,
  CTRADER_AUTH_TOKEN,
  CTRADER_BROKER_CRM_NAME,
  CTRADER_BROKER_NAME,
  CTRADER_DEMO_API_PROXY,
  CTRADER_DEMO_AUTH_TOKEN,
  TIO_PROXY_API_KEY,
  PIX_CTRADER_PROXY_API_KEY,
  PIX_CTRADER_PROXY_LIVE,
  PIX_CTRADER_PROXY_LIVE_AUTH_TOKEN,
  PIX_CTRADER_PROXY_DEMO,
  PIX_CTRADER_PROXY_DEMO_AUTH_TOKEN,
  PIX_CTRADER_PROXY_BROKER_NAME,
  PIX_CTRADER_PROXY_BROKER_CRM_NAME,
  ENV,
} from "../config/envs";
import errorCodes from "../config/errorCodes";
import HTTPError from "../utils/HTTPError";
import utilFunctions from "../utils/util.functions";
import { TIO_BRANDS, TRADE_SERVERS, USER_KYC_STATUS } from "../config/enums";
import Currency from "../utils/Currency";
import { csv2json } from "json-2-csv";

const serverAxiosMap = {
  [TRADE_SERVERS.TIO_CTRADER_DEMO_1]: {
    environmentName: "demo",
    brokerName: CTRADER_BROKER_NAME,
    brokerCRMName: CTRADER_BROKER_CRM_NAME,
    ctraderAxios: axios.create({
      baseURL: CTRADER_DEMO_API_PROXY,
      params: {
        token: CTRADER_DEMO_AUTH_TOKEN,
      },
      headers: {
        "x-api-key": TIO_PROXY_API_KEY,
        Accept: "application/json",
      },
    }),
  },
  [TRADE_SERVERS.TIO_CTRADER_LIVE_1]: {
    environmentName: "live",
    brokerName: CTRADER_BROKER_NAME,
    brokerCRMName: CTRADER_BROKER_CRM_NAME,
    ctraderAxios: axios.create({
      baseURL: CTRADER_API_PROXY,
      params: {
        token: CTRADER_AUTH_TOKEN,
      },
      headers: {
        "x-api-key": TIO_PROXY_API_KEY,
        Accept: "application/json",
      },
    }),
  },
  [TRADE_SERVERS.PIX_CTRADER_DEMO_1]: {
    environmentName: "demo",
    brokerName: PIX_CTRADER_PROXY_BROKER_NAME,
    brokerCRMName: PIX_CTRADER_PROXY_BROKER_CRM_NAME,
    ctraderAxios: axios.create({
      baseURL: PIX_CTRADER_PROXY_DEMO,
      params: {
        token: PIX_CTRADER_PROXY_DEMO_AUTH_TOKEN,
      },
      headers: {
        "x-api-key": PIX_CTRADER_PROXY_API_KEY,
        Accept: "application/json",
      },
    }),
  },
  [TRADE_SERVERS.PIX_CTRADER_LIVE_1]: {
    environmentName: "live",
    brokerName: PIX_CTRADER_PROXY_BROKER_NAME,
    brokerCRMName: PIX_CTRADER_PROXY_BROKER_CRM_NAME,
    ctraderAxios: axios.create({
      baseURL: PIX_CTRADER_PROXY_LIVE,
      params: {
        token: PIX_CTRADER_PROXY_LIVE_AUTH_TOKEN,
      },
      headers: {
        "x-api-key": PIX_CTRADER_PROXY_API_KEY,
        Accept: "application/json",
      },
    }),
  },
};

const CTRADER_CURRENCY_DIGITS = {
  USD: 2,
  EUR: 2,
  GBP: 2,
  CAD: 2,
  AUD: 2,
  BTC: 8,
  ETH: 8,
  USDT: 2,
  TIO: 8,
};

/**
 *
 * @param {number | string} preciseAmount
 * @param {string} _currency
 * @returns {{ amount: String, precise: String}}
 */
function getCtraderAmountFromPrecise(preciseAmount, _currency) {
  let amount = Currency.fromPrecise({
    amount: preciseAmount,
    currency: _currency,
  });
  let digits = CTRADER_CURRENCY_DIGITS[_currency];
  if (!digits) {
    throw new Error("Invalid currency for ctrader");
  }
  return {
    amount: amount.getCustomAmount(digits),
    precise: parseFloat(amount.getAmountPrecise()).toFixed(digits),
  };
}

/**
 *
 * @param {TIO_SE} server
 * @return {{
 *  environmentName: string,
 *  brokerName: string,
 *  brokerCRMName: string,
 *  ctraderAxios: AxiosInstance
 * }}
 */
function getDetailsForServer(server) {
  if (serverAxiosMap[server]) {
    return serverAxiosMap[server];
  } else {
    throw new HTTPError("Invalid server", 500, {
      message: "Internal server error",
    });
  }
}

const groupsServerMap = {
  [TRADE_SERVERS.TIO_CTRADER_LIVE_1]: CTRADER_ACCOUNT_TYPES,
  [TRADE_SERVERS.TIO_CTRADER_DEMO_1]: CTRADER_DEMO_ACCOUNT_TYPES,
  [TRADE_SERVERS.PIX_CTRADER_LIVE_1]: PIX_CTRADER_LIVE_ACCOUNT_TYPES,
  [TRADE_SERVERS.PIX_CTRADER_DEMO_1]: PIX_CTRADER_DEMO_ACCOUNT_TYPES,
};

function getGroupNameFromAccountType(account_type, server) {
  let groups = groupsServerMap[server];
  if (!groups)
    throw new HTTPError("Invalid server", 500, {
      message: "Internal server error",
    });
  let group = groups.find((t) => t.name === account_type);
  if (!group)
    throw new HTTPError("Invalid account type", 400, {
      message: "Invalid account type",
    });
  return group.groupName;
}

const formatTraderBodyForUpdate = (data, brokerName) => ({
  login: data.login,
  accessRights: data.accessRights,
  accountType: data.accountType,
  brokerName,
  depositCurrency: data.depositCurrency,
  groupName: data.groupName,
  leverageInCents: data.leverageInCents,
  totalMarginCalculationType: data.totalMarginCalculationType,
  contactDetails: {
    email: data.contactDetails?.email,
    address: data.contactDetails?.address,
    city: data.contactDetails?.city,
    state: data.contactDetails?.state,
    zipCode: data.contactDetails?.zipCode,
    documentId: data.contactDetails?.documentId,
    phone: data.contactDetails?.phone,
    introducingBroker1: data.contactDetails?.introducingBroker1,
    introducingBroker2: data.contactDetails?.introducingBroker2,
  },
  description: data.description,
  isLimitedRisk: data.isLimitedRisk,
  lastName: data.lastName,
  limitedRiskMarginCalculationStrategy:
    data.limitedRiskMarginCalculationStrategy,
  maxLeverage: data.maxLeverage,
  name: data.name,
  sendOwnStatement: data.sendOwnStatement,
  swapFree: data.swapFree,
});

const ctraderService = (server) => {
  const { ctraderAxios, brokerCRMName, brokerName, environmentName } =
    getDetailsForServer(server);
  async function getExistingUserDetailsBody(login_id) {
    return ctraderAxios
      .get(`/v2/webserv/traders/${login_id}`)
      .then((res) => formatTraderBodyForUpdate(res.data, brokerName));
  }
  return {
    getTraderAccountByLogin: async (login_id) => {
      return ctraderAxios
        .get(`/v2/webserv/traders/${login_id}`)
        .then((res) => res.data);
    },
    createUser: async ({
      email,
      firstName,
      preferredLanguage = "en",
      brand,
    }) => {
      if (
        [
          TRADE_SERVERS.TIO_CTRADER_DEMO_1,
          TRADE_SERVERS.TIO_CTRADER_LIVE_1,
        ].includes(server)
      ) {
        return ctraderAxios
          .post("/cid/oauth2/ctid/create", {
            email,
            brokerCrmName: brokerCRMName,
            preferredLanguage,
            firstName,
          })
          .then((res) => res.data)
          .catch((err) => {
            if (!!err?.response?.status) {
              console.error(err.response.status);
              console.error(err.response.data);
            } else {
              console.error(err);
            }
            if (
              err.response?.data?.error?.errorCode === "CH_EMAIL_ALREADY_EXISTS"
            ) {
              throw new HTTPError(
                "User with that email already exists in ctrader",
                409,
                errorCodes.userAlreadyExists
              );
            }
            throw new HTTPError(
              "User creation on ctrader failed",
              500,
              errorCodes.serverError
            );
          });
      } else if (
        [
          TRADE_SERVERS.PIX_CTRADER_DEMO_1,
          TRADE_SERVERS.PIX_CTRADER_LIVE_1,
        ].includes(server)
      ) {
        if (brand === TIO_BRANDS.PIX && ENV !== "production") {
          email = email.split("@").join(`+test@`);
        }
        return ctraderAxios
          .post("/cid/ctid/create", {
            brokerName: brokerName,
            email: email,
            preferredLanguage: preferredLanguage,
          })
          .then((res) => res.data);
      } else {
        throw new Error("Invalid server");
      }
    },
    createAccountAndLinkUser: async ({
      user,
      currency,
      leverage,
      startingBalance = 0,
      account_type,
    }) => {
      let countryData = utilFunctions.getCountryDetailsFromISO(user.country);
      const groupName = getGroupNameFromAccountType(account_type, server);
      let email = user.email;
      let name = user.first_name;
      if (user.brand === TIO_BRANDS.PIX && ENV !== "production") {
        email = email.split("@").join(`+test@`);
        name = name + " (Test)";
      }
      let accessRights = "FULL_ACCESS";
      if (
        user.flags.kycStatus !== USER_KYC_STATUS.approved &&
        environmentName === "live"
      ) {
        accessRights = "NO_TRADING";
      }

      let result = await ctraderAxios
        .post("/v2/webserv/traders", {
          accessRights,
          accountType: "HEDGED",
          balance: 0,
          brokerName: brokerName,
          contactDetails: {
            countryId: countryData?.countryId || 196,
            documentId: "0123",
            email,
            phone: user.phone,
            address: "",
            city: user.city ?? "",
            state: "",
            zipCode: "",
          },
          totalMarginCalculationType: "NET",
          depositCurrency: currency,
          description: "",
          enabled: true,
          groupName,
          hashedPassword: user.ctrader_password,
          lastName: user.last_name,
          leverageInCents: leverage * 100, // leverage is in cents ($1 = 100cents)
          name,
        })
        .then((res) => res.data);
      const linkRes = await ctraderAxios
        .post("/cid/ctid/link", {
          environmentName: environmentName,
          brokerName: brokerName, //ENV === "development" ? "chsandbox2" : CTRADER_BROKER_NAME,
          kycNotPassed: true,
          traderLogin: result.login,
          traderPasswordHash: user.ctrader_password,
          userId: user.ctrader_id,
          returnAccountDetails: true,
        })
        .then((res) => res.data);

      if (environmentName === "demo" && startingBalance > 0) {
        try {
          const { amount, precise } = getCtraderAmountFromPrecise(
            String(startingBalance),
            currency
          );
          // not allowed for demo accounts therefore the environemnt check not necessary here
          await ctraderAxios.post(
            `/v2/webserv/traders/${result.login}/changebalance`,
            {
              amount: Number(amount),
              externalId: "Starting balance",
              login: result.login,
              preciseAmount: precise,
              source: "Starting balance",
              type: "DEPOSIT",
            }
          );
        } catch (err) {
          console.error(
            "[Failed to add starting balance to ctrader account]",
            err
          );
        }
      }
      return { ...result, linking_id: linkRes.ctidTraderAccountId };
    },
    changeUserPassword: async (loginId, newPassword) => {
      return ctraderAxios.post(
        `/v2/webserv/traders/${loginId}/changepassword`,
        {
          login: loginId,
          hashedPassword: newPassword,
        }
      );
    },
    getAccountOpenPositions: async (login_id) => {
      return ctraderAxios.get(`/v2/webserv/openPositions`, {
        params: {
          login: login_id,
        },
      });
    },
    setPartnerIdentifier: async (ctrader_id, partner_id) => {
      return ctraderAxios.put("/v2/oauth2/ctid/setReferral", {
        userId: ctrader_id,
        partnerId: partner_id,
        brokerCrmName: brokerCRMName,
      });
    },
    deleteTraderAccount: async (loginId) => {
      return ctraderAxios.delete(`/v2/webserv/traders/${loginId}`);
    },
    updateTraderAccountDetails: async ({
      user,
      acc,
      email,
      first_name,
      last_name,
    }) => {
      let updateBody = await getExistingUserDetailsBody(acc.login_id);
      updateBody.name = first_name;
      updateBody.lastName = last_name;
      updateBody.contactDetails.email = email;
      if (user.brand === TIO_BRANDS.PIX && ENV !== "production") {
        updateBody.contactDetails.email = email.split("@").join(`+test@`);
      }

      return ctraderAxios.put(
        `/v2/webserv/traders/${acc.login_id}`,
        updateBody
      );
    },
    changeTraderAccountLeverage: async ({ login_id, newLeverage }) => {
      let updateBody = await getExistingUserDetailsBody(login_id);
      updateBody.leverageInCents = newLeverage * 100;

      return ctraderAxios.put(`/v2/webserv/traders/${login_id}`, updateBody);
    },
    /**
     *
     * @param {{
     *  account: Object;
     *  accessRights: "FULL_ACCESS" | "CLOSE_ONLY" | "NO_TRADING" | "NO_LOGIN";
     *  sendOwnStatement?: boolean;
     * }} param0
     * @returns
     */
    updateTraderAccountAccessRights: async ({
      account,
      accessRights,
      sendOwnStatement,
    }) => {
      let updateBody = await getExistingUserDetailsBody(account.login_id);
      updateBody.accessRights = accessRights;
      if (typeof sendOwnStatement === "boolean") {
        updateBody.sendOwnStatement = sendOwnStatement;
      }
      return ctraderAxios.put(
        `/v2/webserv/traders/${account.login_id}`,
        updateBody
      );
    },
    updateTraderAccountGroup: async ({ login_id, account_type, leverage }) => {
      let updateBody = await getExistingUserDetailsBody(login_id);
      updateBody.groupName = getGroupNameFromAccountType(account_type, server);
      return ctraderAxios.put(`/v2/webserv/traders/${login_id}`, updateBody);
    },
    /**
     *
     * @param {*} param0
     * @returns {Promise<string>} Platform's transaction id
     */
    depositToLiveAccount: async ({
      account,
      transaction_id,
      preciseAmount,
      payment_method,
    }) => {
      const { amount, precise } = getCtraderAmountFromPrecise(
        String(preciseAmount),
        account.currency
      );
      // not allowed for demo accounts therefore the environemnt check not necessary here
      return ctraderAxios
        .post(`/v2/webserv/traders/${account.login_id}/changebalance`, {
          amount: Number(amount),
          externalId: transaction_id,
          login: account.login_id,
          preciseAmount: precise,
          source: payment_method,
          type: "DEPOSIT",
        })
        .then((res) => res.data.balanceHistoryId);
    },
    /**
     *
     * @param {*} param0
     * @returns {Promise<string>} Platform's transaction id
     */
    depositToLiveAccountBonus: async ({
      account,
      transaction_id,
      preciseAmount,
      comment = "",
    }) => {
      const { amount, precise } = getCtraderAmountFromPrecise(
        preciseAmount,
        account.currency
      );
      // not allowed for demo accounts therefore the environemnt check not necessary here
      return ctraderAxios
        .post(`/v2/webserv/traders/${account.login_id}/changebonus`, {
          amount: Number(amount),
          comment,
          externalNote: transaction_id,
          login: account.login_id,
          preciseAmount: precise,
          type: "DEPOSIT",
        })
        .then((res) => res.data.balanceHistoryId);
    },
    /**
     *
     * @param {*} param0
     * @returns {Promise<string>} Platform's transaction id
     */
    withdrawFromLiveAccount: async ({
      account,
      transaction_id,
      preciseAmount,
      payment_method,
    }) => {
      const { amount, precise } = getCtraderAmountFromPrecise(
        preciseAmount,
        account.currency
      );
      // not allowed for demo accounts therefore the environemnt check not necessary here
      return ctraderAxios
        .post(`/v2/webserv/traders/${account.login_id}/changebalance`, {
          amount: Number(amount),
          externalId: transaction_id,
          login: account.login_id,
          preciseAmount: precise,
          source: payment_method,
          type: "WITHDRAW",
        })
        .then((res) => res.data.balanceHistoryId);
    },
    /**
     *
     * @param {*} param0
     * @returns {Promise<string>} Platform's transaction id
     */
    withdrawFromLiveAccountBonus: async ({
      account,
      transaction_id,
      preciseAmount,
      comment = "",
    }) => {
      const { amount, precise } = getCtraderAmountFromPrecise(
        preciseAmount,
        account.currency
      );
      // not allowed for demo accounts therefore the environemnt check not necessary here
      return ctraderAxios
        .post(`/v2/webserv/traders/${account.login_id}/changebonus`, {
          amount: Number(amount),
          comment,
          externalNote: transaction_id,
          login: account.login_id,
          preciseAmount: precise,
          type: "WITHDRAW",
        })
        .then((res) => res.data.balanceHistoryId);
    },
    sendRibbonRequest: async (
      ctid,
      { color, title, url, isExternal, enabled, closable }
    ) => {
      const action = {};
      isExternal ? (action.urlExternal = url) : (action.urlinApp = url);

      return ctraderAxios
        .put("/cid/oauth2/ctid/inAppControls", {
          brokerCrmName: CTRADER_BROKER_CRM_NAME,
          rules: {
            ribbons: [
              {
                color: color,
                title: title,
                action,
                enabled: enabled,
                closable: closable,
              },
            ],
          },
          userId: ctid,
        })
        .catch((error) => {
          return { status: error.response.status, data: error.response.data };
        });
    },
    getAccountOpenPositions: async (loginId) => {
      return ctraderAxios
        .get("/v2/webserv/openPositions", {
          params: {
            login: loginId,
          },
        })
        .then((res) => csv2json(res.data));
    },
    getSymbols: async () => {
      return ctraderAxios.get("/v2/webserv/symbols").then((res) => res.data);
    },
  };
};

export default ctraderService;
