import sgMail from "@sendgrid/mail";
import { ENV, SENDGRID_API_KEY } from "../config/envs";
import TIOmt5AccountCreationEmailData from "../emails/TIO_mt5AccountCreationEmailData";

import TIOEmailVerifyEmailData from "../emails/TIO_emailVerifyEmailData";
import TIOforgotPasswordMembersAreaEmailData from "../emails/TIO_forgotPasswordMembersAreaEmailData";
import PIXEmailVerifyEmailData from "../emails/PIX_emailVerifyEmailData";
import PIXforgotPasswordMembersAreaEmailData from "../emails/PIX_forgotPasswordMembersAreaEmailData";
import TIOforgotMt5AccountPasswordEmailData from "../emails/TIO_forgotMt5AccountPasswordEmailData";

import TIOaccountKYCVerifiedEmailData from "../emails/TIO_accountKYCVerifiedEmailData";
import PIXaccountKYCVerifiedEmailData from "../emails/PIX_accountKYCVerifiedEmailData";
import TIOuploadKYCDocuments from "../emails/TIO_uploadKYCDocuments";
import TIOwithdrawalEmailProcessed from "../emails/TIO_withdrawalEmailProcessed";
import Tio_requestAknowledgeEmail from "../emails/TIO_requestAcknowledgedEmail";
import Tio_requestApproveEmail from "../emails/TIO_requestApproveEmail";
import Tio_requestDeclineEmail from "../emails/TIO_requestDeclineEmail";
import Tio_reminderEmails from "../emails/TIO_KYCNotifications";

import {
  TIO_BRANDS,
  USER_REQUEST_TYPES,
  USER_REQUEST_TYPES_READABLE,
  getRealServer,
} from "../config/enums";
import {
  PIX_DOWNLOAD_PLATFORM_PAGE,
  PIX_MA_DEPOSITS_PAGE,
  PIX_MA_OPEN_LIVE_ACCOUNT_PAGE,
  PIX_MA_RESET_PASSWORD_PAGE,
  PIX_MA_VERIFY_EMAIL_PAGE,
  TIO_DOWNLOAD_PLATFORM_PAGE,
  TIO_MA_DEPOSITS_PAGE,
  TIO_MA_OPEN_LIVE_ACCOUNT_PAGE,
  TIO_MA_RESET_PASSWORD_PAGE,
  TIO_MA_VERIFY_EMAIL_PAGE,
} from "../config/urls";
import { DateTime } from "luxon";
import userRequestsService from "./userRequests.service";

sgMail.setApiKey(SENDGRID_API_KEY);

const tioFrom = {
  email: "info@tiomarkets.com",
  name: "TIOmarkets",
};

const pixFrom = {
  email: "info@primeindex.com",
  name: "PrimeIndex",
};

const bccForTest = (email) =>
  ["staging", "development"].includes(ENV) &&
  email !== "themis.p@tiomarkets.com"
    ? ["themis.p@tiomarkets.com"]
    : [];

async function requestToText(requestId) {
  const result = await userRequestsService._getDetailedRequestByIdWithoutCheck(
    requestId
  );
  if (result.request.request_type === USER_REQUEST_TYPES.deleteAccount) {
    const { request, account } = result;
    return `Delete account request.<br/>Platform: <b>${String(
      account.platform
    ).toUpperCase()}</b><br/>LoginId: <b>${
      account.login_id
    }</b><br/>Environment: <b>${account.environment_type}</b><br/>Reason: ${
      request.metadata.description
    }`;
  } else if (
    result.request.request_type === USER_REQUEST_TYPES.withdrawFromAccount
  ) {
    const { request, account, transaction, depositMethods } = result;
    return `Withdraw ${transaction.amount} ${transaction.currency} from account ${account.platform} ${account.login_id}`;
  } else if (
    result.request.request_type === USER_REQUEST_TYPES.changeAccountLeverage
  ) {
    const { request, account } = result;
    return `Change Leverage of account ${account.platform} ${account.login_id} from 1:${account.leverage} to 1:${request.metadata.leverage}`;
  } else if (
    result.request.request_type ===
    USER_REQUEST_TYPES.transferFundsBetweenAccounts
  ) {
    return "";
  } else if (
    result.request.request_type === USER_REQUEST_TYPES.depositCryptoToAccount
  ) {
    return "";
  } else {
    return "";
  }
}

