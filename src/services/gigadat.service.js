import axios from "axios";
import {
  GIGADAT_ACCESS_TOKEN,
  GIGADAT_API_URL,
  GIGADAT_CAMPAIGN_ID,
  GIGADAT_SECRET_TOKEN,
} from "../config/envs";

const gigadatAxios = axios.create({
  baseURL: GIGADAT_API_URL,
  auth: {
    username: GIGADAT_ACCESS_TOKEN,
    password: GIGADAT_SECRET_TOKEN,
  },
  headers: {
    "content-type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  },
});

async function generateTokenWithdraw({
  userId,
  site,
  userIp,
  currency,
  amount,
  name,
  mobile,
  email,
}) {
  return gigadatAxios
    .post(`/api/payment-token/${GIGADAT_CAMPAIGN_ID}`, {
      userId,
      site,
      userIp,
      currency,
      amount,
      name,
      mobile,
      email,
      type: "ETO",
      hosted: false,
    })
    .then((res) => res.data);
}

async function initializeWithdraw({ token, transactionId }) {
  return gigadatAxios
    .post(
      `/webflow`,
      {
        token,
      },
      {
        params: {
          transaction: transactionId,
        },
      }
    )
    .then((res) => res.data);
}

async function finalizeWithdraw({ token, transactionId }) {
  return gigadatAxios
    .get(`/webflow/deposit`, {
      params: {
        token,
        transaction: transactionId,
      },
    })
    .then((res) => res.data);
}

const gigadatService = {
  getTransactionDetails: async (transactionId) => {
    return gigadatAxios
      .get(`/api/transactions/${transactionId}`)
      .then((res) => res.data);
  },
  withdraw: async ({ gigadatTransactionId, preciseAmount, currency }) => {
    const { data: userDetails } = await gigadatService.getTransactionDetails(
      gigadatTransactionId
    );

    const { token } = await generateTokenWithdraw({
      userId: userDetails.userId,
      site: userDetails.site,
      userIp: userDetails.userIp,
      amount: preciseAmount,
      currency: currency,
      name: userDetails.name,
      mobile: userDetails.mobile,
      email: userDetails.email,
    });

    await initializeWithdraw({ token, transactionId: gigadatTransactionId });
    const result = await finalizeWithdraw({
      token,
      transactionId: gigadatTransactionId,
    });
    if (result.status === "STATUS_INITED") {
      return true;
    }
    return false;
  },
};

export default gigadatService;
