import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import { PERMISSIONS } from "../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../middleware/permissions.middleware";
import crmRolesService from "../../../../services/crmRoles.service";
import { validPermissionsSchema } from "../../../../utils/customValidation";
import HTTPError from "../../../../utils/HTTPError";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const roles = await crmRolesService.getAllRoles(req.selectedBrand);
  res.status(200).json({ roles });
};

const crmCreatePermissionsRoleSchema = Joi.object({
  name: Joi.string().trim().required(),
  permissions: Joi.array().items(validPermissionsSchema).required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request query
  const { value, error } = crmCreatePermissionsRoleSchema.validate(req.body);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.bodyValidation });
  }
  const userRole = await crmRolesService.createNewRole(
    value.name,
    value.permissions,
    req.selectedBrand
  );
  return res.status(200).json({ role: userRole });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.ROLES.view_roles])],
    post: [userHasAnyPermission([PERMISSIONS.ROLES.create_role])],
  },
};
