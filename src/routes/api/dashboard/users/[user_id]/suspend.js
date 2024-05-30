import Joi from "joi";
import { PERMISSIONS } from "../../../../../config/permissions";
import {
  checkAccessToUserId,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import userAccountsService from "../../../../../services/userAccounts.service";
import usersService from "../../../../../services/users.service";
import HTTPError from "../../../../../utils/HTTPError";
import { mongooseIDFunction } from "../../../../../utils/customValidation";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";

const UserSuspendSchema = Joi.object({
  user_id: Joi.string().custom(mongooseIDFunction).required(),
}).unknown(true);
const UserSuspendBodySchema = Joi.object({
  suspend: Joi.boolean().required(),
}).unknown(true);

/**
 * @type {import("express").RequestHandler}
 */
export const PUT = async (req, res) => {
  const { value, error } = UserSuspendSchema.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid request body", 400, error);
  }
  const { value: bodyValue, error: bodyError } = UserSuspendBodySchema.validate(
    req.body
  );
  if (bodyError) {
    throw new HTTPError("Invalid request body", 400, bodyError);
  }

  const user = await usersService.getUserById(value.user_id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (bodyValue.suspend) {
    if (user.isSuspended) {
      return res.status(400).json({ message: "User already suspended" });
    }

    await usersService.suspendUser(user._id);

    res.status(200).json({ message: "User suspended" });
  } else {
    if (!user.isSuspended) {
      return res.status(400).json({ message: "User already unsuspended" });
    }

    await usersService.unsuspendUser(user._id);

    res.status(200).json({ message: "User unsuspended" });
  }
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    put: [userHasAnyPermission([PERMISSIONS.USERS.suspend_user])],
  },
};
