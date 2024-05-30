import {
  OPENPAYD_API_USERNAME_PASSWORD,
  OPENPAYD_API_URL,
  MAIN_ACCOUNT_HOLDER_ID,
} from "../config/envs";
import axios from "axios";
import base64 from "base-64";
import OpenpaydLinkedAccountModel from "../models/OpenpaydLinkedAccount.model";
import UserAccountsModel from "../models/UserAccounts.model";
import userAccountsService from "./userAccounts.service";

const openpaydAxios = axios.create({
  baseURL: OPENPAYD_API_URL,
});

const openpaydService = {
  getAccessToken: async () => {
    return openpaydAxios
      .post(
        "/oauth/token?grant_type=client_credentials",
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${base64.encode(
              OPENPAYD_API_USERNAME_PASSWORD
            )}`,
          },
        }
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  getOpenpaydAccount: async (accountId) =>
    OpenpaydLinkedAccountModel.findOne({ accountId }),
  createOpenpaydAccount: async (account, user) => {
    let linkedClient = await OpenpaydLinkedAccountModel.findOne({
      userId: user._id,
    });
    let accountHolderId = linkedClient?.accountHolderId;
    let linkedClientId = linkedClient?.linkedClientId;
    let accessToken;

    accessToken = await openpaydService.getAccessToken().then((res) => {
      return res.access_token;
    });

    if (linkedClient == null) {
      await openpaydAxios
        .post(
          "/linkedClient",
          {
            clientType: "INDIVIDUAL",
            friendlyName: `${user.brand} - ${user.first_name} ${user.last_name}`, // need to fix internalAccountId
            individual: {
              address: {
                addressLine1: user.address ?? "test",
                addressLine2: "test",
                city: user?.city ?? "test",
                postCode: user?.postcode ?? "test",
                country: user.country,
                state: "test",
              },
              dateOfBirth: user.dob
                ? new Date(user.dob).toISOString()
                : "2020-07-16T07:08:15.261Z",
              email: user.email.split("@").join(`+${user.brand}@`),
              identificationType: "PASSPORT",
              identificationValue: "000000",
              firstName: user.first_name,
              lastName: user.last_name,
              middleName: "",
              // phone: phone,
            },
            metadata: {
              userBrand: user.brand,
              userInternalId: user._id,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "x-account-holder-id": MAIN_ACCOUNT_HOLDER_ID,
            },
          }
        )
        .then(async (res) => {
          accountHolderId = res?.data?.accountHolderId;
          linkedClientId = res.data.id;
        })
        .catch((err) => {
          console.error("error", err.response);
        });
    }

    const internalAccountId = await openpaydAxios
      .post(
        "/accounts",
        {
          currency: account.currency,
          friendlyName: `${user.brand} - ${user.first_name} ${user.last_name} ${account.login_id}`, //loginID
          domestic: false,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-account-holder-id": accountHolderId,
          },
        }
      )
      .then((res) => res.data.internalAccountId);

    // Save to DB
    await OpenpaydLinkedAccountModel.create({
      userId: user._id,
      accountId: account,
      linkedClientId: linkedClientId,
      openpaydAccountId: internalAccountId,
      accountHolderId: accountHolderId,
    });

    return openpaydService.getOpenpaydAccount(account._id);
  },
  getAccountById: async (accountId, accountHolderId) => {
    let accessToken;
    accessToken = await openpaydService.getAccessToken().then((res) => {
      return res.access_token;
    });

    let res = await openpaydAxios
      .get(`/bank-accounts?internalAccountId=${accountId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-ACCOUNT-HOLDER-ID": accountHolderId,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        return response.data;
      })
      .catch((err) => {
        console.error("error", err.response);
      });
    return res;
  },
  getAccountUntilNotPending: async (accountId, accountHolderId, retry = 0) => {
    let accessToken;
    accessToken = await openpaydService.getAccessToken().then((res) => {
      return res.access_token;
    });

    let res = await openpaydAxios
      .get(`/bank-accounts?internalAccountId=${accountId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-ACCOUNT-HOLDER-ID": accountHolderId,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        return response.data;
      })
      .catch((err) => {
        console.error("error", err.response);
      });
    if (res[0].status === "PENDING" && retry < 3) {
      return new Promise((res) => {
        setTimeout(() => {
          res(
            openpaydService.getAccountUntilNotPending(
              accountId,
              accountHolderId,
              retry + 1
            )
          );
        }, 1000);
      });
    }
    return res;
  },
};

export default openpaydService;
