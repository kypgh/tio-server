import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import { userIsLoggedIn } from "../../../../middleware/user.middleware";
import userLogsService from "../../../../services/userLogs.service";
import usersService from "../../../../services/users.service";
import HTTPError from "../../../../utils/HTTPError";

const changeUserEmailSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});
/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  res.status(409).json({ message: "Not allowed" });
  return;
  // const { value, error } = changeUserEmailSchema.validate(req.body);
  // if (error) {
  //   // prettier-ignore
  //   throw new HTTPError("Validation error", 400, { ...error.details, ...errorCodes.bodyValidation });
  // }

  // const isValidPassword = await usersService.checkUserPassword(
  //   req.user,
  //   value.password
  // );
  // if (!isValidPassword) {
  //   throw new HTTPError(
  //     "Invalid password",
  //     403,
  //     errorCodes.invalidUserPassword
  //   );
  // }

  // // prettier-ignore
  // const old_email = req.user.email, new_email = value.email;
  // // Business logic
  // await usersService.changeEmail(req.user, value.email);
  // // prettier-ignore
  // await userLogsService.USER_ACTIONS.changeEmail(req.user, old_email, new_email);
  // res.status(200).json({ message: "Success" });
};

export default {
  middleware: {
    all: [userIsLoggedIn],
  },
};
