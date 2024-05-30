// import errorCodes from "../../../config/errorCodes";
// import usersService from "../../../backend/services/users.service";
// import validator from "../../../backend/validation/validator";
// import { userIsLoggedIn } from "../../../backend/middleware/user.middleware";
// import userLogsService from "../../../backend/services/userLogs.service";
import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import { userIsLoggedIn } from "../../../../middleware/user.middleware";
import userLogsService from "../../../../services/userLogs.service";
import usersService from "../../../../services/users.service";
import { passwordFunction } from "../../../../utils/customValidation";

const changePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().custom(passwordFunction).required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = changePasswordSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ ...error.details, ...errorCodes.bodyValidation });
  }
  // Business logic
  await usersService.changePassword(
    req.user,
    value.old_password,
    value.new_password
  );
  await userLogsService.USER_ACTIONS.changePassword(req.user);
  res.status(200).json({ message: "Success" });
};

export default {
  middleware: {
    all: [userIsLoggedIn],
  },
};
