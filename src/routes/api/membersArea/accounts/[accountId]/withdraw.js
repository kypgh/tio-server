import { RequestHandler } from "express";
import Joi from "joi";
import { countryDataCodes } from "../../../../../config/countries";
import {
  CRYPTO_CURRENCIES,
  CURRENCIES,
} from "../../../../../config/currencies";
import { WITHDRAWAL_METHODS } from "../../../../../config/enums";
import { isMembersAreaUser } from "../../../../../middleware/membersArea.middleware";
import userAccountsService from "../../../../../services/userAccounts.service";
import userLogsService from "../../../../../services/userLogs.service";
import usersService from "../../../../../services/users.service";
import userTransactionsService from "../../../../../services/userTransactions.service";
import {
  bicSwiftValidation,
  mongooseIDFunction,
} from "../../../../../utils/customValidation";
import { hasAccessToAccount } from "../../../../../middleware/hasAccessToAccount";
import emailService from "../../../../../services/email.service";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const account = req.userAccount;
  const refundableBalance =
    await userTransactionsService.getAccountRefundableBalances(account._id);
  res.status(200).json({ balanceBeforeWire: refundableBalance });
};

const userRequestsWithdrawalSchema = Joi.object({
  accountId: Joi.string().custom(mongooseIDFunction).required(),
  amount: Joi.number().min(0).required(),
  // currency: Joi.string()
  //   .valid(...CURRENCIES)
  //   .required(),
}).unknown(true);

const fiatWithdrawalSchema = Joi.object({
  bank_details: Joi.object({
    bank_address: Joi.string().required(),
    account_name: Joi.string().required(),
    bank_name: Joi.string().required(),
    account_number: Joi.string().required(),
    bic_swift: Joi.string().custom(bicSwiftValidation).required(),
    iban: Joi.string().required(),
    country: Joi.string()
      .uppercase()
      .valid(
        ...countryDataCodes.map((val) => val.iso2.toUpperCase()),
        "Invalid Country code"
      )
      .required(),
  }),
}).unknown(true);

const cryptoWithdrawalSchema = Joi.object({
  crypto_details: Joi.object({
    address: Joi.string().required(),
  }).required(),
  password: Joi.string().required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = userRequestsWithdrawalSchema.validate({
    ...req.body,
    ...req.query,
  });
  if (error) {
    res.status(400).json(error);
    return;
  }
  const account = req.userAccount;
  if (account.environment_type === "demo") {
    res.status(409).json({ message: "Demo accounts cannot withdraw" });
    return;
  }
  let isCrypto = CRYPTO_CURRENCIES.includes(account.currency);
  if (isCrypto) {
    const cryptoBody = cryptoWithdrawalSchema.validate(req.body);
    if (cryptoBody.error) {
      res.status(400).json(cryptoBody.error);
      return;
    }
    const isValidPassword = await usersService.checkUserPassword(
      req.user,
      cryptoBody.value.password
    );
    if (!isValidPassword) {
      res.status(403).json({ message: "Invalid password" });
      return;
    }
    const { request, transaction } =
      await userTransactionsService.withdrawRequest({
        user: req.user,
        account: account,
        amount: value.amount,
        requestedCurrency: account.currency,
        details: cryptoBody.value.crypto_details,
      });
    await userLogsService.USER_ACTIONS.withdrawalRequest(
      req.user,
      transaction,
      account,
      request
    );

    res.status(200).json({ transaction });
  } else {
    const fiatBody = fiatWithdrawalSchema.validate(req.body);
    if (fiatBody.error) {
      res.status(400).json(fiatBody.error);
      return;
    }
    const { request, transaction } =
      await userTransactionsService.withdrawRequest({
        user: req.user,
        account: account,
        amount: value.amount,
        requestedCurrency: account.currency,
        details: fiatBody.value.bank_details,
      });
    await userLogsService.USER_ACTIONS.withdrawalRequest(
      req.user,
      transaction,
      account,
      request
    );

    await emailService.requestAcknowledgementEmail({
      user: req.user,
      request,
    });

    res.status(200).json({ transaction });
  }
};

export default {
  middleware: {
    all: [isMembersAreaUser, hasAccessToAccount],
  },
};
