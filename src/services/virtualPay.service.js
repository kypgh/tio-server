import axios from "axios";
import jsSHA from "jssha";
import {
  HOST_URL,
  PIX_MEMBERS_AREA_URL,
  VIRTUAL_PAY_PIX_API_KEY,
  VIRTUAL_PAY_PIX_API_URL,
  VIRTUAL_PAY_PIX_MERCHANT_ID,
  VIRTUAL_PAY_PIX_PRIVATE_KEY,
} from "../config/envs";

const vpAxios = axios.create({
  baseURL: VIRTUAL_PAY_PIX_API_URL,
});

function generateChecksum({ requestId, merchantId, amount, currency }) {
  let result = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
  result.update(requestId).update(merchantId).update(amount).update(currency);

  return result.getHash("B64");
}

const PIX_REDIRECT_URL = (accountId) =>
  new URL(
    `/transaction-history?accountId=${accountId}`,
    PIX_MEMBERS_AREA_URL
  ).toString();
const PIX_NOTIFICATION_URL = new URL(
  "/api/webhooks/virtualpay",
  HOST_URL
).toString();

const VirtualPayService = {
  // PRECISE AMOUNT IS REQUIRED (not in cents) use 2 decimals
  initiateTransactionPIX: async ({
    transactionId,
    accountId,
    first_name,
    last_name,
    email,
    city,
    country,
    amount,
    currency,
    postalCode = "",
    description = "",
  }) => {
    return {
      url: new URL(
        "/pg/vpcheckout/index.php",
        VIRTUAL_PAY_PIX_API_URL
      ).toString(),
      body: {
        MID: VIRTUAL_PAY_PIX_MERCHANT_ID,
        API_KEY: VIRTUAL_PAY_PIX_API_KEY,
        PRIVATE_KEY: VIRTUAL_PAY_PIX_PRIVATE_KEY,
        PAYMENT_TYPE: "Card",
        REDIRECT_URL: PIX_REDIRECT_URL(accountId),
        NOTIFICATION_URL: PIX_NOTIFICATION_URL,
        FIRST_NAME: first_name,
        LAST_NAME: last_name,
        REQUESTID: transactionId,
        EMAIL: email,
        AMOUNT: amount,
        CURRENCY: currency,
        DESCRIPTION: description,
        CITY: city,
        COUNTRY: country,
        "POSTAL CODE": postalCode,
        "STATE CODE": "",
        CHECKSUM: generateChecksum({
          amount,
          currency,
          merchantId: VIRTUAL_PAY_PIX_MERCHANT_ID,
          requestId: transactionId,
        }),
      },
    };
    return {
      url: new URL(
        "/pg/vpcheckout/index.php",
        VIRTUAL_PAY_PIX_API_URL
      ).toString(),
      body: await vpAxios.post(
        "/pg/vpcheckout/index.php",
        {
          MID: VIRTUAL_PAY_PIX_MERCHANT_ID,
          API_KEY: VIRTUAL_PAY_PIX_API_KEY,
          PRIVATE_KEY: VIRTUAL_PAY_PIX_PRIVATE_KEY,
          PAYMENT_TYPE: "Card",
          REDIRECT_URL: PIX_REDIRECT_URL(accountId),
          NOTIFICATION_URL: PIX_NOTIFICATION_URL,
          FIRST_NAME: "Stefanos", //first_name,
          LAST_NAME: "Andreas Mitsi", //last_name,
          REQUESTID: transactionId,
          EMAIL: email,
          AMOUNT: amount,
          CURRENCY: currency,
          DESCRIPTION: description,
          CITY: city,
          COUNTRY: country,
          "POSTAL CODE": postalCode,
          "STATE CODE": "",
          CHECKSUM: generateChecksum({
            amount,
            currency,
            merchantId: VIRTUAL_PAY_PIX_MERCHANT_ID,
            requestId: transactionId,
          }),
        },
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      ),
    };
  },
};

export const VP_RESPONSE_CODES = [
  {
    code: "-1",
    message: "Unpaid transaction",
  },
  {
    code: "0",
    message: "Successfully Authenticated or Authorized",
  },
  {
    code: "01",
    message: "Pending Completion",
  },
  {
    code: "1",
    message: "Payment Failed",
  },
  {
    code: "13",
    message: "Failed void",
  },
  {
    code: "30",
    message: "Payment reference number is missing",
  },
  {
    code: "79",
    message: "Invalid Currency",
  },
  {
    code: "51",
    message: "Insufficient funds",
  },
  {
    code: "57",
    message: "Do not honor",
  },
  {
    code: "72",
    message: "Payment reference number is incorrect",
  },
  {
    code: "73",
    message: "Cancelled invoice",
  },
  {
    code: "91",
    message: "Issuer not available",
  },
  {
    code: "80",
    message: "Could not update balance",
  },
  {
    code: "52",
    message: "Dormant account",
  },
  {
    code: "32",
    message: "No debits",
  },
  {
    code: "11",
    message: "Invalid GL or bank account",
  },
  {
    code: "12",
    message: "Invalid offset branch code",
  },
  {
    code: "13",
    message: "Image not available for customer",
  },
  {
    code: "14",
    message: "Error occurred while processing utilization transaction",
  },
  {
    code: "15",
    message: "Account to same account transfer not allowed",
  },
  {
    code: "61",
    message: "Limit Exceeded",
  },
  {
    code: "101",
    message: "Missing Field",
  },
  {
    code: "102",
    message: "Invalid Data / Card",
  },
  {
    code: "104",
    message: "Duplicate Merchant Reference Code",
  },
  {
    code: "110",
    message: "Partial Approval",
  },
  {
    code: "150",
    message: "System error",
  },
  {
    code: "151",
    message: "Authorization timeout",
  },
  {
    code: "200",
    message: "Acquirer declined",
  },
  {
    code: "201",
    message: "Issuer declined",
  },
  {
    code: "202",
    message: "Expired card",
  },
  {
    code: "203",
    message: "Declined Card",
  },
  {
    code: "204",
    message: "Insufficient Funds",
  },
  {
    code: "205",
    message: "Stolen / lost card",
  },
  {
    code: "207",
    message: "Issuer Unreachable",
  },
  {
    code: "208",
    message: "Invalid Transaction Type",
  },
  {
    code: "209",
    message: "Invalid CVN",
  },
  {
    code: "210",
    message: "Over Credit Limit",
  },
  {
    code: "211",
    message: "Invalid CVN",
  },
  {
    code: "213",
    message: "Watchlisted Account",
  },
  {
    code: "221",
    message: "Payment Under Review",
  },
  {
    code: "231",
    message: "Decline - Invalid account number",
  },
  {
    code: "232",
    message: "Processor Declined",
  },
  {
    code: "236",
    message: "Processor Failure",
  },
  {
    code: "237",
    message: "Reversed Transaction",
  },
  {
    code: "238",
    message: "Duplicate Authorization",
  },
  {
    code: "239",
    message: "Invalid Amount",
  },
  {
    code: "240",
    message: "Invalid Card Type",
  },
  {
    code: "243",
    message: "Settled / Reversed Transaction",
  },
  {
    code: "244",
    message: "Invalid Account",
  },
  {
    code: "247",
    message: "Voided Transaction",
  },
  {
    code: "478",
    message: "Customer Authentication Required",
  },
  {
    code: "520",
    message: "Declined by Decision Manager",
  },
  {
    code: "263",
    message: "Request in Progress",
  },
  {
    code: "256",
    message: "Over the limit",
  },
  {
    code: "252",
    message: "Invalid Card",
  },
];

export default VirtualPayService;
