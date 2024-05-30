import _ from "lodash";
import mongoose from "mongoose";
import { INNOVOULT_SUPPORTED_CURRENCIES } from "../config/currencies";
import {
  CTRADER_MAX_DEMO_ACCOUNTS,
  CTRADER_MAX_LIVE_ACCOUNTS,
  MT4_MAX_DEMO_ACCOUNTS,
  MT4_MAX_LIVE_ACCOUNTS,
  MT5_MAX_DEMO_ACCOUNTS,
  MT5_MAX_LIVE_ACCOUNTS,
  TIO_BRANDS,
  TIO_PLATFORMS,
  USER_KYC_STATUS,
} from "../config/enums";
import errorCodes from "../config/errorCodes";
import UserAccountsModel, {
  ACCOUNT_PROVIDER,
} from "../models/UserAccounts.model";
import HTTPError from "../utils/HTTPError";
import utilFunctions from "../utils/util.functions";
import ctraderService from "./ctrader.service";
import usersService from "./users.service";
import mt5Service, {
  MT5_ACCOUNT_RIGHTS_KEYS,
  mt5AccountRightsUtils,
} from "./mt5.service";
import helperFunctions from "../utils/helper.functions";
import { PAYMENT_GATEWAYS } from "../config/paymentGateways";
import mt4Service from "./mt4.service";
import Currency from "../utils/Currency";
import userTransactionsService from "./userTransactions.service";

