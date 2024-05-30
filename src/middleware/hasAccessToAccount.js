import { RequestHandler } from "express";
import errorCodes from "../config/errorCodes";
import userAccountsService from "../services/userAccounts.service";
import Joi from "joi";
import { mongooseIDFunction } from "../utils/customValidation";

const getAccountSchema = Joi.object({
  accountId: Joi.string().custom(mongooseIDFunction).required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const hasAccessToAccount = async (req, res, next) => {
  const { value, error } = getAccountSchema.validate(req.query);
  if (error) {
    return res.status(400).json(error);
  }

  let account = await userAccountsService.getAccountById(value.accountId);

  if (String(account.user._id) != String(req.user._id)) {
    return res.status(401).json({
      message: "The current user does not have access to this account",
    });
  }
  req.userAccount = account;
  next();
};
