import { RequestHandler } from "express";
import Joi from "joi";
import { CTRADER_ACCOUNT_TYPES } from "../../../../../config/accountTypes";
import {
  CTRADER_CURRENCIES,
  CURRENCIES,
} from "../../../../../config/currencies";
import { TIO_PLATFORMS } from "../../../../../config/enums";
import { CTRADER_LEVERAGES } from "../../../../../config/leverages";
import { userIsLoggedIn } from "../../../../../middleware/user.middleware";
import userAccountsService from "../../../../../services/userAccounts.service";
import userLogsService from "../../../../../services/userLogs.service";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  let result = await userAccountsService.getUserAccounts(req.user._id, {
    platform: TIO_PLATFORMS.ctrader,
  });
  res.status(200).json({ accounts: result });
};

const createCtraderAccountSchema = Joi.object({
  currency: Joi.string()
    .trim()
    .valid(...CTRADER_CURRENCIES)
    .required(),
  account_type: Joi.string()
    .valid(...CTRADER_ACCOUNT_TYPES.map((item) => item.name))
    .required(),
  leverage: Joi.when("account_type", {
    switch: Object.entries(CTRADER_LEVERAGES).map(([key, value]) => ({
      is: key,
      then: Joi.number()
        .integer()
        .min(1)
        .valid(...value)
        .required(),
    })),
    otherwise: Joi.invalid(),
  }),
  environment_type: Joi.string().valid("live", "demo").required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = createCtraderAccountSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ ...error.details, ...errorCodes.bodyValidation });
  }
  // Business logic
  let newAccount = await userAccountsService.createCtraderAccount({
    user: req.user,
    currency: value.currency,
    leverage: value.leverage,
    account_type: value.account_type,
    environment_type: value.environment_type,
  });
  await userLogsService.USER_ACTIONS.createAccount(req.user, newAccount);
  res.status(200).json({ account: newAccount });
};

export default {
  middleware: {
    all: [userIsLoggedIn],
  },
};
