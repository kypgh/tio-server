import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../../config/errorCodes";
import { PERMISSIONS } from "../../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import crmUsersService from "../../../../../services/crmUsers.service";
import { validPermissionsSchema } from "../../../../../utils/customValidation";
import HTTPError from "../../../../../utils/HTTPError";

const crmAddUserPermissionsSchema = Joi.object({
  permissions: Joi.array().items(validPermissionsSchema).required(),
}).unknown(true);
/**
 * @type {RequestHandler}
 */
export const PATCH = async (req, res) => {
  // Validate request
  const { value, error } = crmAddUserPermissionsSchema.validate(req.body);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.bodyValidation });
  }

  // Business logic
  let result = await crmUsersService.addUserPermissions(
    req.query.crmuser_id,
    value.permissions,
    req.selectedBrand
  );

  res.status(200).json({ update: result });
};

const crmRemoveUserPermissionsSchema = Joi.object({
  permissions: Joi.array().items(validPermissionsSchema).required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const DELETE = async (req, res) => {
  // Validate request
  const { value, error } = crmRemoveUserPermissionsSchema.validate(req.body);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.bodyValidation });
  }

  // Business logic
  let result = await crmUsersService.removeUserPermissions(
    req.query.crmuser_id,
    value.permissions,
    req.selectedBrand
  );

  res.status(200).json({ update: result });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    patch: [
      userHasAnyPermission([PERMISSIONS.CRM_USERS.add_crm_user_permissions]),
    ],
    delete: [
      userHasAnyPermission([PERMISSIONS.CRM_USERS.remove_crm_user_permissions]),
    ],
  },
};