const userAccountsService = {
  getAll: ({
    page = 1,
    limit = 50,
    environment_type = "live",
    user = null,
    brand,
    countryWhitelist,
  }) => {
    let filter = {
      archived: { $ne: true },
      environment_type,
      user,
    };
    filter = utilFunctions.pruneNullOrUndefinedFields(filter);
    return UserAccountsModel.paginate(filter, {
      page,
      limit,
      populate: {
        path: "user",
        select: "first_name last_name email",
      },
    });
  },
  getUserAccounts: (userId, { platform, environment_type } = {}) => {
    let filter = {
      archived: { $ne: true },
      user: userId,
      platform,
      environment_type,
    };
    filter = utilFunctions.pruneNullOrUndefinedFields(filter);
    return UserAccountsModel.find(filter).populate({
      path: "user",
      select: "first_name last_name email",
    });
  },
  getUserArchivedAccounts: (userId) => {
    let filter = {
      archived: { $eq: true },
      user: userId,
    };
    filter = utilFunctions.pruneNullOrUndefinedFields(filter);
    return UserAccountsModel.find(filter).populate({
      path: "user",
      select: "first_name last_name email",
    });
  },
  getCtraderAccounts: (userId) => {
    return UserAccountsModel.find({
      archived: { $ne: true },
      user: userId,
      platform: TIO_PLATFORMS.ctrader,
    });
  },
  getUserInnovoultAccounts: (userId) => {
    return UserAccountsModel.find({
      user: userId,
      archived: { $ne: true },
      currency: { $in: INNOVOULT_SUPPORTED_CURRENCIES },
      provider: { $in: [ACCOUNT_PROVIDER.INNOVOULT, ACCOUNT_PROVIDER.pending] },
    }).populate({
      path: "user",
      select: "first_name last_name email",
    });
  },
  getUserAccountById: (userId, accountId) => {
    return UserAccountsModel.findOne({ user: userId, _id: accountId }).populate(
      {
        path: "user",
        select: "first_name last_name email",
      }
    );
  },
  getAccountById: (accountId) => {
    return UserAccountsModel.findById(accountId).populate("user");
  },
  getAccountByIdAndBrand: (accountId, brand, allowedCountries) => {
    return UserAccountsModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(accountId) } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $match: {
                brand,
                ...(allowedCountries
                  ? { country: { $in: allowedCountries } }
                  : {}),
              },
            },
          ],
        },
      },
      { $unwind: "$user" },
    ]);
  },
  getUserAccountByLoginId: async (userId, loginId, server) => {
    const account = await UserAccountsModel.findOne({
      user: userId,
      login_id: loginId,
      server,
    }).populate({
      path: "user",
      select: "first_name last_name email",
    });
    if (!account) {
      return;
    }
    let res =
      typeof account?.toJSON === "function" ? account.toJSON() : account;
    utilFunctions.decimal2JSON(res);
    return res;
  },
  getUserMt5AccountByLoginId: async (loginId, env) => {
    const account = await UserAccountsModel.findOne({
      environment_type: env,
      login_id: loginId,
      platform: TIO_PLATFORMS.mt5,
    }).populate({
      path: "user",
      select: "first_name last_name email",
    });
    if (!account) {
      return;
    }
    let res =
      typeof account?.toJSON === "function" ? account.toJSON() : account;
    utilFunctions.decimal2JSON(res);
    return res;
  },
  getUserMt4AccountByLoginId: async (loginId, env) => {
    const account = await UserAccountsModel.findOne({
      environment_type: env,
      login_id: loginId,
      platform: TIO_PLATFORMS.mt4,
    }).populate({
      path: "user",
      select: "first_name last_name email",
    });
    if (!account) {
      return;
    }
    let res =
      typeof account?.toJSON === "function" ? account.toJSON() : account;
    utilFunctions.decimal2JSON(res);
    return res;
  },
  getUserAccountByTraderId: (traderId, environment_type) => {
    return UserAccountsModel.findOne({
      trader_id: traderId,
      environment_type,
    });
  },
  getStagingUserAccountByTraderId: (traderId, environment_type, brand) => {
    let server = helperFunctions.getAccountServer({
      platform: TIO_PLATFORMS.ctrader,
      brand,
      environment_type,
    });
    return UserAccountsModel.findOne({
      trader_id: traderId,
      server,
    });
  },
  getAccountDetails: async (accountId) => {
    let account = await UserAccountsModel.findOne({ _id: accountId }).populate({
      path: "user",
      select: "first_name last_name email brand country",
    });
    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    let details;
    let permissions = {
      enabled: false,
      enable_change_password: false,
      enable_send_reports: false,
      read_only: false,
    };
    if (account.platform === TIO_PLATFORMS.ctrader) {
      details = await ctraderService(account.server).getTraderAccountByLogin(
        account.login_id
      );
      permissions.enabled = details.accessRights !== "NO_LOGIN";
      permissions.enable_change_password = true;
      permissions.enable_send_reports = details.sendOwnStatement;
      permissions.read_only = ["CLOSE_ONLY", "NO_TRADING"].includes(
        details.accessRights
      );
    } else if (account.platform === TIO_PLATFORMS.mt5) {
      details = await mt5Service.getAccountDetails(account);
      permissions.enabled = mt5AccountRightsUtils.checkIfAccountHasRight(
        details.Rights,
        MT5_ACCOUNT_RIGHTS_KEYS.ENABLED
      );
      permissions.enable_change_password =
        mt5AccountRightsUtils.checkIfAccountHasRight(
          details.Rights,
          MT5_ACCOUNT_RIGHTS_KEYS.PASSWORD
        );
      permissions.enable_send_reports =
        mt5AccountRightsUtils.checkIfAccountHasRight(
          details.Rights,
          MT5_ACCOUNT_RIGHTS_KEYS.REPORTS
        );
      permissions.read_only = mt5AccountRightsUtils.checkIfAccountHasRight(
        details.Rights,
        MT5_ACCOUNT_RIGHTS_KEYS.TRADE_DISABLED
      );
    } else if (account.platform === TIO_PLATFORMS.mt4) {
      details = await mt4Service(account.server).getAccountByLoginId(
        account.login_id
      );
      permissions.enabled = details.enable;
      permissions.enable_change_password = details.enable_change_password;
      permissions.enable_send_reports = details.send_reports;
      permissions.read_only = details.enable_read_only;
    } else {
      throw new HTTPError(
        "Unsupported account platform for details request",
        501,
        { message: "Unsupported operation for account platform" }
      );
    }
    return { account, details, permissions };
  },
  createMt5Account: async ({
    user,
    currency,
    leverage,
    account_type,
    environment_type,
    password,
  }) => {
    if (user.brand === TIO_BRANDS.PIX) {
      throw new HTTPError("User not allowed to create MT5 account", 403, {
        message: "User not allowed to create MT5 account",
      });
    }
    if (!user.mt5_id) {
      throw new HTTPError(
        "User not allowed to create MT5 account needs mt5 user first",
        403,
        errorCodes.userDoesNotHaveMt5Account
      );
    }
    let countUserAccounts = await UserAccountsModel.countDocuments({
      user: user._id,
      platform: TIO_PLATFORMS.mt5,
      environment_type,
      archived: { $ne: true },
    });
    let maxAllowedAccounts =
      environment_type === "live"
        ? MT5_MAX_LIVE_ACCOUNTS
        : MT5_MAX_DEMO_ACCOUNTS;
    if (countUserAccounts >= maxAllowedAccounts) {
      throw new HTTPError(
        `User not allowed to create any more ${environment_type}-MT5 trader accounts (max: ${maxAllowedAccounts}).`,
        403,
        errorCodes.maxNumberOfTraderAccounts({
          platform: "MT5",
          env: environment_type,
        })
      );
    }
    const mt5_account = await mt5Service.createAccountAndLinkUser({
      password,
      user,
      leverage,
      currency,
      account_type,
      environment_type,
    });
    let permissions = await mt5Service.setAccountRights({
      login: String(mt5_account.Login),
      rights:
        user.flags.kycStatus === USER_KYC_STATUS.approved ||
        environment_type === "demo"
          ? [
              MT5_ACCOUNT_RIGHTS_KEYS.ENABLED,
              MT5_ACCOUNT_RIGHTS_KEYS.TRAILING,
              MT5_ACCOUNT_RIGHTS_KEYS.EXPERT,
              MT5_ACCOUNT_RIGHTS_KEYS.OTP_ENABLED,
              MT5_ACCOUNT_RIGHTS_KEYS.PASSWORD,
              MT5_ACCOUNT_RIGHTS_KEYS.REPORTS,
            ]
          : [
              MT5_ACCOUNT_RIGHTS_KEYS.ENABLED,
              MT5_ACCOUNT_RIGHTS_KEYS.TRAILING,
              MT5_ACCOUNT_RIGHTS_KEYS.EXPERT,
              MT5_ACCOUNT_RIGHTS_KEYS.OTP_ENABLED,
              MT5_ACCOUNT_RIGHTS_KEYS.PASSWORD,
              MT5_ACCOUNT_RIGHTS_KEYS.REPORTS,
              MT5_ACCOUNT_RIGHTS_KEYS.TRADE_DISABLED,
            ],
      environment_type,
    });
    return UserAccountsModel.create({
      user: user._id,
      platform: TIO_PLATFORMS.mt5,
      login_id: String(mt5_account.Login),
      account_type,
      group: mt5_account.Group,
      leverage,
      currency,
      balance: environment_type === "demo" ? 50000 : 0,
      equity: environment_type === "demo" ? 50000 : 0,
      free_margin: environment_type === "demo" ? 50000 : 0,
      used_margin: 0,
      environment_type,
      permissions,
      server: helperFunctions.getAccountServer({
        environment_type,
        platform: TIO_PLATFORMS.mt5,
        brand: user.brand,
      }),
    });
  },
  createMt4Account: async ({
    user,
    currency,
    leverage,
    account_type,
    environment_type,
    password,
  }) => {
    let countUserAccounts = await UserAccountsModel.countDocuments({
      user: user._id,
      platform: TIO_PLATFORMS.mt4,
      environment_type,
      archived: { $ne: true },
    });
    let maxAllowedAccounts =
      environment_type === "live"
        ? MT4_MAX_LIVE_ACCOUNTS
        : MT4_MAX_DEMO_ACCOUNTS;

    if (countUserAccounts >= maxAllowedAccounts) {
      throw new HTTPError(
        `User not allowed to create any more ${environment_type}-MT4 trader accounts (max: ${maxAllowedAccounts}).`,
        403,
        errorCodes.maxNumberOfTraderAccounts({
          platform: "MT4",
          env: environment_type,
        })
      );
    }
    const server = helperFunctions.getAccountServer({
      environment_type,
      platform: TIO_PLATFORMS.mt4,
      brand: user.brand,
    });
    const mt4Account = await mt4Service(server).createAccount({
      shariaEnabled: user?.flags?.shariaEnabled,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      password,
      accountType: account_type,
      environmentType: environment_type,
      currency,
      leverage,
      entity: user.entity,
    });

    let permissions = [];
    if (mt4Account.enable) permissions.push("ENABLED");
    if (mt4Account.enable_change_password)
      permissions.push("ENABLE_CHANGE_PASSWORD");
    if (mt4Account.enable_read_only) permissions.push("READ_ONLY");
    if (mt4Account.send_reports) permissions.push("SEND_REPORTS");

    const account = await UserAccountsModel.create({
      user: user._id,
      platform: TIO_PLATFORMS.mt4,
      login_id: String(mt4Account.login),
      account_type,
      group: mt4Account.group,
      leverage,
      currency,
      balance: 0,
      equity: 0,
      free_margin: 0,
      used_margin: 0,
      environment_type,
      server,
      permissions,
    });
    if (environment_type === "demo") {
      await mt4Service(account.server).depositToAccount({
        loginId: account.login_id,
        amount: 50000,
        paymentType: "Demo starting balance",
      });
      account.balance = 50000;
      account.equity = 50000;
      account.free_margin = 50000;
      await account.save();
    }
    return account;
  },
  createCtraderAccount: async ({
    user,
    currency,
    leverage,
    account_type,
    environment_type,
    first_account = false,
  }) => {
    if (
      environment_type === "live" &&
      user.brand === TIO_BRANDS.PIX &&
      !user.flags.emailVerified
    ) {
      throw new HTTPError(
        "User not allowed to create cTrader account needs email verification",
        403,
        { message: "Verify your email before openning a live account" }
      );
    }
    let countUserAccounts = await UserAccountsModel.countDocuments({
      user: user._id,
      platform: TIO_PLATFORMS.ctrader,
      environment_type,
      archived: { $ne: true },
    });
    let maxAllowedAccounts =
      environment_type === "live"
        ? CTRADER_MAX_LIVE_ACCOUNTS
        : CTRADER_MAX_DEMO_ACCOUNTS;
    if (countUserAccounts >= maxAllowedAccounts) {
      throw new HTTPError(
        `User not allowed to create any more ${environment_type} trader accounts (max: ${maxAllowedAccounts}).`,
        403,
        errorCodes.maxNumberOfTraderAccounts({
          platform: "cTrader",
          env: environment_type,
        })
      );
    }
    const server = helperFunctions.getAccountServer({
      environment_type,
      platform: TIO_PLATFORMS.ctrader,
      brand: user.brand,
    });

    let ctrader_account = await ctraderService(server).createAccountAndLinkUser(
      {
        user,
        currency,
        leverage,
        startingBalance: environment_type === "demo" ? 50000 : 0,
        account_type,
      }
    );
    let permissions = [ctrader_account.accessRights];
    if (ctrader_account.sendOwnStatement)
      permissions.push("SEND_OWN_STATEMENT");
    return UserAccountsModel.create({
      user: user._id,
      platform: TIO_PLATFORMS.ctrader,
      login_id: String(ctrader_account.login),
      linking_id: ctrader_account.linking_id,
      account_type,
      group: ctrader_account.groupName,
      leverage,
      currency,
      balance: environment_type === "demo" ? 50000 : 0,
      equity: environment_type === "demo" ? 50000 : 0,
      free_margin: environment_type === "demo" ? 50000 : 0,
      used_margin: 0,
      environment_type,
      server,
      first_account,
      permissions,
    });
  },
  createInnovoultAccount: async ({
    user,
    currency,
    leverage,
    account_type,
    environment_type,
    platform = TIO_PLATFORMS.ctrader,
  }) => {
    const server = helperFunctions.getAccountServer({
      environment_type,
      platform: TIO_PLATFORMS.ctrader,
      brand: user.brand,
    });
    if (platform === TIO_PLATFORMS.ctrader) {
      const ctrader_account = await ctraderService(
        server
      ).createAccountAndLinkUser({
        user,
        currency,
        leverage,
        account_type,
      });
      return UserAccountsModel.create({
        user: user._id,
        platform: TIO_PLATFORMS.ctrader,
        login_id: String(ctrader_account.login),
        linking_id: ctrader_account.linking_id,
        group: ctrader_account.groupName,
        account_type,
        leverage,
        currency,
        balance: environment_type === "demo" ? 50000 : 0,
        equity: environment_type === "demo" ? 50000 : 0,
        free_margin: environment_type === "demo" ? 50000 : 0,
        used_margin: 0,
        environment_type,
        server,
        provider: "innovoult",
        first_account: false,
      });
    } else if (platform === TIO_PLATFORMS.mt5) {
      const account = await userAccountsService.createMt5Account({
        user,
        leverage,
        currency,
        environment_type,
        account_type,
        password,
      });
      account.provider = "innovoult";
      account.first_account = false;
      return account.save();
    } else {
      throw new HTTPError("Unsupported account platform", 501, {
        message: "Unsupported platform",
      });
    }
  },
  deleteAccount: async (account_id) => {
    const account = await UserAccountsModel.findOne({
      _id: account_id,
    });
    if (!account) {
      throw new HTTPError(
        "User account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    if (account.first_account) {
      throw new HTTPError(
        "Cannot delete the first_account",
        401,
        errorCodes.cannotDeleteFirstAccount
      );
    }
    if (account.balance > 0) {
      throw new HTTPError(
        "Cannot delete account with balance",
        401,
        errorCodes.cannotDeleteAccountWithBalance
      );
    }
    if (account.platform === TIO_PLATFORMS.ctrader) {
      await ctraderService(account.server)
        .deleteTraderAccount(account.login_id)
        .catch((err) => {
          throw new HTTPError(
            "Failed to delete user account from ctrader",
            500,
            errorCodes.serverError
          );
        });
    } else if (account.platform === TIO_PLATFORMS.mt5) {
      await mt5Service.deleteAccount(account).catch((err) => {
        throw new HTTPError(
          "Failed to delete user account from mt5",
          500,
          errorCodes.serverError
        );
      });
    } else if (account.platform === TIO_PLATFORMS.mt4) {
      await mt4Service(account.server)
        .deleteAccount(account.login_id)
        .catch((err) => {
          throw new HTTPError(
            "Failed to delete user account from mt4",
            500,
            errorCodes.serverError
          );
        });
    } else {
      throw new HTTPError("Unsupported account platform for deletion", 501, {
        message: "Unsupported operation for account platform",
      });
    }
    account.archived = true;
    return account.save();
  },
  deleteUserAccount: async (user_id, account_id) => {
    const account = await UserAccountsModel.findOne({
      user: user_id,
      _id: account_id,
    });
    if (!account) {
      throw new HTTPError(
        "User account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    if (account.first_account) {
      throw new HTTPError(
        "Cannot delete the first_account",
        401,
        errorCodes.cannotDeleteFirstAccount
      );
    }
    if (account.platform === TIO_PLATFORMS.ctrader) {
      await ctraderService(account.server)
        .deleteTraderAccount(account.login_id)
        .catch((err) => {
          throw new HTTPError(
            "Failed to delete user account from ctrader",
            500,
            errorCodes.serverError
          );
        });
    } else if (account.platform === TIO_PLATFORMS.mt5) {
      await mt5Service.deleteAccount(account).catch((err) => {
        throw new HTTPError(
          "Failed to delete user account from mt5",
          500,
          errorCodes.serverError
        );
      });
    } else if (account.platform === TIO_PLATFORMS.mt4) {
      await mt4Service(account.server)
        .deleteAccount(account.login_id)
        .catch((err) => {
          throw new HTTPError(
            "Failed to delete user account from mt4",
            500,
            errorCodes.serverError
          );
        });
    } else {
      throw new HTTPError(
        "Unsupported account platform for delete Account request",
        501,
        { message: "Unsupported operation for account platform" }
      );
    }
    account.archived = true;
    return account.save();
  },
  depositToAccount: async (account_id, transaction) => {
    let payment = PAYMENT_GATEWAYS.find(
      (element) => element.hash === transaction.gateway
    );
    let method = payment ? payment.id : transaction.payment_method;
    const account = await UserAccountsModel.findOneAndUpdate(
      { _id: account_id },
      {
        $inc: {
          balance: transaction.processed_amount,
          equity: transaction.processed_amount,
          free_margin: transaction.processed_amount,
          total_deposits: transaction.processed_amount,
          total_deposits_usd: transaction.processed_usd_amount,
          [`deposits_by_method.${method}`]: Number(
            transaction.processed_amount
          ),
        },
      },
      { returnDocument: "after" }
    ).populate("user");
    if (account.platform === TIO_PLATFORMS.ctrader) {
      let ticketId = await ctraderService(account.server).depositToLiveAccount({
        account,
        transaction_id: transaction._id,
        preciseAmount: transaction.processed_amount,
        payment_method: transaction.payment_method,
      });
      await userTransactionsService.addTransactionPlatformId(
        transaction._id,
        ticketId
      );
    } else if (account.platform === TIO_PLATFORMS.mt5) {
      let ticketId = await mt5Service.depositToAccount(
        account,
        transaction.processed_amount,
        {
          paymentType: transaction.transaction_type,
          paymentMethod: transaction.payment_method,
        }
      );
      await userTransactionsService.addTransactionPlatformId(
        transaction._id,
        ticketId
      );
    } else if (account.platform === TIO_PLATFORMS.mt4) {
      let result = await mt4Service(account.server).depositToAccount({
        loginId: account.login_id,
        amount: transaction.processed_amount,
        paymentType: transaction.transaction_type,
        paymentMethod: transaction.payment_method,
      });
      await userTransactionsService.addTransactionPlatformId(
        transaction._id,
        result.order
      );
    } else {
      throw new HTTPError("Unsupported account platform for deposit", 501, {
        message: "Unsupported operation for account platform",
      });
    }
    await usersService.checkUserFirstTimeDeposit(account.user, transaction);
    return account;
  },
  depositToAccountBonus: async (account_id, transaction, reason) => {
    const account = await UserAccountsModel.findOneAndUpdate(
      { _id: account_id },
      {
        $inc: {
          bonus_balance: transaction.processed_amount,
        },
      },
      { returnDocument: "after" }
    ).populate("user");
    if (account.platform === TIO_PLATFORMS.ctrader) {
      let ticketId = await ctraderService(
        account.server
      ).depositToLiveAccountBonus({
        account,
        transaction_id: transaction._id,
        preciseAmount: transaction.processed_amount,
        comment: reason,
      });
      await userTransactionsService.addTransactionPlatformId(
        transaction._id,
        ticketId
      );
    } else if (account.platform === TIO_PLATFORMS.mt5) {
      let ticketId = await mt5Service.depositToAccountBonus(
        account,
        transaction.processed_amount,
        {
          paymentType: transaction.transaction_type,
          paymentMethod: transaction.payment_method,
        }
      );
      await userTransactionsService.addTransactionPlatformId(
        transaction._id,
        ticketId
      );
    } else if (account.platform === TIO_PLATFORMS.mt4) {
      let result = await mt4Service(account.server).bonusDepositToAccount({
        loginId: account.login_id,
        amount: transaction.processed_amount,
        paymentType: transaction.transaction_type,
        paymentMethod: transaction.payment_method,
      });
      await userTransactionsService.addTransactionPlatformId(
        transaction._id,
        result.order
      );
    } else {
      throw new HTTPError(
        "Unsupported account platform for deposit to bonus",
        501,
        { message: "Unsupported operation for account platform" }
      );
    }
    return account;
  },
  withdrawFromAccount: async (account_id, transaction) => {
    const account = await UserAccountsModel.findOneAndUpdate(
      { _id: account_id, balance: { $gte: transaction.processed_amount } },
      {
        $inc: {
          balance: -transaction.processed_amount,
          equity: -transaction.processed_amount,
          free_margin: -transaction.processed_amount,
          total_withdrawals: transaction.processed_amount,
          total_withdrawals_usd: transaction.processed_usd_amount,
          [`withdrawals_by_method.${_.snakeCase(transaction.payment_method)}`]:
            mongoose.Types.Decimal128(String(transaction.processed_amount)),
        },
      },
      { returnDocument: "after" }
    ).populate("user");
    if (!account) {
      throw new HTTPError(
        "Insufficient funds",
        409,
        errorCodes.insufficientFunds
      );
    }
    if (account.platform === TIO_PLATFORMS.ctrader) {
      let ticketId = await ctraderService(
        account.server
      ).withdrawFromLiveAccount({
        account,
        transaction_id: transaction._id,
        preciseAmount: transaction.processed_amount,
        payment_method: transaction.payment_method,
      });
      await userTransactionsService.addTransactionPlatformId(
        transaction._id,
        ticketId
      );
    } else if (account.platform === TIO_PLATFORMS.mt5) {
      let ticketId = await mt5Service.withdrawFromAccount(
        account,
        transaction.processed_amount,
        {
          paymentType: transaction.transaction_type,
          paymentMethod: transaction.payment_method,
        }
      );
      await userTransactionsService.addTransactionPlatformId(
        transaction._id,
        ticketId
      );
    } else if (account.platform === TIO_PLATFORMS.mt4) {
      let result = await mt4Service(account.server).withdrawFromAccount({
        loginId: account.login_id,
        amount: transaction.processed_amount,
        paymentType: transaction.transaction_type,
        paymentMethod: transaction.payment_method,
      });
      await userTransactionsService.addTransactionPlatformId(
        transaction._id,
        result.order
      );
    } else {
      throw new HTTPError("Unsupported account platform for withdrawal", 501, {
        message: "Unsupported operation for account platform",
      });
    }
    await usersService.checkUserFirstTimeWithdrawal(account.user, transaction);
    return account;
  },
  withdrawFromAccountBonus: async (account_id, transaction) => {
    const account = await UserAccountsModel.findOneAndUpdate(
      {
        _id: account_id,
        bonus_balance: { $gte: transaction.processed_amount },
      },
      {
        $inc: {
          bonus_balance: -transaction.processed_amount,
        },
      },
      { returnDocument: "after" }
    ).populate("user");
    if (!account) {
      throw new HTTPError(
        "Insufficient funds",
        409,
        errorCodes.insufficientFunds
      );
    }
    if (account.platform === TIO_PLATFORMS.ctrader) {
      let ticketId = await ctraderService(
        account.server
      ).withdrawFromLiveAccountBonus({
        account,
        transaction_id: transaction._id,
        preciseAmount: transaction.processed_amount,
        comment: transaction.payment_method,
      });
      await userTransactionsService.addTransactionPlatformId(
        transaction._id,
        ticketId
      );
    } else if (account.platform === TIO_PLATFORMS.mt5) {
      let ticketId = await mt5Service.withdrawFromAccountBonus(
        account,
        transaction.processed_amount,
        {
          paymentType: transaction.transaction_type,
          paymentMethod: transaction.payment_method,
        }
      );
      await userTransactionsService.addTransactionPlatformId(
        transaction._id,
        ticketId
      );
    } else if (account.platform === TIO_PLATFORMS.mt4) {
      let result = await mt4Service(account.server).bonusWithdrawFromAccount({
        loginId: account.login_id,
        amount: transaction.processed_amount,
        paymentType: transaction.transaction_type,
        paymentMethod: transaction.payment_method,
      });
      await userTransactionsService.addTransactionPlatformId(
        transaction._id,
        result.order
      );
    } else {
      throw new HTTPError(
        "Unsupported account platform for withdraw from bonus",
        501,
        { message: "Unsupported operation for account platform" }
      );
    }
    return account;
  },
  withdrawRequest: async (transaction_id, account_id, amount, type) => {
    // prettier-ignore
    const account = await UserAccountsModel.findOneAndUpdate(
      { _id: account_id, $expr: { $gte: ["$balance", { $add: ["$used_margin", Number(amount)] }] } },
      { $inc: { balance: -amount, equity: -amount, free_margin: -amount, withdrawal_hold: amount } },
      { returnDocument: "after" }
    );
    if (!account) {
      throw new HTTPError(
        "Insufficient funds",
        403,
        errorCodes.insufficientFunds
      );
    }
    if (account.platform === TIO_PLATFORMS.ctrader) {
      await ctraderService(account.server)
        .withdrawFromLiveAccount({
          account,
          transaction_id,
          preciseAmount: amount,
          payment_method: type,
        })
        .then((ticketId) => {
          return userTransactionsService.addTransactionPlatformId(
            transaction_id,
            ticketId
          );
        })
        .catch(async (err) => {
          await UserAccountsModel.updateOne(
            { _id: account_id },
            {
              $inc: {
                balance: amount,
                equity: amount,
                free_margin: amount,
                withdrawal_hold: -amount,
              },
            }
          );
          return Promise.reject(err);
        });
    } else if (account.platform === TIO_PLATFORMS.mt5) {
      await mt5Service
        .withdrawFromAccount(account, amount, {
          paymentType: "Withhold for withdrawal request",
          paymentMethod: "",
        })
        .then((ticketId) => {
          return userTransactionsService.addTransactionPlatformId(
            transaction_id,
            ticketId
          );
        })
        .catch(async (err) => {
          await UserAccountsModel.updateOne(
            { _id: account_id },
            {
              $inc: {
                balance: amount,
                equity: amount,
                free_margin: amount,
                withdrawal_hold: -amount,
              },
            }
          );
          return Promise.reject(err);
        });
    } else if (account.platform === TIO_PLATFORMS.mt4) {
      await mt4Service(account.server)
        .withdrawFromAccount({
          loginId: account.login_id,
          amount,
          paymentType: "Withdrawal request",
        })
        .then((result) => {
          return userTransactionsService.addTransactionPlatformId(
            transaction_id,
            result.order
          );
        })
        .catch(async (err) => {
          await UserAccountsModel.updateOne(
            { _id: account_id },
            {
              $inc: {
                balance: amount,
                equity: amount,
                free_margin: amount,
                withdrawal_hold: -amount,
              },
            }
          );
          return Promise.reject(err);
        });
    } else {
      throw new HTTPError(
        "Unsupported account platform for withdraw request",
        501,
        { message: "Unsupported operation for account platform" }
      );
    }
    return account;
  },
  withdrawRequestApprove: async (account_id, amount, transaction, methods) => {
    const convertedMethods = methods.reduce(
      (acc, v) => ({
        ...acc,
        [`withdrawals_by_method.${v.type}`]: mongoose.Types.Decimal128(
          String(v.amount)
        ),
      }),
      {}
    );
    // prettier-ignore
    const account = await UserAccountsModel.findOneAndUpdate(
      { _id: account_id, withdrawal_hold: { $gte: amount } },
      { $inc: { withdrawal_hold: -amount, total_withdrawals: amount, total_withdrawals_usd: transaction.processed_usd_amount, ...convertedMethods } },
      { returnDocument: "after" }
    ).populate("user");
    if (!account) {
      throw new HTTPError(
        "Insufficient withdrawal hold",
        403,
        errorCodes.insufficientFunds
      );
    }
    await usersService.checkUserFirstTimeWithdrawal(account.user, transaction);
    return account;
  },
  withdrawRequestReject: async (transaction_id, account_id, amount) => {
    // prettier-ignore
    const account = await UserAccountsModel.findOneAndUpdate(
      { _id: account_id, withdrawal_hold: { $gte: amount } },
      { $inc: { balance: amount, equity: amount, free_margin: amount, withdrawal_hold: -amount } },
      { returnDocument: "after" }
    );
    if (!account) {
      throw new HTTPError(
        "Insufficient withdrawal hold",
        403,
        errorCodes.insufficientFunds
      );
    }
    if (account.platform === TIO_PLATFORMS.ctrader) {
      await ctraderService(account.server)
        .depositToLiveAccount({
          account,
          transaction_id,
          preciseAmount: amount,
          payment_method: "return of funds rejected withdrawal",
        })
        .catch(async (err) => {
          await UserAccountsModel.updateOne(
            { _id: account_id },
            {
              $inc: {
                balance: -amount,
                equity: -amount,
                free_margin: -amount,
                withdrawal_hold: amount,
              },
            }
          );
          return Promise.reject(err);
        });
    } else if (account.platform === TIO_PLATFORMS.mt5) {
      await mt5Service
        .depositToAccount(account, amount, {
          paymentType: "Return of funds rejected withdrawal",
        })
        .catch(async (err) => {
          await UserAccountsModel.updateOne(
            { _id: account_id },
            {
              $inc: {
                balance: -amount,
                equity: -amount,
                free_margin: -amount,
                withdrawal_hold: amount,
              },
            }
          );
          return Promise.reject(err);
        });
    } else if (account.platform === TIO_PLATFORMS.mt4) {
      await mt4Service(account.server)
        .depositToAccount({
          loginId: account.login_id,
          amount,
          paymentType: "Return of funds rejected withdrawal",
        })
        .catch(async (err) => {
          await UserAccountsModel.updateOne(
            { _id: account_id },
            {
              $inc: {
                balance: -amount,
                equity: -amount,
                free_margin: -amount,
                withdrawal_hold: amount,
              },
            }
          );
          return Promise.reject(err);
        });
    }
    return account;
  },
  addCtraderTraderId: async (login_id, trader_id, env_type) => {
    return UserAccountsModel.updateOne(
      { login_id, environment_type: env_type, platform: TIO_PLATFORMS.ctrader },
      { $set: { trader_id } }
    ).then((res) =>
      res.modifiedCount === 0
        ? Promise.reject(
            new HTTPError(
              "Account not found",
              404,
              errorCodes.userAccountNotFound
            )
          )
        : res
    );
  },
  stagingAddCtraderTraderId: async (login_id, trader_id, env_type, brand) => {
    const server = helperFunctions.getAccountServer({
      platform: TIO_PLATFORMS.ctrader,
      brand,
      environment_type: env_type,
    });
    return UserAccountsModel.updateOne(
      { login_id, server },
      { $set: { trader_id } }
    ).then((res) => {
      return res.modifiedCount === 0
        ? Promise.reject(
            new HTTPError(
              "Account not found",
              404,
              errorCodes.userAccountNotFound
            )
          )
        : res;
    });
  },
  syncCtraderBalance: async (trader_id, env_type) => {
    const account = await UserAccountsModel.findOne({
      trader_id,
      environment_type: env_type,
      platform: TIO_PLATFORMS.ctrader,
    });
    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    const account_details = await ctraderService(
      account.server
    ).getTraderAccountByLogin(account.login_id);

    const balance = utilFunctions.convertCentToCurrency(
      account.currency,
      account_details.balance
    );
    const used_margin = utilFunctions.convertCentToCurrency(
      account.currency,
      account_details.usedMargin
    );
    const free_margin = utilFunctions.convertCentToCurrency(
      account.currency,
      account_details.freeMargin
    );
    const equity = utilFunctions.convertCentToCurrency(
      account.currency,
      account_details.equity
    );
    return await UserAccountsModel.updateOne(
      { trader_id, environment_type: env_type },
      { $set: { balance, used_margin, free_margin, equity } }
    );
  },
  stagingSyncCtraderBalance: async (trader_id, env_type, brand) => {
    let server = helperFunctions.getAccountServer({
      platform: TIO_PLATFORMS.ctrader,
      brand,
      environment_type: env_type,
    });
    const account = await UserAccountsModel.findOne({
      trader_id,
      server,
    });
    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    const account_details = await ctraderService(
      account.server
    ).getTraderAccountByLogin(account.login_id);

    const balance = utilFunctions.convertCentToCurrency(
      account.currency,
      account_details.balance
    );
    const used_margin = utilFunctions.convertCentToCurrency(
      account.currency,
      account_details.usedMargin
    );
    const free_margin = utilFunctions.convertCentToCurrency(
      account.currency,
      account_details.freeMargin
    );
    const equity = utilFunctions.convertCentToCurrency(
      account.currency,
      account_details.equity
    );
    return await UserAccountsModel.updateOne(
      { trader_id, server },
      { $set: { balance, used_margin, free_margin, equity } }
    );
  },
  showWireTransfer: (account) => {
    return {
      show: !(
        Object.keys(account.deposits_by_method || {}).length > 1 &&
        !!account?.deposits_by_method?.credit_card
      ),
      amount:
        Number(account?.deposits_by_method?.credit_card?.toString()) -
          Number(account?.total_withdrawals?.toString()) ?? 0,
      skrill: account?.deposits_by_method?.skrill ?? 0,
    };
  },
  calculateWithdrawableBalance: (account) => {
    return Number(account.balance) - Number(account.used_margin);
  },
  unlockUserAccounts: async (user_id) => {
    const accounts = await userAccountsService.getUserAccounts(user_id, {
      environment_type: "live",
    });
    await Promise.all(
      accounts.map(async (account) => {
        if (account.platform === TIO_PLATFORMS.ctrader) {
          return ctraderService(account.server)
            .updateTraderAccountAccessRights({
              account: account,
              accessRights: "FULL_ACCESS",
            })
            .then((res) => {
              let permissions = [res.accessRights];
              if (res.enable_send_reports)
                permissions.push("SEND_OWN_STATEMENT");
              account.permissions = permissions;
              return account.save();
            })
            .catch((err) =>
              console.error(
                `Error unlocking ctrader account ${account.login_id}`
              )
            );
        } else if (account.platform === TIO_PLATFORMS.mt5) {
          return mt5Service
            .removeRightsFromAccount({
              account,
              rightsToBeRemoved: [MT5_ACCOUNT_RIGHTS_KEYS.TRADE_DISABLED],
            })
            .then((res) => {
              let permissions = [res.accessRights];
              if (res.enable_send_reports)
                permissions.push("SEND_OWN_STATEMENT");
              account.permissions = permissions;
              return account.save();
            })
            .then((newPermissions) => {
              account.permissions = newPermissions;
              return account.save();
            })
            .catch((err) =>
              console.error(
                `Error unlocking mt5 account ${account.login_id}`,
                err
              )
            );
        } else if (account.platform === TIO_PLATFORMS.mt4) {
          return mt4Service(account.server)
            .updateAccountPermissions({
              login: account.login_id,
              enable_change_password: account.permissions.includes(
                "ENABLE_CHANGE_PASSWORD"
              ),
              enable_send_reports: account.permissions.includes("SEND_REPORTS"),
              read_only: false,
              enabled: true,
            })
            .then((res) => {
              let permissions = [];
              if (res.enable) permissions.push("ENABLED");
              if (res.enable_change_password)
                permissions.push("ENABLE_CHANGE_PASSWORD");
              if (res.enable_read_only) permissions.push("READ_ONLY");
              if (res.send_reports) permissions.push("SEND_REPORTS");
              account.permissions = permissions;
              return account.save();
            })
            .catch((err) =>
              console.error(`Error unlocking mt4 account ${account.login_id}`)
            );
        } else {
          console.error(`Unsupported platform ${account.platform} for unlock`);
        }
      })
    );
  },
  lockUserAccounts: async (user_id) => {
    const accounts = await userAccountsService.getUserAccounts(user_id, {
      environment_type: "live",
    });
    await Promise.all(
      accounts.map(async (account) => {
        if (account.platform === TIO_PLATFORMS.ctrader) {
          return ctraderService(account.server)
            .updateTraderAccountAccessRights({
              account: account,
              accessRights: "CLOSE_ONLY",
            })
            .catch((err) =>
              console.error(`Error locking ctrader account ${account.login_id}`)
            );
        } else if (account.platform === TIO_PLATFORMS.mt5) {
          return mt5Service
            .addRightsToAccount({
              account,
              newRights: [MT5_ACCOUNT_RIGHTS_KEYS.TRADE_DISABLED],
            })
            .then((newPermissions) => {
              account.permissions = newPermissions;
              return account.save();
            })
            .catch((err) =>
              console.error(`Error locking mt5 account ${account.login_id}`)
            );
        } else if (account.platform === TIO_PLATFORMS.mt4) {
          return mt4Service(account.server)
            .updateAccountPermissions({
              login: account.login_id,
              enable_change_password: account.permissions.includes(
                "ENABLE_CHANGE_PASSWORD"
              ),
              enable_send_reports: account.permissions.includes("SEND_REPORTS"),
              read_only: true,
              enabled: true,
            })
            .then((res) => {
              let permissions = [];
              if (res.enable) permissions.push("ENABLED");
              if (res.enable_change_password)
                permissions.push("ENABLE_CHANGE_PASSWORD");
              if (res.enable_read_only) permissions.push("READ_ONLY");
              if (res.send_reports) permissions.push("SEND_REPORTS");
              account.permissions = permissions;
              return account.save();
            })
            .catch((err) =>
              console.error(
                `Error locking mt4 account ${account.login_id}`,
                err
              )
            );
        } else {
          console.error(`Unsupported platform ${account.platform} for unlock`);
        }
      })
    );
  },
  updateAccountLeverage: async (account_id, account_type, leverage) => {
    const account = await UserAccountsModel.findOne({ _id: account_id });
    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    if (account.platform === TIO_PLATFORMS.ctrader) {
      await ctraderService(account.server).updateTraderAccountGroup({
        login_id: account.login_id,
        account_type,
        leverage,
      });
    } else if (account.platform === TIO_PLATFORMS.mt5) {
      await mt5Service.changeAccountLeverage({
        login: account.login_id,
        environment_type: account.environment_type,
        leverage,
      });
    } else if (account.platform === TIO_PLATFORMS.mt4) {
      await mt4Service(account.server).updateUser({
        loginId: account.login_id,
        leverage,
      });
    } else {
      throw new HTTPError(
        "account platform and leverage can only be updated for ctrader accounts",
        501,
        { message: "Only ctrader accounts can be updated" }
      );
    }
    account.account_type = account_type;
    account.leverage = leverage;
    return account.save();
  },
  updateAccountPermissions: async ({
    account_id,
    enabled,
    enable_change_password,
    enable_send_reports,
    read_only,
  }) => {
    const account = await UserAccountsModel.findById(account_id);
    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    if (account.platform === TIO_PLATFORMS.ctrader) {
      let accessRights = "FULL_ACCESS";
      if (read_only) accessRights = "CLOSE_ONLY";
      if (!enabled) accessRights = "NO_LOGIN";
      await ctraderService(account.server).updateTraderAccountAccessRights({
        account,
        accessRights,
        sendOwnStatement: enable_send_reports,
      });
      let permissions = [accessRights];
      if (enable_send_reports) permissions.push("SEND_OWN_STATEMENT");
      account.permissions = permissions;
      return account.save();
    } else if (account.platform === TIO_PLATFORMS.mt5) {
      let permissions = await mt5Service
        .getAccountDetails(account)
        .then((res) =>
          mt5AccountRightsUtils.getRightsFromNumber(Number(res.Rights))
        );
      if (enabled) permissions.push(MT5_ACCOUNT_RIGHTS_KEYS.ENABLED);
      else
        permissions = permissions.filter(
          (v) => v !== MT5_ACCOUNT_RIGHTS_KEYS.ENABLED
        );
      if (enable_change_password)
        permissions.push(MT5_ACCOUNT_RIGHTS_KEYS.PASSWORD);
      else
        permissions = permissions.filter(
          (v) => v !== MT5_ACCOUNT_RIGHTS_KEYS.PASSWORD
        );
      if (enable_send_reports)
        permissions.push(MT5_ACCOUNT_RIGHTS_KEYS.REPORTS);
      else
        permissions = permissions.filter(
          (v) => v !== MT5_ACCOUNT_RIGHTS_KEYS.REPORTS
        );
      if (read_only) permissions.push(MT5_ACCOUNT_RIGHTS_KEYS.TRADE_DISABLED);
      else
        permissions = permissions.filter(
          (v) => v !== MT5_ACCOUNT_RIGHTS_KEYS.TRADE_DISABLED
        );
      let updatedPermissions = await mt5Service.setAccountRights({
        login: account.login_id,
        rights: Array.from(new Set(permissions)),
        environment_type: account.environment_type,
      });
      account.permissions = updatedPermissions;
      return account.save();
    } else if (account.platform === TIO_PLATFORMS.mt4) {
      const result = await mt4Service(account.server).updateAccountPermissions({
        login: account.login_id,
        enabled,
        enable_change_password,
        enable_send_reports,
        read_only,
      });
      let permissions = [];
      if (result.enable) permissions.push("ENABLED");
      if (result.enable_change_password)
        permissions.push("ENABLE_CHANGE_PASSWORD");
      if (result.enable_read_only) permissions.push("READ_ONLY");
      if (result.send_reports) permissions.push("SEND_REPORTS");
      account.permissions = permissions;
      return account.save();
    } else {
      throw new HTTPError(
        `Unsupported platform ${account.platform} for permission change`,
        501,
        {
          message: `Unsupported platform ${account.platform} for permission change`,
        }
      );
    }
  },
  getMinDepositAmount: async (account) => {
    let amount = 0;
    if (account.environment_type !== "demo") {
      if (account.platform === TIO_PLATFORMS.ctrader) {
        amount =
          {
            standard: 10,
            vip: 1000,
            vipblack: 3000,
          }[account.account_type] || 0;
      } else if (account.platform === TIO_PLATFORMS.mt5) {
        amount =
          {
            standard: 10,
            vip: 1000,
            vipblack: 3000,
            spreadOnly: 10,
            copyTrading: 10,
          }[account.account_type] || 0;
      } else if (account.platform === TIO_PLATFORMS.mt4) {
        amount =
          {
            standard: 10,
            vip: 1000,
            vipblack: 3000,
            spreadOnly: 10,
          }[account.account_type] || 0;
      } else {
        amount = 0;
      }
    }
    const usd = Currency.fromPrecise({
      amount,
      currency: "USD",
    });
    return {
      amount: usd.getAmountPrecise(),
      amountInAccountCurrency: (
        await usd.convertToCurrency(account.currency)
      ).getAmountPrecise(),
    };
  },
  getMinWithdrawalAmount: async (account) => {
    let amount = 0;
    if (account.environment_type !== "demo") {
      if (account.platform === TIO_PLATFORMS.ctrader) {
        amount =
          {
            standard: 10,
            vip: 10,
            vipblack: 10,
          }[account.account_type] || 0;
      } else if (account.platform === TIO_PLATFORMS.mt5) {
        amount =
          {
            standard: 10,
            vip: 10,
            vipblack: 10,
            spreadOnly: 10,
            copyTrading: 10,
          }[account.account_type] || 0;
      } else if (account.platform === TIO_PLATFORMS.mt4) {
        amount =
          {
            standard: 10,
            vip: 10,
            vipblack: 10,
            spreadOnly: 10,
          }[account.account_type] || 0;
      } else {
        amount = 0;
      }
    }
    const usd = Currency.fromPrecise({
      amount,
      currency: "USD",
    });
    return {
      amount: usd.getAmountPrecise(),
      amountInAccountCurrency: (
        await usd.convertToCurrency(account.currency)
      ).getAmountPrecise(),
    };
  },
  syncMt5AccountBalance: async (loginId, envType) => {
    const account = await UserAccountsModel.findOne({
      login_id: loginId,
      environment_type: envType,
      platform: TIO_PLATFORMS.mt5,
    });
    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    const accountDetails = await mt5Service.getAccountDetails(account);
    account.balance = accountDetails.Balance;
    account.used_margin = accountDetails.Margin;
    account.free_margin = accountDetails.MarginFree;
    account.equity = accountDetails.Equity;

    return account.save();
  },
  syncMt4AccountBalance: async (loginId, envType) => {
    const account = await UserAccountsModel.findOne({
      login_id: loginId,
      environment_type: envType,
      platform: TIO_PLATFORMS.mt4,
    });
    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    const accountDetails = await mt4Service(account.server).getAccountMargin(
      account.login_id
    );

    account.balance = accountDetails.balance;
    account.used_margin = accountDetails.margin;
    account.free_margin = accountDetails.margin_free;
    account.equity = accountDetails.equity;

    return account.save();
  },
  changeAccountLeverage: async (account_id, leverage) => {
    let account = await UserAccountsModel.findById(account_id);
    if (!account) {
      throw new HTTPError(
        "Account not found",
        404,
        errorCodes.userAccountNotFound
      );
    }
    if (account.platform === TIO_PLATFORMS.ctrader) {
      await ctraderService(account.server).changeTraderAccountLeverage({
        login_id: account.login_id,
        newLeverage: leverage,
      });
      account.leverage = leverage;
      return account.save();
    } else if (account.platform === TIO_PLATFORMS.mt5) {
      await mt5Service.changeAccountLeverage({
        login: account.login_id,
        environment_type: account.environment_type,
        leverage,
      });
      account.leverage = leverage;
      return account.save();
    } else if (account.platform === TIO_PLATFORMS.mt4) {
      await mt4Service(account.server).updateUser({
        loginId: account.login_id,
        leverage,
      });
      account.leverage = leverage;
      return account.save();
    } else {
      throw new HTTPError(
        `Unsupported functionality for ${account.platform} accounts`,
        501,
        {
          message: `Unsupported functionality for ${account.platform} accounts`,
        }
      );
    }
    return account;
  },
};

export default userAccountsService;
