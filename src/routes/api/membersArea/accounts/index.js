import Joi from "joi";
import {
  TIO_BRANDS,
  TIO_PLATFORMS,
  TRADE_SERVERS,
  getRealServer,
} from "../../../../config/enums";
import errorCodes from "../../../../config/errorCodes";
import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import userAccountsService from "../../../../services/userAccounts.service";
import { RequestHandler } from "express";
import ctraderService from "../../../../services/ctrader.service";
import usersService from "../../../../services/users.service";
import {
  CURRENCIES,
  MT4_CURRENCIES,
  MT5_CURRENCIES,
} from "../../../../config/currencies";
import { CTRADER_ACCOUNT_TYPES } from "../../../../config/accountTypes";
import { CTRADER_LEVERAGES } from "../../../../config/leverages";
import mt5Service from "../../../../services/mt5.service";
import emailService from "../../../../services/email.service";
import mt4Service, {
  createMt4AccountRandomPassword,
} from "../../../../services/mt4.service";

const maGetUserAccountsSchema = Joi.object({
  environment_type: Joi.string().valid("live", "demo"),
  archived: Joi.boolean().default(false),
});

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = maGetUserAccountsSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ ...error, ...errorCodes.queryValidation });
  }

  let accounts;
  if (value.archived) {
    accounts = await userAccountsService.getUserArchivedAccounts(req.user);
  } else {
    accounts = await userAccountsService.getUserAccounts(req.user, value);
  }

  accounts = accounts.map((account) => {
    account.server = getRealServer(account.server);
    return account;
  });

  res.status(200).json({ accounts });
};

const maCreateUserAccountSchema = Joi.object({
  platform: Joi.string()
    .valid(...Object.values(TIO_PLATFORMS))
    .required(),
}).unknown(true);

const createCtraderAccountSchema = Joi.object({
  currency: Joi.string()
    .trim()
    .valid(...CURRENCIES)
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
}).unknown(true);

const createMt5AccountSchema = Joi.object({
  currency: Joi.string()
    .trim()
    .valid(...MT5_CURRENCIES)
    .required(),
  account_type: Joi.string()
    .valid("standard", "vip", "vipblack", "spreadOnly", "copyTrading")
    .required(),
  leverage: Joi.number()
    .integer()
    .valid(50, 100, 200, 300, 400, 500)
    .required(),
  environment_type: Joi.string().valid("live", "demo").required(),
}).unknown(true);

const createMt4AccountSchema = Joi.object({
  currency: Joi.string()
    .trim()
    .valid(...MT4_CURRENCIES)
    .required(),
  account_type: Joi.string()
    .valid("standard", "spread", "vip", "vipblack")
    .required(),
  leverage: Joi.number()
    .integer()
    .valid(50, 100, 200, 300, 400, 500)
    .required(),
  environment_type: Joi.string().valid("live", "demo").required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = maCreateUserAccountSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
  }
  let user = await usersService.getUser(req.user._id);
  if (user.brand === TIO_BRANDS.TIO) {
    if (value.platform === TIO_PLATFORMS.ctrader) {
      const { value, error } = createCtraderAccountSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
      }
      if (!req.user.ctrader_id) {
        const ctraderUser = await ctraderService(
          value.environment_type === "live"
            ? TRADE_SERVERS.TIO_CTRADER_LIVE_1
            : TRADE_SERVERS.TIO_CTRADER_DEMO_1
        ).createUser({
          email: user.email,
          firstName: user.first_name,
          preferredLanguage: user.language,
          brand: user.brand,
        });
        user = await usersService.addCtraderId(user, ctraderUser.userId);
      }
      const account = await userAccountsService.createCtraderAccount({
        user: user,
        leverage: value.leverage,
        environment_type: value.environment_type,
        account_type: value.account_type,
        currency: value.currency,
      });
      return res.status(201).json({ account });
    }
    if (value.platform === TIO_PLATFORMS.mt5) {
      const { value, error } = createMt5AccountSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
      }
      if (!user.mt5_id) {
        const mt5UserId = await mt5Service.createUser(user);
        user = await usersService.addMt5Id(user, mt5UserId);
      }
      const randomPassword = mt5Service.createAccountRandomPassword();
      const account = await userAccountsService.createMt5Account({
        user: user,
        currency: value.currency,
        leverage: value.leverage,
        environment_type: value.environment_type,
        account_type: value.account_type,
        password: randomPassword,
      });
      await emailService
        .mt5AccountConfirmationEmail({
          user: user,
          account,
          password: randomPassword,
        })
        .catch((err) => console.error(err));
      return res.status(201).json({ account });
    }
    if (value.platform === TIO_PLATFORMS.mt4) {
      const { value, error } = createMt4AccountSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
      }
      const randomPassword = createMt4AccountRandomPassword();
      const account = await userAccountsService.createMt4Account({
        user: user,
        currency: value.currency,
        leverage: value.leverage,
        environment_type: value.environment_type,
        account_type: value.account_type,
        password: randomPassword,
      });
      await emailService
        .mt4AccountConfirmationEmail({
          user: user,
          account,
          password: randomPassword,
        })
        .catch((err) => console.error(err));
      return res.status(201).json({ account });
    }
    return res.status(400).json({ error: "Platform not supported" });
  } else if (user.brand === TIO_BRANDS.PIX) {
    if (value.platform === TIO_PLATFORMS.ctrader) {
      const { value, error } = createCtraderAccountSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
      }
      if (!req.user.ctrader_id) {
        const ctraderUser = await ctraderService(
          value.environment_type === "live"
            ? TRADE_SERVERS.TIO_CTRADER_LIVE_1
            : TRADE_SERVERS.TIO_CTRADER_DEMO_1
        ).createUser({
          email: user.email,
          firstName: user.first_name,
          preferredLanguage: user.language,
          brand: user.brand,
        });
        user = await usersService.addCtraderId(user, ctraderUser.userId);
      }
      const account = await userAccountsService.createCtraderAccount({
        user: user,
        leverage: value.leverage,
        environment_type: value.environment_type,
        account_type: value.account_type,
        currency: value.currency,
      });
      return res.status(201).json({ account });
    } else {
      return res.status(400).json({ error: "Platform not supported" });
    }
  } else {
    return res.status(500).json({ message: "User brand not supported" });
  }
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
