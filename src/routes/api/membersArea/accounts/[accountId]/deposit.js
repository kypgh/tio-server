import { RequestHandler } from "express";
import Joi from "joi";
import { isMembersAreaUser } from "../../../../../middleware/membersArea.middleware";
import praxisService from "../../../../../services/praxis.service";
import userAccountsService from "../../../../../services/userAccounts.service";
import { mongooseIDFunction } from "../../../../../utils/customValidation";

const depositToAccountSchema = Joi.object({
  accountId: Joi.string().custom(mongooseIDFunction).required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = depositToAccountSchema.validate(req.query);
  if (error) {
    res.status(400).json(error);
    return;
  }
  const account = await userAccountsService.getAccountById(value.accountId);
  if (!account) {
    res.status(400).json({ message: "Account not found" });
    return;
  }
  if (account.environment_type === "demo") {
    res.status(409).json({ message: "Demo accounts cannot deposit" });
    return;
  }
  const result = await praxisService.deposit(account, req.user, "membersArea");
  res.status(200).json({ auth_token: result.session.auth_token });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
