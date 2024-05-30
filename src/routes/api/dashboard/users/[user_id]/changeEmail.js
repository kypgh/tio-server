import { RequestHandler } from "express";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../config/permissions";
import { mongooseIDFunction } from "../../../../../utils/customValidation";
import usersService from "../../../../../services/users.service";
import Joi from "joi";
import {
  checkAccessToUserId,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import userAccountsService from "../../../../../services/userAccounts.service";

export const GET = async (req, res) => {
  const accoutns = await userAccountsService.getUserAccounts(req.query.user_id);
  res.status(200).json({ allowed: accoutns.length === 0 });
};

const changeEmailSchema = Joi.object({
  user_id: Joi.string().custom(mongooseIDFunction).required(),
  email: Joi.string().email().trim().required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  const { error, value } = changeEmailSchema.validate({
    ...req.body,
    user_id: req.query.user_id,
  });
  if (error) {
    throw new HTTPError("Invalid request body", 400, {
      ...error,
      ...errorCodes.invalidRequestBody,
    });
  }

  const result = await usersService.changeEmail(value);
  res.status(201).json(result);
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    put: [userHasAnyPermission([PERMISSIONS.USERS.update_user])],
  },
};