const emailService = {
  mt5AccountConfirmationEmail: async ({ user, account, password }) => {
    const { templateId, dynamicTemplateData } = TIOmt5AccountCreationEmailData(
      user.language,
      {
        full_name: user.first_name + " " + user.last_name,
        account_number: account.login_id,
        password,
        platform: account.platform,
        branch: user.entity,
        account_type: account.account_type,
        currency: account.currency,
        leverage:
          user.entity !== "TIOUK" || user.epc_status === 2
            ? account.leverage
            : "",
        server: getRealServer(account.server),
        company_name: "TIOmarkets",
        year: new Date().getFullYear(),
        support_email: "support@tiomarkets.com",
        epc_status: user.epc_status,
        transfer_funds_cta: TIO_MA_DEPOSITS_PAGE,
        email: user.email,
      }
    );
    try {
      await sgMail.send({
        to: [user.email],
        from: tioFrom,
        bcc: bccForTest(user.email),
        templateId,
        dynamicTemplateData,
      });
      return true;
    } catch (error) {
      console.error(
        typeof error.toJSON === "function" ? error.toJSON() : error
      );
      return false;
    }
  },
  mt4AccountConfirmationEmail: async ({ user, account, password }) => {
    const { templateId, dynamicTemplateData } = TIOmt5AccountCreationEmailData(
      user.language,
      {
        full_name: user.first_name + " " + user.last_name,
        account_number: account.login_id,
        password,
        platform: account.platform,
        branch: user.entity,
        account_type: account.account_type,
        currency: account.currency,
        leverage:
          user.entity !== "TIOUK" || user.epc_status === 2
            ? account.leverage
            : "",
        server: getRealServer(account.server),
        company_name: "TIOmarkets",
        year: new Date().getFullYear(),
        support_email: "support@tiomarkets.com",
        epc_status: user.epc_status,
        transfer_funds_cta: TIO_MA_DEPOSITS_PAGE,
        email: user.email,
      }
    );
    try {
      await sgMail.send({
        to: [user.email],
        from: tioFrom,
        bcc: bccForTest(user.email),
        templateId,
        dynamicTemplateData,
      });
      return true;
    } catch (error) {
      console.error(
        typeof error.toJSON === "function" ? error.toJSON() : error
      );
      return false;
    }
  },
  forgotMT4AccountPasswordEmail: async ({ user, account, password }) => {
    const { templateId, dynamicTemplateData } =
      TIOforgotMt5AccountPasswordEmailData(user.language, {
        full_name: user.first_name + " " + user.last_name,
        account_number: account.login_id,
        new_password: password,
        platform: account.platform,
        branch: user.entity,
        account_type: account.account_type,
        currency: account.currency,
        leverage:
          user.entity !== "TIOUK" || user.epc_status === 2
            ? account.leverage
            : "",
        server: getRealServer(account.server),
        company_name: "TIOmarkets",
        year: new Date().getFullYear(),
        support_email: "support@tiomarkets.com",
        epc_status: user.epc_status,
        ma_url: "https://clients.tiomarkets.com",
        email: user.email,
      });
    try {
      await sgMail.send({
        to: [user.email],
        from: tioFrom,
        bcc: bccForTest(user.email),
        templateId,
        dynamicTemplateData,
      });
      return true;
    } catch (error) {
      console.error(
        typeof error.toJSON === "function" ? error.toJSON() : error
      );
      return false;
    }
  },
  forgotMT5AccountPasswordEmail: async ({ user, account, password }) => {
    const { templateId, dynamicTemplateData } =
      TIOforgotMt5AccountPasswordEmailData(user.language, {
        full_name: user.first_name + " " + user.last_name,
        account_number: account.login_id,
        new_password: password,
        platform: account.platform,
        branch: user.entity,
        account_type: account.account_type,
        currency: account.currency,
        leverage:
          user.entity !== "TIOUK" || user.epc_status === 2
            ? account.leverage
            : "",
        server: getRealServer(account.server),
        company_name: "TIOmarkets",
        year: new Date().getFullYear(),
        support_email: "support@tiomarkets.com",
        epc_status: user.epc_status,
        ma_url: "https://clients.tiomarkets.com",
        email: user.email,
      });
    try {
      await sgMail.send({
        to: [user.email],
        from: tioFrom,
        bcc: bccForTest(user.email),
        templateId,
        dynamicTemplateData,
      });
      return true;
    } catch (error) {
      console.error(
        typeof error.toJSON === "function" ? error.toJSON() : error
      );
      return false;
    }
  },
  forgotPasswordEmailMembersArea: async ({ user, resetPasswordToken }) => {
    if (user.brand === TIO_BRANDS.TIO) {
      const { templateId, dynamicTemplateData } =
        TIOforgotPasswordMembersAreaEmailData(user.language, {
          full_name: user.first_name + " " + user.last_name,
          reset_password_link: TIO_MA_RESET_PASSWORD_PAGE(resetPasswordToken),
          company_name: "TIOmarkets",
          support_email: "support@tiomarkets.com",
          year: new Date().getFullYear(),
        });
      try {
        await sgMail.send({
          to: [user.email],
          from: tioFrom,
          bcc: bccForTest(user.email),
          templateId,
          dynamicTemplateData,
        });
        return true;
      } catch (error) {
        console.error(
          typeof error.toJSON === "function" ? error.toJSON() : error
        );
        return false;
      }
    } else if (user.brand === TIO_BRANDS.PIX) {
      const { templateId, dynamicTemplateData } =
        PIXforgotPasswordMembersAreaEmailData(user.language, {
          full_name: user.first_name + " " + user.last_name,
          reset_password_link: PIX_MA_RESET_PASSWORD_PAGE(resetPasswordToken),
          company_name: "PrimeIndex",
          support_email: "support@primeindex.com",
          year: new Date().getFullYear(),
        });
      try {
        await sgMail.send({
          to: [user.email],
          from: pixFrom,
          bcc: bccForTest(user.email),
          templateId,
          dynamicTemplateData,
        });
        return true;
      } catch (error) {
        console.error(
          typeof error.toJSON === "function" ? error.toJSON() : error
        );
        return false;
      }
    } else {
      console.error("EMAIL ERROR - BRAND NOT FOUND");
    }
  },
  emailVerifyEmail: async ({ user, verifyEmailToken }) => {
    if (user.brand === TIO_BRANDS.TIO) {
      const { templateId, dynamicTemplateData } = TIOEmailVerifyEmailData(
        user.language,
        {
          full_name: user.first_name + " " + user.last_name,
          email_verification_url: TIO_MA_VERIFY_EMAIL_PAGE(verifyEmailToken),
          company_name: "TIOmarkets",
          support_email: "support@tiomarkets.com",
          year: new Date().getFullYear(),
        }
      );
      try {
        await sgMail.send({
          to: [user.email],
          from: tioFrom,
          bcc: bccForTest(user.email),
          templateId,
          dynamicTemplateData,
        });
        return true;
      } catch (error) {
        console.error(
          typeof error.toJSON === "function" ? error.toJSON() : error
        );
        return false;
      }
    } else if (user.brand === TIO_BRANDS.PIX) {
      const { templateId, dynamicTemplateData } = PIXEmailVerifyEmailData(
        user.language,
        {
          full_name: user.first_name + " " + user.last_name,
          email_verification_url: PIX_MA_VERIFY_EMAIL_PAGE(verifyEmailToken),
          company_name: "PrimeIndex",
          support_email: "support@primeindex.com",
          year: new Date().getFullYear(),
        }
      );
      try {
        await sgMail.send({
          to: [user.email],
          from: pixFrom,
          bcc: bccForTest(user.email),
          templateId,
          dynamicTemplateData,
        });
        return true;
      } catch (error) {
        console.error(
          typeof error.toJSON === "function" ? error.toJSON() : error
        );
        return false;
      }
    } else {
      console.error("EMAIL ERROR - BRAND NOT FOUND");
    }
  },
  kycApprovedEmail: async ({ user }) => {
    if (user.brand === TIO_BRANDS.TIO) {
      const { templateId, dynamicTemplateData } =
        TIOaccountKYCVerifiedEmailData(user.language, {
          full_name: user.first_name + " " + user.last_name,
          company_name: "TIOmarkets",
          support_email: "support@tiomarkets.com",
          year: new Date().getFullYear(),
          branch: user.branch,
          deposit_funds_url: TIO_MA_DEPOSITS_PAGE,
          download_platform_url: TIO_DOWNLOAD_PLATFORM_PAGE,
          open_live_account_url: TIO_MA_OPEN_LIVE_ACCOUNT_PAGE,
          support_email_tioeu: "support@tiomarkets.eu",
          tioeu_registration_date: DateTime.fromJSDate(
            new Date(user.createAt)
          ).toFormat("LLL dd, HH:mm", { locale: "en" }),
        });
      try {
        await sgMail.send({
          to: [user.email],
          from: tioFrom,
          bcc: bccForTest(user.email),
          templateId,
          dynamicTemplateData,
        });
        return true;
      } catch (error) {
        console.error(
          typeof error.toJSON === "function" ? error.toJSON() : error
        );
        return false;
      }
    } else if (user.brand === TIO_BRANDS.PIX) {
      const { templateId, dynamicTemplateData } =
        PIXaccountKYCVerifiedEmailData(user.language, {
          full_name: user.first_name + " " + user.last_name,
          company_name: "PrimeIndex",
          support_email: "support@primeindex.com",
          year: new Date().getFullYear(),
          deposit_funds_url: PIX_MA_DEPOSITS_PAGE,
          download_platform_url: PIX_DOWNLOAD_PLATFORM_PAGE,
          open_live_account_url: PIX_MA_OPEN_LIVE_ACCOUNT_PAGE,
        });
      try {
        await sgMail.send({
          to: [user.email],
          from: pixFrom,
          bcc: bccForTest(user.email),
          templateId,
          dynamicTemplateData,
        });
        return true;
      } catch (error) {
        console.error(
          typeof error.toJSON === "function" ? error.toJSON() : error
        );
        return false;
      }
    } else {
      console.error("EMAIL ERROR - BRAND NOT FOUND");
    }
  },
  kycUploadDocuments: async ({ user }) => {
    if (user.brand === TIO_BRANDS.TIO) {
      const { templateId, dynamicTemplateData } = TIOuploadKYCDocuments(
        user.language,
        {
          full_name: user.first_name + " " + user.last_name,
          company_name: "TIOmarkets",
          support_email: "support@tiomarkets.com",
          year: new Date().getFullYear(),
        }
      );
      try {
        await sgMail.send({
          to: [user.email],
          from: tioFrom,
          bcc: bccForTest(user.email),
          templateId,
          dynamicTemplateData,
        });
        return true;
      } catch (error) {
        console.error(
          typeof error.toJSON === "function" ? error.toJSON() : error
        );
        return false;
      }
    } else if (user.brand === TIO_BRANDS.PIX) {
      return true;
    }
  },
  withdrawalProcessedEmail: async ({ user, account, amount, currency }) => {
    if (user.brand === TIO_BRANDS.TIO) {
      const { templateId, dynamicTemplateData } = TIOwithdrawalEmailProcessed(
        user.language,
        {
          full_name: user.first_name + " " + user.last_name,
          company_name: "TIOmarkets",
          support_email: "support@tiomarkets.com",
          year: new Date().getFullYear(),
          accountLogin: account.login_id,
          amount: amount,
          currency: currency,
        }
      );
      try {
        await sgMail.send({
          to: [user.email],
          from: tioFrom,
          bcc: bccForTest(user.email),
          templateId,
          dynamicTemplateData,
        });
        return true;
      } catch (error) {
        console.error(
          typeof error.toJSON === "function" ? error.toJSON() : error
        );
        return false;
      }
    } else if (user.brand === TIO_BRANDS.PIX) {
      return true;
    }
  },
  requestAcknowledgementEmail: async ({ user, request }) => {
    if (user.brand === TIO_BRANDS.TIO) {
      const { templateId, dynamicTemplateData } = Tio_requestAknowledgeEmail(
        user.language,
        {
          full_name: user.first_name + " " + user.last_name,
          company_name: "TIOmarkets",
          support_email: "support@tiomarkets.com",
          year: new Date().getFullYear(),
          request_text: await requestToText(request._id),
          request_type: USER_REQUEST_TYPES_READABLE[request.request_type] ?? "",
        }
      );
      try {
        await sgMail.send({
          to: [user.email],
          from: tioFrom,
          bcc: bccForTest(user.email),
          templateId,
          dynamicTemplateData,
        });
        return true;
      } catch (error) {
        console.error(
          typeof error.toJSON === "function" ? error.toJSON() : error
        );
        return false;
      }
    } else if (user.brand === TIO_BRANDS.PIX) {
      return true;
    }
  },
  requestApproveEmail: async ({ user }) => {
    if (user.brand === TIO_BRANDS.TIO) {
      const { templateId, dynamicTemplateData } = Tio_requestApproveEmail(
        user.language,
        {
          full_name: user.first_name + " " + user.last_name,
          company_name: "TIOmarkets",
          support_email: "support@tiomarkets.com",
          year: new Date().getFullYear(),
        }
      );
      try {
        await sgMail.send({
          to: [user.email],
          from: tioFrom,
          bcc: bccForTest(user.email),
          templateId,
          dynamicTemplateData,
        });
        return true;
      } catch (error) {
        console.error(
          typeof error.toJSON === "function" ? error.toJSON() : error
        );
        return false;
      }
    } else if (user.brand === TIO_BRANDS.PIX) {
      return true;
    }
  },
  requestDeclineEmail: async ({ user }) => {
    if (user.brand === TIO_BRANDS.TIO) {
      const { templateId, dynamicTemplateData } = Tio_requestDeclineEmail(
        user.language,
        {
          full_name: user.first_name + " " + user.last_name,
          company_name: "TIOmarkets",
          support_email: "support@tiomarkets.com",
          year: new Date().getFullYear(),
        }
      );
      try {
        await sgMail.send({
          to: [user.email],
          from: tioFrom,
          bcc: bccForTest(user.email),
          templateId,
          dynamicTemplateData,
        });
        return true;
      } catch (error) {
        console.error(
          typeof error.toJSON === "function" ? error.toJSON() : error
        );
        return false;
      }
    } else if (user.brand === TIO_BRANDS.PIX) {
      return true;
    }
  },
  kycReminderEmail: async ({ user, days = 0 }) => {
    if (user.brand === TIO_BRANDS.TIO) {
      const { templateId, dynamicTemplateData } = Tio_reminderEmails(
        user.language,
        {
          days: days,
          full_name: user.first_name + " " + user.last_name,
          company_name: "TIOmarkets",
          support_email: "support@tiomarkets.com",
          year: new Date().getFullYear(),
        }
      );
      try {
        await sgMail.send({
          to: [user.email],
          from: tioFrom,
          bcc: bccForTest(user.email),
          templateId,
          dynamicTemplateData,
        });
        return true;
      } catch (error) {
        console.error(
          typeof error.toJSON === "function" ? error.toJSON() : error
        );
        return false;
      }
    } else if (user.brand === TIO_BRANDS.PIX) {
      return true;
    }
  },
};

export default emailService;
