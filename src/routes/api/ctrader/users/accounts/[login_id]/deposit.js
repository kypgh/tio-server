import { RequestHandler } from "express";
import errorCodes from "../../../../../../config/errorCodes";
import {
  userIsLoggedIn,
  userOwnsAccount,
} from "../../../../../../middleware/user.middleware";
import praxisService from "../../../../../../services/praxis.service";
import HTTPError from "../../../../../../utils/HTTPError";

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  if (req.userAccount.environment_type === "demo") {
    throw new HTTPError(
      "Cannot deposit to demo account",
      400,
      errorCodes.cannotDepositToDemoAccount
    );
  }
  const result = await praxisService.deposit(
    req.userAccount,
    req.user.toObject(),
    "ctraderApp"
  );
  res.status(200).json(result);
};

export default {
  middleware: {
    all: [userIsLoggedIn, userOwnsAccount],
  },
};
