import mongoose from "mongoose";
import md5 from "md5";
import bcrypt from "bcrypt";
import {
  BCRYPT_SALT_ROUNDS,
  TIO_BRANDS,
  TIO_ENTITIES,
  TIO_PLATFORMS,
  TRADE_SERVERS,
  USER_KYC_STATUS,
} from "../config/enums";
import HTTPError from "../utils/HTTPError";
import errorCodes from "../config/errorCodes";
import ctraderService from "./ctrader.service";
import userAccountsService from "./userAccounts.service";
import UsersModel from "../models/Users.model";
import salesService from "./sales.service";
import utilFunctions from "../utils/util.functions";
import currencyService from "./currencyExchange.service";
import {
  CTRADER_DEAL_STATUS,
  CTRADER_POSITION_STATUS,
} from "../config/ctraderEnums";
import { DateTime } from "luxon";
import { isAxiosError } from "axios";
import emailService from "./email.service";
import Currency from "../utils/Currency";
import _ from "lodash";

const usersService = {
  getUser: async (user_id) => {
    return UsersModel.findById(user_id);
  },
  getUserByEmailOrReadableIdForTIO: async ({ emailOrReadableId, entity }) => {
    let query = {
      email: emailOrReadableId,
    };
    if (!_.isNaN(Number(emailOrReadableId))) {
      query = {
        readableId: emailOrReadableId,
      };
    }
    return UsersModel.findOne({
      ...query,
      entity,
      brand: "TIO",
    });
  },
  createUser: async ({
    email,
    password,
    phone,
    first_name,
    last_name,
    country,
    terms,
    entity,
    brand = "TIO",
    language,
    metadata,
  }) => {
    if (brand === TIO_BRANDS.TIO) {
      if (
        ![TIO_ENTITIES.TIOSV, TIO_ENTITIES.TIOUK, TIO_ENTITIES.TIOCO].includes(
          entity
        )
      ) {
        throw HTTPError(`Invalid entity ${entity} for brand ${brand}`, 400, {
          message: "Cannot create a user for this entity-brand",
        });
      }
    }
    if (brand === TIO_BRANDS.PIX) {
      if (
        ![TIO_ENTITIES.TIOSV, TIO_ENTITIES.TIOCO, TIO_ENTITIES.TIOSE].includes(
          entity
        )
      ) {
        throw HTTPError(`Invalid entity ${entity} for brand ${brand}`, 400, {
          message: "Cannot create a user for this entity-brand",
        });
      }
    }
    let hashed_password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    let md5_ctrader_password = md5(password);
    const user = await UsersModel.create({
      email,
      password: hashed_password,
      ctrader_password: md5_ctrader_password,
      phone,
      first_name,
      last_name,
      country,
      terms,
      entity,
      brand,
      language,
      metadata,
    });
    if (!user.sales_agent) {
      // Get CRM Sales Agents assigned to country
      const crmSalesAgentId = await salesService.getSalesRepIdForUser(user);
      // Assign CRM Sales Agent ID to newly created user
      user.set("sales_agent", crmSalesAgentId);
    }

    return user.save();
  },
  addCtraderId: async (user_id, ctrader_id) => {
    return UsersModel.findOneAndUpdate(
      {
        _id: user_id,
      },
      {
        $set: {
          ctrader_id,
        },
      },
      {
        returnDocument: "after",
      }
    );
  },
  addMt5Id: async (user_id, mt5_id) => {
    if (!mt5_id) throw new Error("mt5_id is required");
    return UsersModel.findOneAndUpdate(
      {
        _id: user_id,
      },
      {
        $set: {
          mt5_id,
        },
      },
      {
        returnDocument: "after",
      }
    );
  },
  createCtraderUser: async (
    email,
    password,
    phone,
    first_name,
    last_name,
    country,
    terms,
    metadata
  ) => {
    let existingUser = await UsersModel.findOne({
      $or: [{ email }, { readableId: email }],
      entity: TIO_ENTITIES.TIOSV,
      brand: TIO_BRANDS.TIO,
    });
    if (existingUser) {
      throw new HTTPError(
        "User with that email already exists",
        409,
        errorCodes.userAlreadyExists
      );
    }
    let hashed_password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    let md5_ctrader_password = md5(password);
    const user = new UsersModel({
      email,
      password: hashed_password,
      ctrader_password: md5_ctrader_password,
      entity: TIO_ENTITIES.TIOSV,
      phone,
      first_name,
      last_name,
      country,
      terms,
      brand: TIO_BRANDS.TIO,
      metadata: metadata ?? {},
    });

    const new_ctrader_user = await ctraderService(
      TRADE_SERVERS.TIO_CTRADER_DEMO_1
    ).createUser({
      email,
      firstName: first_name,
      preferredLanguage: metadata?.language,
      brand: user.brand,
    });

    user.set("ctrader_id", new_ctrader_user.userId);

    if (!user.sales_agent) {
      // Get CRM Sales Agents assigned to country
      const crmSalesAgentId = await salesService.getSalesRepIdForUser(user);
      // Assign CRM Sales Agent ID to newly created user
      user.set("sales_agent", crmSalesAgentId);
    }

    await user.save();

    let account = await userAccountsService
      .createCtraderAccount({
        user: user,
        currency: "USD",
        leverage: 100,
        account_type: "standard",
        environment_type: "demo",
        first_account: true,
      })
      .catch(async (err) => {
        await user.remove();
        console.error(err);
        throw new HTTPError(
          "Failed to create user account on registration",
          500,
          errorCodes.serverError
        );
      });
    return { user, account };
  },
  createCtraderUserForExistingUser: async (user) => {
    const new_ctrader_user = await ctraderService(
      user.brand === TIO_BRANDS.TIO
        ? TRADE_SERVERS.TIO_CTRADER_LIVE_1
        : TRADE_SERVERS.PIX_CTRADER_LIVE_1
    ).createUser({
      email: user.email,
      firstName: user?.first_name,
      preferredLanguage: user?.language,
      brand: user.brand,
    });

    return UsersModel.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          ctrader_id: new_ctrader_user.userId,
        },
      },
      {
        returnDocument: "after",
      }
    );
  },
  changeSalesAgent: async ({ user_id, sales_agent_id }) => {
    return UsersModel.updateOne(
      { _id: user_id },
      { $set: { sales_agent: sales_agent_id } }
    );
  },
  checkUserPassword: async (_user, password) => {
    const user = await UsersModel.findById(_user._id);
    return bcrypt.compare(password, user.password);
  },
  loginCtraderUser: async (email, password) => {
    let user = await UsersModel.findOne({
      email,
      entity: TIO_ENTITIES.TIOSV,
      brand: TIO_BRANDS.TIO,
    });
    if (!user) {
      throw new HTTPError(
        "User does not have an account",
        404,
        errorCodes.userDoesNotExist
      );
    }
    if (user?.isSuspended) {
      throw new HTTPError("User is suspended", 401, errorCodes.userSuspended);
    }
    if (!(await usersService.checkUserPassword(user, password))) {
      throw new HTTPError(
        "Invalid password",
        401,
        errorCodes.invalidLoginCredentials
      );
    }
    user.last_login = Date.now();
    if (!user.ctrader_id) {
      const new_ctrader_user = await ctraderService(
        TRADE_SERVERS.TIO_CTRADER_DEMO_1
      ).createUser({
        email: user.email,
        firstName: user.first_name,
        preferredLanguage: user.language,
        brand: user.brand,
      });

      user.set("ctrader_id", new_ctrader_user.userId);

      if (!user.sales_agent) {
        // Get CRM Sales Agents assigned to country
        const crmSalesAgentId = await salesService.getSalesRepIdForUser(user);
        // Assign CRM Sales Agent ID to newly created user
        user.set("sales_agent", crmSalesAgentId);
      }

      await user.save();

      await userAccountsService.createCtraderAccount({
        user,
        currency: "USD",
        leverage: 100,
        account_type: "standard",
        environment_type: "demo",
        first_account: true,
      });
    }
    return user.save();
  },
  loginUserInnoVoult: async (email, password, innnovoultUserId) => {
    let user = await UsersModel.findOne({ email });
    if (!user) {
      throw new HTTPError(
        "User does not exist",
        404,
        errorCodes.userDoesNotExist
      );
    }
    if (!(await usersService.checkUserPassword(user, password))) {
      throw new HTTPError(
        "Invalid password",
        401,
        errorCodes.invalidLoginCredentials
      );
    }
    if (!user.innoVoultID) {
      user.innoVoultID = innnovoultUserId;
    } else if (user.innoVoultID !== innnovoultUserId) {
      throw new HTTPError(
        "User linked to different innovoult account",
        409,
        errorCodes.userLinkedToDifferentInnovoultAccount
      );
    }
    user.last_login = Date.now();
    return user.save();
  },
  getUserByEmail: async (email) => {
    return UsersModel.findOne({ email });
  },
  getUserByEmailEntity: async ({ email, entity, brand }) => {
    return UsersModel.findOne({
      $or: [{ email }, { secondaryEmail: email }],
      entity,
      brand,
    });
  },
  getUserByEmailOrReadableIdEntity: async ({ email, entity, brand }) => {
    return UsersModel.findOne({
      $or: [{ email }, { readableId: email }],
      entity,
      brand,
    });
  },
  getUserById: async (user_id) => {
    const user = await UsersModel.findById(user_id).populate("sales_agent");
    if (!user) {
      throw new HTTPError("User not found", 404, errorCodes.userWithIdNotFound);
    }
    return user;
  },
  getUserByCTID: async (ctrader_id) => {
    let user = await UsersModel.findOne({
      ctrader_id,
    });
    if (!user) {
      throw new HTTPError(
        "User not found",
        404,
        errorCodes.userWithCTIDNotFound
      );
    }
    return user;
  },
  resetUserPassword: async (user_id, new_password) => {
    let user = await UsersModel.findById(user_id);
    if (!user) {
      throw new HTTPError("User not found", 404, errorCodes.userDoesNotExist);
    }
    user.password = await bcrypt.hash(new_password, BCRYPT_SALT_ROUNDS);
    let md5_hashed_password = md5(new_password);
    user.ctrader_password = md5_hashed_password;
    let ctrader_accounts = await userAccountsService.getCtraderAccounts(
      user._id
    );
    for (let account of ctrader_accounts) {
      try {
        await ctraderService(account.server).changeUserPassword(
          account.login_id,
          md5_hashed_password
        );
      } catch (err) {
        if (!(isAxiosError(err) && err.response.status === 404)) {
          throw err;
        }
      }
    }
    return user.save();
  },
  getUsers: async ({
    page = 1,
    limit = 50,
    sort,
    search,
    filters = {},
    paginated = false,
    brand,
    countryWhitelist,
    sales_agent,
  }) => {
    // prettier-ignore
    let query = [
      { $match: { brand, ...(!sales_agent ? (countryWhitelist ? { country: {$in: countryWhitelist}}: {}): { sales_agent: mongoose.Types.ObjectId(sales_agent) }) } },
      { $project: { ctrader_password: 0, password: 0, __v: 0, } },
    ];

    if (filters["accounts.live"] || filters["accounts.demo"]) {
      // prettier-ignore
      query.push({ $lookup: { from: "useraccounts", localField: "_id", foreignField: "user", as: "accounts", pipeline: [ { $group: { _id: null, demo: { $sum: { $cond: [{ $eq: ["$environment_type", "demo"] }, 1, 0], }, }, live: { $sum: { $cond: [{ $eq: ["$environment_type", "live"] }, 1, 0], }, }, total_deposits_usd: { $sum: { $cond: [ { $eq: ["$environment_type", "live"] }, "$total_deposits_usd", 0, ], }, }, total_withdrawals_usd: { $sum: { $cond: [ { $eq: ["$environment_type", "live"] }, "$total_withdrawals_usd", 0, ], }, }, }, }, { $project: { _id: 0 } }, ], }, });
      // prettier-ignore
      query.push({ $unwind: { path: "$accounts", preserveNullAndEmptyArrays: true }, });
    }

    // prettier-ignore
    query.push({ $match: filters });

    if (search) {
      let escapedSearch = utilFunctions.escapeStringForRegExp(search.trim());
      query.unshift({
        $match: {
          $or: [
            { first_name: { $regex: `^${escapedSearch}`, $options: "i" } },
            { last_name: { $regex: `^${escapedSearch}`, $options: "i" } },
            { email: { $regex: `^${escapedSearch}`, $options: "i" } },
            { ctrader_id: { $regex: `^${escapedSearch}`, $options: "i" } },
            { mt5_id: { $regex: `^${escapedSearch}`, $options: "i" } },
            { readableId: { $regex: `^${escapedSearch}`, $options: "i" } },
          ],
        },
      });
    }
    const aggregation = UsersModel.aggregate(query);
    if (!paginated) {
      let docs = await aggregation
        .collation({ locale: "en", numericOrdering: true })
        .sort(sort || { createdAt: -1 });
      return docs.map((v) => {
        utilFunctions.decimal2JSON(v);
        return v;
      });
    }
    const res = await UsersModel.aggregatePaginate(aggregation, {
      page,
      limit,
      sort: sort ?? { createdAt: -1 },
      collation: {
        locale: "simple",
        numericOrdering: true,
      },
    });
    res.docs = res.docs.map((v) => {
      utilFunctions.decimal2JSON(v);
      return v;
    });
    return res;
  },
  getActiveTraders: async ({
    page = 1,
    limit = 50,
    brand,
    countryWhitelist,
    paginated,
  }) => {
    // prettier-ignore
    const aggregation = UsersModel.aggregate([
      { $match: { brand, ...(countryWhitelist ? { country: { $in: countryWhitelist } } : {}), }, },
      { $project: { ctrader_password: 0, password: 0, __v: 0 } },
      { $lookup: { from: "useraccounts", localField: "_id", foreignField: "user", as: "accounts", pipeline: [ { $match: { environment_type: "live" } }, { $lookup: { from: "ctraderpositions", localField: "_id", foreignField: "account", as: "positions_ctrader", }, }, { $lookup: { from: "mt5positions", localField: "_id", foreignField: "account", as: "positions_mt5", }, }, { $lookup: { from: "mt4trades", localField: "_id", foreignField: "account", as: "positions_mt4", }, }, ], }, },
      { $unwind: { path: "$accounts" } },
      { $match: { $or: [ { "accounts.positions_ctrader": { $elemMatch: { positionStatus: CTRADER_POSITION_STATUS.POSITION_STATUS_OPEN, }, }, }, { "accounts.positions_mt5": { $elemMatch: { archived: false } } }, { "accounts.positions_mt4": { $elemMatch: { archived: false } } }, ], }, },
      { $group: { _id: "$_id", root: { $first: "$$ROOT" }, }},
      { $replaceRoot: { newRoot: "$root", }}
    ]);

    function formatData(data) {
      return data.map((v) => {
        return utilFunctions.decimal2JSONReturn(v);
      });
    }
    if (paginated) {
      const res = await UsersModel.aggregatePaginate(aggregation, {
        page,
        limit,
        sort: { createdAt: -1 },
        collation: { locale: "en", numericOrdering: true },
      });
      res.docs = formatData(res.docs);
      return res;
    } else {
      const res = await aggregation.exec();
      return formatData(res);
    }
  },
  getBalanceReport: async ({
    page = 1,
    limit = 50,
    brand,
    countryWhitelist,
    paginated = true,
  }) => {
    const aggregation = UsersModel.aggregate([
      {
        $match: {
          brand,
          ...(countryWhitelist ? { country: { $in: countryWhitelist } } : {}),
        },
      },
      { $project: { ctrader_password: 0, password: 0, __v: 0 } },
      {
        $lookup: {
          from: "useraccounts",
          localField: "_id",
          foreignField: "user",
          as: "accounts",
          pipeline: [{ $match: { environment_type: "live" } }],
        },
      },
      { $match: { accounts: { $exists: true, $type: "array", $ne: [] } } },
      {
        $match: {
          accounts: {
            $elemMatch: {
              $or: [{ balance: { $gt: 0 } }, { equity: { $gt: 0 } }],
            },
          },
        },
      },
    ]);

    async function additionalFields(data) {
      return Promise.all(
        data.map(async (user) => {
          user = utilFunctions.decimal2JSONReturn(user);
          const balance = new Currency({ amount: 0, currency: "USD" });
          const balanceCtrader = new Currency({ amount: 0, currency: "USD" });
          const balanceMt5 = new Currency({ amount: 0, currency: "USD" });
          const balanceMt4 = new Currency({ amount: 0, currency: "USD" });
          const equity = new Currency({ amount: 0, currency: "USD" });
          const equityCtrader = new Currency({ amount: 0, currency: "USD" });
          const equityMt5 = new Currency({ amount: 0, currency: "USD" });
          const equityMt4 = new Currency({ amount: 0, currency: "USD" });

          for (const account of user.accounts) {
            const accBalance = Currency.fromPrecise({
              amount: account.balance,
              currency: account.currency,
            });
            const accEquity = Currency.fromPrecise({
              amount: account.equity,
              currency: account.currency,
            });
            let bAmount = (await accBalance.convertToCurrency("USD")).amount;
            let eAmount = (await accEquity.convertToCurrency("USD")).amount;
            balance.add(bAmount);
            equity.add(eAmount);
            if (account.platform === TIO_PLATFORMS.ctrader) {
              balanceCtrader.add(bAmount);
              equityCtrader.add(eAmount);
            } else if (account.platform === TIO_PLATFORMS.mt5) {
              balanceMt5.add(bAmount);
              equityMt5.add(eAmount);
            } else if (account.platform === TIO_PLATFORMS.mt4) {
              balanceMt4.add(bAmount);
              equityMt4.add(eAmount);
            }
          }
          return {
            ...user,
            balanceUSD: balance.getAmountPrecise(),
            equityUSD: equity.getAmountPrecise(),
            balanceCtraderUSD: balanceCtrader.getAmountPrecise(),
            equityCtraderUSD: equityCtrader.getAmountPrecise(),
            balanceMt5USD: balanceMt5.getAmountPrecise(),
            equityMt5USD: equityMt5.getAmountPrecise(),
            balanceMt4USD: balanceMt4.getAmountPrecise(),
            equityMt4USD: equityMt4.getAmountPrecise(),
          };
        })
      );
    }

    let res = null;
    if (paginated) {
      res = await UsersModel.aggregatePaginate(aggregation, {
        page,
        limit,
        sort: { createdAt: -1 },
        collation: { locale: "en", numericOrdering: true },
      });
      res.docs = await additionalFields(res.docs);
      return res;
    } else {
      res = await aggregation.exec();
      return additionalFields(res);
    }
  },
  getUsersPerCountry: async (brand, allowedCountries) => {
    // prettier-ignore
    return UsersModel.aggregate([
      { $match: { brand, ...(allowedCountries ? { country: {$in: allowedCountries}} : {}) }},
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $group: { _id: null, counts: { $push: { k: "$_id", v: "$count" } } } },
      { $replaceRoot: { newRoot: { $arrayToObject: "$counts" } } }
    ]);
  },
  getUsersPerDevice: async (brand, allowedCountries) => {
    // prettier-ignore
    return UsersModel.aggregate([
      {$match: { brand, ...(allowedCountries ? { country: {$in: allowedCountries}} : {}) }},
      { $group: { _id: null,
          android: { $sum: { $cond: [{ $eq: ["$metadata.deviceType", "android"] }, 1, 0] } },
          ios: { $sum: { $cond: [{ $eq: ["$metadata.deviceType", "iOS"] }, 1, 0] } },
          windows: { $sum: { $cond: [{$and: [{ $ne: ["$metadata.deviceType", "android"] }, { $ne: ["$metadata.deviceType", "iOS"] }]}, 1, 0] } },
      } },
      { $project: { _id: 0, android: 1, ios: 1, windows: 1 } }
    ]);
  },
  getUsersPerTimeframe: async (brand, allowedCountries) => {
    const startOfDay = DateTime.now()
      .setZone("Asia/Nicosia")
      .startOf("day")
      .toJSDate();
    const startOfWeek = DateTime.now()
      .setZone("Asia/Nicosia")
      .startOf("week")
      .toJSDate();
    const startOfMonth = DateTime.now()
      .setZone("Asia/Nicosia")
      .startOf("month")
      .toJSDate();
    // prettier-ignore
    return UsersModel.aggregate([
      {$match: { brand, ...(allowedCountries ? { country: {$in: allowedCountries}} : {}) }},
      { $group: { _id: null,
          totalUsers: { $sum: 1 },
          todayUsers: { $sum: { $cond: [{ $gte: ["$createdAt", startOfDay] }, 1, 0] } },
          weeklyUsers: { $sum: { $cond: [{ $gte: ["$createdAt", startOfWeek] }, 1, 0] } },
          monthlyUsers: { $sum: { $cond: [{ $gte: ["$createdAt", startOfMonth] }, 1, 0] } },
          monthlyFTDs: { $sum: { $cond: [{ $gte: ["$first_time_deposit.date_at", startOfMonth] }, 1, 0] } },
      } },
      { $project: { _id: 0, totalUsers: 1, todayUsers: 1, weeklyUsers: 1, monthlyUsers: 1, monthlyFTDs: 1 } }
    ]);
  },
  getUsersPerMonth: async () => {
    // prettier-ignore
    return UsersModel.aggregate([
      { $group: { _id: { Year: { $year: "$createdAt" }, Month: { $month: "$createdAt" } }, Users: { $sum: 1 } } },
      { $replaceRoot: { newRoot: { $mergeObjects: ["$_id", "$$ROOT"] } } },
      { $sort: { Year: 1, Month: 1 } },
      { $project: { _id: 0, Year: 1, Users: 1, Month: { $arrayElemAt: [ [ "", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ], "$Month" ] } } }
    ]);
  },
  getUsersCsv: async (filters = {}, brand) => {
    const { fromDate, toDate, deviceType, countriesToExport } = filters;
    // prettier-ignore
    let filter = {
      createdAt: { $gte: fromDate ? new Date(fromDate) : null, $lte: toDate ? new Date(toDate) : null, },
      "metadata.deviceType": deviceType === "all" ? null : deviceType,
      country: countriesToExport?.length > 0 ? { $in: countriesToExport.map((x) => x.toUpperCase()) } : null,
      brand,
    };
    filter = utilFunctions.pruneNullOrUndefinedFields(filter);
    // prettier-ignore
    return UsersModel.aggregate([
      { $match: filter },
      { $lookup: { from: "useraccounts", localField: "_id", foreignField: "user", as: "accounts", pipeline: [{ $group: { _id: "$environment_type", count: { $sum: 1 } } } ], } },
      { $addFields: { accounts: { $arrayToObject: { $map: { input: "$accounts", as: "el", in: { k: "$$el._id", v: "$$el.count" } } } } } },
    ]);
  },
  changePassword: async (user_id, old_password, new_password) => {
    let user = await UsersModel.findById(user_id);
    if (!(await usersService.checkUserPassword(user, old_password))) {
      throw new HTTPError(
        "Invalid password",
        401,
        errorCodes.invalidUserPassword
      );
    }
    user.password = await bcrypt.hash(new_password, BCRYPT_SALT_ROUNDS);
    let hashed_password = md5(new_password);
    user.ctrader_password = hashed_password;
    let ctrader_accounts = await userAccountsService.getUserAccounts(user._id);
    await Promise.all(
      ctrader_accounts.map(async (account) =>
        ctraderService(account.server).changeUserPassword(
          account.login_id,
          hashed_password
        )
      )
    );
    return user.save();
  },
  updateUserDetails: async ({
    user_id,
    first_name,
    last_name,
    language,
    secondaryEmail,
    deviceType,
    country,
    city,
    title,
    gender,
    dob,
    nationality,
    identificationNumber,
    address,
    houseNumber,
    unitNumber,
    postcode,
    shariaEnabled,
  }) => {
    return UsersModel.updateOne(
      { _id: user_id },
      {
        first_name,
        last_name,
        language: language,
        secondaryEmail,
        "metadata.deviceType": deviceType,
        country,
        city,
        title,
        gender,
        dob,
        nationality,
        identificationNumber,
        address,
        houseNumber,
        unitNumber,
        postcode,
        "flags.shariaEnabled": shariaEnabled,
      }
    );
  },
  // prettier-ignore
  updateUserExtraDetails: async (
    userId,
    { title, gender, dob, country, nationality, identificationNumber, address, city, postcode, houseNumber, unitNumber, }
  ) => {
    return UsersModel.findOneAndUpdate(
      { _id: userId, },
      { $set: { title, gender, dob, country, nationality, identificationNumber, address, city, postcode, houseNumber, unitNumber, "flags.detailsVerified": true, }, },
      { returnDocument: "after" }
    );
  },
  updateUserNotificationPreferences: async (userId, { dailyEmail }) => {
    return UsersModel.updateOne(
      { _id: userId },
      {
        $set: {
          "flags.receiveDailyEmails": dailyEmail,
        },
      }
    );
  },
  setKycStatus: async (user_id, status) => {
    let user = await UsersModel.findOneAndUpdate(
      { _id: user_id },
      {
        $set: {
          "flags.kycStatus": status,
          "flags.kycApproved": status === USER_KYC_STATUS.approved,
        },
      },
      {
        returnDocument: "after",
      }
    );
    if (user.flags.kycStatus === USER_KYC_STATUS.approved) {
      await emailService.kycApprovedEmail({ user });
      await userAccountsService.unlockUserAccounts(user_id);
    } else {
      await userAccountsService.lockUserAccounts(user_id);
    }
    return user;
  },
  approveKYC: async (user_id) => {
    let user = await UsersModel.findOneAndUpdate(
      { _id: user_id },
      {
        $set: {
          "flags.kycStatus": USER_KYC_STATUS.approved,
          "flags.kycApproved": true,
        },
      },
      {
        returnDocument: "after",
      }
    );
    await userAccountsService.unlockUserAccounts(user_id);
    return user;
  },
  rejectKYC: async (user_id) => {
    let user = await UsersModel.findOneAndUpdate(
      { _id: user_id },
      {
        $set: {
          "flags.kycStatus": USER_KYC_STATUS.rejected,
          "flags.kycApproved": false,
        },
      },
      { returnDocument: "after" }
    );
    await userAccountsService.lockUserAccounts(user_id);
    return user;
  },
  getUserExtraDetails: async (user_id) => {
    // prettier-ignore
    let result = await UsersModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(user_id) } },
      { $lookup: { from: "useraccounts", localField: "_id", foreignField: "user", as: "accounts_info", pipeline: [{ $match: { archived: {$ne: true}}}] }, },
      { $lookup: { from: "usertransactions", localField: "_id", foreignField: "user", as: "user_transactions", pipeline: [ { $match: { transaction_status: "approved" }, }, { $sort: { createdAt: 1 }, }, ], }, },
    ]).then(res => res[0]);
    utilFunctions.decimal2JSON(result);
    const firstTransaction = result.user_transactions[0];
    let ftdDate = firstTransaction
      ? new Date(firstTransaction.createdAt)
      : "N/A";
    let ftdAmount = firstTransaction?.processed_usd_amount ?? "N/A";

    const { countDemo, countLive } = result.accounts_info.reduce(
      (acc, cur) =>
        cur.environment_type === "demo"
          ? { ...acc, countDemo: acc.countDemo + 1 }
          : { ...acc, countLive: acc.countLive + 1 },
      { countDemo: 0, countLive: 0 }
    );
    // This is a temporary fix when the exchange has expired and needs to refetch
    await currencyService.getCurrencyExchangeFromUSD("EUR");

    const liveAccountBalancesInUSD = await Promise.all(
      result.accounts_info.map(async (account) => {
        if (account.environment_type === "demo") return 0;
        const exchangeRate = await currencyService.getCurrencyExchangeFromUSD(
          account.currency
        );
        return (Number(account.balance) ?? 0) * exchangeRate;
      })
    );
    const balance = liveAccountBalancesInUSD.reduce((acc, cur) => acc + cur, 0);

    return {
      demoAccounts: countDemo,
      liveAccounts: countLive,
      balance,
      ftdDate,
      ftdAmount,
    };
  },
  checkUserFirstTimeDeposit: async (user, transaction) => {
    try {
      if (!user.hasOwnProperty("first_time_deposit")) {
        await UsersModel.updateOne(
          { _id: user._id },
          {
            $set: {
              "first_time_deposit.date_at":
                transaction.timestamp || transaction.createdAt,
              "first_time_deposit.amount": mongoose.Types.Decimal128(
                String(transaction.processed_usd_amount)
              ),
              "first_time_deposit.transaction": transaction._id,
            },
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  },
  checkUserFirstTimeWithdrawal: async (user, transaction) => {
    try {
      if (!user.hasOwnProperty("first_time_withdrawal")) {
        await UsersModel.updateOne(
          { _id: user._id },
          {
            $set: {
              "first_time_withdrawal.date_at":
                transaction.timestamp || transaction.createdAt,
              "first_time_withdrawal.amount": transaction.processed_usd_amount,
              "first_time_withdrawal.transaction": transaction._id,
            },
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  },
  checkUserFirstTimeTrade: async (user_id, ctraderDeal) => {
    try {
      let user = await UsersModel.findById(user_id);
      if (
        !user.hasOwnProperty("first_time_trade") &&
        ctraderDeal.dealStatus === CTRADER_DEAL_STATUS.FILLED
      ) {
        await UsersModel.updateOne(
          { _id: user._id },
          {
            $set: {
              "first_time_trade.date_at":
                ctraderDeal.executionTimestamp ||
                ctraderDeal.createTimestamp ||
                ctraderDeal.createdAt,
              "first_time_trade.amount":
                ctraderDeal.baseToUsdConversionRate * ctraderDeal.filledVolume,
              "first_time_trade.deal": ctraderDeal._id,
            },
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  },
  searchUser: async (field, value, brand, allowedCountries) => {
    if (field === "id") {
      let userId;
      try {
        userId = new mongoose.Types.ObjectId(value);
      } catch (err) {
        return [];
      }
      return UsersModel.find({
        _id: userId,
        brand: brand,
        ...(allowedCountries ? { country: { $in: allowedCountries } } : {}),
      });
    }
    if (field === "account") {
      // prettier-ignore
      return UsersModel.aggregate([
        { $match: { brand, ...(allowedCountries ? { country: { $in: allowedCountries } } : {}), }, },
        { $lookup: { as: "account", from: "useraccounts", localField: "_id", foreignField: "user", pipeline: [{ $match: { login_id: { $regex: `^${utilFunctions.escapeStringForRegExp(value)}` } } }], }, },
        { $unwind: "$account" },
        { $limit: 5, },
      ]);
    }
    if (field === "readableId") {
      if (_.isNaN(Number(value)))
        throw new HTTPError("Invalid search value", 400, {
          message: "Invalid search value",
        });
      return UsersModel.find({
        readableId: value,
        brand: brand,
        ...(allowedCountries ? { country: { $in: allowedCountries } } : {}),
      });
    }

    if (field === "phone") {
      return UsersModel.find({
        phone: {
          $regex: `^${utilFunctions.escapeStringForRegExp(value)}`,
          $options: "i",
        },
        brand,
        ...(allowedCountries ? { country: { $in: allowedCountries } } : {}),
      }).limit(5);
    }
    if (field === "email") {
      return UsersModel.find({
        $or: [
          {
            email: {
              $regex: `^${utilFunctions.escapeStringForRegExp(value)}`,
              $options: "i",
            },
          },
          {
            secondaryEmail: {
              $regex: `^${utilFunctions.escapeStringForRegExp(value)}`,
              $options: "i",
            },
          },
        ],
        brand,
        ...(allowedCountries ? { country: { $in: allowedCountries } } : {}),
      }).limit(5);
    }
    if (field === "mt5_id") {
      return UsersModel.find({
        mt5_id: {
          $regex: `^${utilFunctions.escapeStringForRegExp(value)}`,
          $options: "i",
        },
        brand,
        ...(allowedCountries ? { country: { $in: allowedCountries } } : {}),
      }).limit(5);
    }
    if (field === "ctrader_id") {
      return UsersModel.find({
        ctrader_id: {
          $regex: `^${utilFunctions.escapeStringForRegExp(value)}`,
          $options: "i",
        },
        brand,
        ...(allowedCountries ? { country: { $in: allowedCountries } } : {}),
      }).limit(5);
    }
    return [];
  },
  setPhoneVerified: async (user_id) => {
    return UsersModel.findOneAndUpdate(
      { _id: user_id },
      { $set: { "flags.phoneVerified": true } },
      { returnDocument: "after" }
    );
  },
  changeEmail: async ({ user_id, email }) => {
    const accounts = await userAccountsService.getUserAccounts(user_id);
    if (accounts.length > 0) {
      throw new HTTPError("Cannot change email with active accounts", 409, {
        message: "Cannot change email with active accounts",
      });
    }
    const user = await usersService.getUserById(user_id);
    const existingUserWithEmail = await usersService.getUserByEmailEntity({
      brand: user.brand,
      email,
      entity: user.entity,
    });
    if (existingUserWithEmail) {
      throw new HTTPError("Email already in use", 409, {
        message: "Email already in use",
      });
    }
    return UsersModel.findOneAndUpdate(
      { _id: user_id },
      { $set: { email, "flags.emailVerified": false } },
      { returnDocument: "after" }
    );
  },
  changePhone: async ({ user_id, phone }) => {
    return UsersModel.findOneAndUpdate(
      { _id: user_id },
      { $set: { phone, "flags.phoneVerified": true } },
      { returnDocument: "after" }
    );
  },
  setEmailVerified: async (user_id) => {
    return UsersModel.findOneAndUpdate(
      { _id: user_id },
      { $set: { "flags.emailVerified": true } },
      { returnDocument: "after" }
    );
  },
  formatUserForSend: (user) => {
    delete user.password;
    delete user.ctrade_password;
    return user;
  },
  updateUserUTMs: async (
    user_id,
    { utm_source, utm_medium, utm_campaign, utm_term, utm_content }
  ) => {
    return UsersModel.updateOne(
      { _id: user_id },
      {
        $set: {
          "metadata.utm_source": utm_source,
          "metadata.utm_medium": utm_medium,
          "metadata.utm_campaign": utm_campaign,
          "metadata.utm_term": utm_term,
          "metadata.utm_content": utm_content,
        },
      }
    );
  },
  suspendUser: async (user_id) => {
    await userAccountsService.lockUserAccounts(user_id);
    return UsersModel.updateOne(
      { _id: user_id },
      { $set: { isSuspended: true } }
    );
  },
  unsuspendUser: async (user_id) => {
    await userAccountsService.unlockUserAccounts(user_id);
    return UsersModel.updateOne(
      { _id: user_id },
      { $set: { isSuspended: false } }
    );
  },
};

export default usersService;
