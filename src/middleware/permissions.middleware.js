import errorCodes from "../config/errorCodes";
import { userPermissionsContainAny } from "../models/CRMUsers.model";
import { RequestHandler } from "express";
import crmUsersService from "../services/crmUsers.service";

/**
 * @param {String[]} permission
 * @returns {RequestHandler}
 *
 * Use a list of permissions required to access the route
 *
 * NOTE: Need to be used after isCRMUser
 */
export const userHasAnyPermission = (permissions) => async (req, res, next) => {
  if (!req.crm_user) {
    return res.status(403).json(errorCodes.invalidJWT);
  }
  let roleName = req.crm_user?.role?.name;
  let userPermissions = req.crm_user?.permissions ?? [];
  let rolePermissions = req.crm_user?.role?.permissions ?? [];
  if (req.selectedBrand && req.crm_user.selectedBrand !== req.selectedBrand) {
    // admin role bypasses permissions
    let perms = await crmUsersService.getCRMUserPermissionsByBrand(
      req.crm_user._id,
      req.selectedBrand
    );
    roleName = perms?.role?.name;
    userPermissions = perms?.permissions ?? [];
    rolePermissions = perms?.role?.permissions ?? [];
  }
  if (roleName === "admin") return next();
  if (userPermissionsContainAny(userPermissions, rolePermissions, permissions))
    return next();
  // prettier-ignore
  return res.status(403).json({...errorCodes.forbidden, details: `[ACCESS DENIED] user does not have required permissions. (${permissions.join(",")})` });
};

export const checkPermissions = (crm_user, permissions) => {
  if (!crm_user) {
    return false;
  }
  // admin role bypasses permissions
  if (crm_user?.role?.name === "admin") return true;
  if (
    userPermissionsContainAny(
      crm_user?.permissions ?? [],
      crm_user?.role?.permissions ?? [],
      permissions
    )
  )
    return true;
  // prettier-ignore
  return false;
};
