import { RequestHandler } from "express";
import errorCodes from "../../../../../config/errorCodes";
import { isMembersAreaUser } from "../../../../../middleware/membersArea.middleware";
import userAccountsService from "../../../../../services/userAccounts.service";
import Joi from "joi";
import HTTPError from "../../../../../utils/HTTPError";
import mt5Service from "../../../../../services/mt5.service";
import { mongooseIDFunction } from "../../../../../utils/customValidation";
import emailService from "../../../../../services/email.service";
import mt4Service, {
  createMt4AccountRandomPassword,
} from "../../../../../services/mt4.service";

const resetPasswordQuerySchema = Joi.object({
  accountId: Joi.string().custom(mongooseIDFunction).required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = resetPasswordQuerySchema.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid request query", 400, {
      ...error,
      ...errorCodes.queryValidation,
    });
  }

  let account = await userAccountsService.getAccountById(value.accountId);

  if (account.platform === "mt5") {
    const randomPassword = mt5Service.createAccountRandomPassword();
    await mt5Service.changeAccountPassword({
      password: randomPassword,
      environment_type: account.environment_type,
      login: account.login_id,
    });
    await emailService.forgotMT5AccountPasswordEmail({
      user: req.user,
      account: account,
      password: randomPassword,
    });
    res
      .status(200)
      .json({ message: "Email has been sent with a new password" });
  } else if (account.platform === "mt4") {
    const randomPassword = await createMt4AccountRandomPassword();
    await mt4Service(account.server).changeAccountPassword({
      password: randomPassword,
      loginId: account.login_id,
    });
    await emailService.forgotMT4AccountPasswordEmail({
      user: req.user,
      account: account,
      password: randomPassword,
    });
    res
      .status(200)
      .json({ message: "Email has been sent with a new password" });
  } else {
    res
      .status(400)
      .json("this functionality is not yet supported for this platform");
  }
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
