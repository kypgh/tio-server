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
import HTTPError from "../../../../../utils/HTTPError";

const changeSalesAgentSchema = Joi.object({
  user_id: Joi.string().custom(mongooseIDFunction).required(),
  sales_agent_id: Joi.string().custom(mongooseIDFunction).required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  const { error, value } = changeSalesAgentSchema.validate({
    ...req.body,
    user_id: req.query.user_id,
  });
  if (error) {
    throw new HTTPError("Invalid request body", 400, {
      ...error,
      ...errorCodes.invalidRequestBody,
    });
  }

  const result = await usersService.changeSalesAgent(value);
  res.status(201).json({ message: "Email changed successfully" });
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    put: [userHasAnyPermission([PERMISSIONS.USERS.update_user])],
  },
};
