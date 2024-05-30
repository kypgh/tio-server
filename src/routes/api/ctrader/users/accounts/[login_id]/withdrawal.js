import { RequestHandler } from "express";
import Joi from "joi";
import { countryDataCodes } from "../../../../../../config/countries";
import { WITHDRAWAL_METHODS } from "../../../../../../config/enums";
import errorCodes from "../../../../../../config/errorCodes";
import {
  userIsLoggedIn,
  userOwnsAccount,
} from "../../../../../../middleware/user.middleware";
import userLogsService from "../../../../../../services/userLogs.service";
import usersService from "../../../../../../services/users.service";
import userTransactionsService from "../../../../../../services/userTransactions.service";
import { bicSwiftValidation } from "../../../../../../utils/customValidation";
import HTTPError from "../../../../../../utils/HTTPError";

const userRequestsWithdrawalSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(WITHDRAWAL_METHODS))
    .required(),
  amount: Joi.number().min(10).cast("string").required(),
  bank_details: Joi.when("type", {
    is: WITHDRAWAL_METHODS.fiat,
    then: Joi.object({
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
    otherwise: Joi.optional(),
  }),
  skrillEmail: Joi.when("type", {
    is: WITHDRAWAL_METHODS.fiat,
    then: Joi.string().email(),
    otherwise: Joi.optional(),
  }),
  netellerEmail: Joi.when("type", {
    is: WITHDRAWAL_METHODS.fiat,
    then: Joi.string().email(),
    otherwise: Joi.optional(),
  }),
  crypto_details: Joi.when("type", {
    is: WITHDRAWAL_METHODS.crypto,
    then: Joi.object({
      address: Joi.string().required(),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
  password: Joi.when("type", {
    is: WITHDRAWAL_METHODS.crypto,
    then: Joi.object({
      address: Joi.string().required(),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  if (req.userAccount.environment_type === "demo") {
    throw new HTTPError(
      "Cannot withdraw from demo account",
      400,
      errorCodes.cannotWithdrawFromDemoAccount
    );
  }

  const { value, error } = userRequestsWithdrawalSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...errorCodes.bodyValidation,
      ...error,
    });
  }
  if (value.type === "crypto") {
    const isValidPassword = await usersService.checkUserPassword(
      req.user,
      value.password
    );
    if (!isValidPassword) {
      throw new HTTPError(
        "Invalid password",
        403,
        errorCodes.invalidUserPassword
      );
    }
  }
  let details = {};
  if (value.type === "fiat") {
    if (value.bank_details) {
      details = value.bank_details;
    }
    if (value.skrillEmail) details.skrillEmail = value.skrillEmail;
    if (value.netellerEmail) details.netellerEmail = value.netellerEmail;
  } else {
    details = value.crypto_details;
  }
  const { account, request, transaction } =
    await userTransactionsService.withdrawRequest({
      user: req.user,
      account: req.userAccount,
      type: value.type,
      amount: value.amount,
      details,
      requestedCurrency: req.userAccount.currency,
    });
  await userLogsService.USER_ACTIONS.withdrawalRequest(
    req.user,
    transaction,
    account,
    request
  );
  res.status(200).json({ transaction });
};

export default {
  middleware: {
    all: [userIsLoggedIn, userOwnsAccount],
  },
};
