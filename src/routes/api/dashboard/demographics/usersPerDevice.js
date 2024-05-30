import { RequestHandler } from "express";
import errorCodes from "../../../../config/errorCodes";
import { PERMISSIONS } from "../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../middleware/permissions.middleware";
import usersService from "../../../../services/users.service";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  // Business logic

  let [usersPerDevice] = await usersService.getUsersPerDevice(
    req.selectedBrand,
    req.allowedCountries
  );
  if (usersPerDevice.length === 0)
    return res.status(500).json(errorCodes.serverError);
  res.status(200).json(usersPerDevice);
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    GET: [
      userHasAnyPermission([PERMISSIONS.DEMOGRAPHICS.get_users_per_device]),
    ],
  },
};
