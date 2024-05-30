import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../../config/errorCodes";
import { PERMISSIONS } from "../../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import crmRolesService from "../../../../../services/crmRoles.service";
import { validPermissionsSchema } from "../../../../../utils/customValidation";
import HTTPError from "../../../../../utils/HTTPError";

const crmAddRolePermissionsSchema = Joi.object({
  permissions: Joi.array().items(validPermissionsSchema).required(),
});

/**
 * @type {RequestHandler}
 */
export const PATCH = async (req, res) => {
  // Validate request query
  const { value, error } = crmAddRolePermissionsSchema.validate(req.body);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.bodyValidation });
  }

  let userRole = await crmRolesService.addPermissionsToRole(
    req.query.role_id,
    value.permissions,
    req.selectedBrand
  );
  res.status(201).json({ role: userRole });
};

const crmRemoveUserPermissionsSchema = Joi.object({
  permissions: Joi.array().items(validPermissionsSchema).required(),
});

/**
 * @type {RequestHandler}
 */
export const DELETE = async (req, res) => {
  // Validate request query
  const { value, error } = crmRemoveUserPermissionsSchema.validate(req.body);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.bodyValidation });
  }

  let userRole = await crmRolesService.removePermissionsToRole(
    req.query.role_id,
    value.permissions,
    req.selectedBrand
  );
  res.status(201).json({ role: userRole });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    PATCH: [userHasAnyPermission([PERMISSIONS.ROLES.add_role_permissions])],
    DELETE: [userHasAnyPermission([PERMISSIONS.ROLES.remove_role_permissions])],
  },
};
