import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import usersService from "../../../../../../services/users.service";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../../config/permissions";
import { RequestHandler } from "express";
import HTTPError from "../../../../../../utils/HTTPError";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  let user = await usersService.getUserByCTID(req.query.ctid);
  if (user.brand !== req.selectedBrand) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.allowedCountries && !req.allowedCountries.includes(user?.country)) {
    throw new HTTPError("Not allowed to access this users accounts", 401, {
      message: "Unauthorized",
    });
  }
  res.status(200).json({ user });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.USERS.get_user])],
  },
};
