import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import { PERMISSIONS } from "../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../middleware/permissions.middleware";
import crmUsersService from "../../../../services/crmUsers.service";
import HTTPError from "../../../../utils/HTTPError";

const getCRMUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  // Validate reuqest query
  const { value, error } = getCRMUsersSchema.validate(req.query);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.queryValidation });
  }
  // Business logic
  let crm_users = await crmUsersService.getAllCRMUsers({
    ...value,
    brand: req.selectedBrand,
  });
  res.status(200).json(crm_users);
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess, userHasAnyPermission([])],
  },
};
