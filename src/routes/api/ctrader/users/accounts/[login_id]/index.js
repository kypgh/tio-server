import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../../../config/errorCodes";
import {
  userIsLoggedIn,
  userOwnsAccount,
} from "../../../../../../middleware/user.middleware";
import ctraderService from "../../../../../../services/ctrader.service";
import userLogsService from "../../../../../../services/userLogs.service";
import userRequestsService from "../../../../../../services/userRequests.service";
import HTTPError from "../../../../../../utils/HTTPError";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const details = await ctraderService(
    req.userAccount.server
  ).getTraderAccountByLogin(req.userAccount.login_id);
  res.status(200).json({ account: req.userAccount, details });
};

const userRequestsDeleteAccountSchema = Joi.object({
  description: Joi.string().required(),
});

/**
 * @type {RequestHandler}
 */
export const DELETE = async (req, res) => {
  const { value, error } = userRequestsDeleteAccountSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Invalid request body", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }
  if (req.userAccount.first_account) {
    throw new HTTPError("Conflict", 409, errorCodes.cannotDeleteFirstAccount);
  }
  let delRequest = await userRequestsService.DELETE_ACCOUNT.request(
    req.user._id,
    req.userAccount._id,
    req.userAccount.login_id,
    value.description
  );
  await userLogsService.USER_ACTIONS.deleteAccountRequest(
    req.user,
    req.userAccount,
    delRequest
  );
  res.status(201).json({ message: "Account deletion request sent!" });
};

export default {
  middleware: {
    all: [userIsLoggedIn, userOwnsAccount],
  },
};
