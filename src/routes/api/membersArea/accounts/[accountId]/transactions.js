import { RequestHandler } from "express";
import errorCodes from "../../../../../config/errorCodes";
import { isMembersAreaUser } from "../../../../../middleware/membersArea.middleware";
import { hasAccessToAccount } from "../../../../../middleware/hasAccessToAccount";
import userTransactionsService from "../../../../../services/userTransactions.service";
import Joi from "joi";
import HTTPError from "../../../../../utils/HTTPError";
import mongoose from "mongoose";

const getUserTransactionsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
  accountId: Joi.string().required(),
});

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = getUserTransactionsQuerySchema.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid request query", 400, {
      ...error,
      ...errorCodes.queryValidation,
    });
  }
  let transactions = await userTransactionsService.getUserTransactions({
    page: value.page,
    limit: value.limit,
    filters: { userAccount: mongoose.Types.ObjectId(value.accountId) },
    paginated: true,
    brand: req.user.brand,
  });

  res.status(200).json(transactions);
};

export default {
  middleware: {
    all: [isMembersAreaUser],
    get: [hasAccessToAccount],
  },
};
