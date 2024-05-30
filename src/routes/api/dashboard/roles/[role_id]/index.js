import { RequestHandler } from "express";
import { PERMISSIONS } from "../../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import crmRolesService from "../../../../../services/crmRoles.service";

/**
 * @type {RequestHandler}
 */
export const DELETE = async (req, res) => {
  // Business logic
  const deleted = await crmRolesService.deleteRoleById(
    req.query.role_id,
    req.selectedBrand
  );
  res.status(201).json({ role: deleted });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    delete: [userHasAnyPermission([PERMISSIONS.ROLES.delete_role])],
  },
};
