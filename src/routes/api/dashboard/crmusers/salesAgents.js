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

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  // Business logic
  let sales_agents = await crmUsersService.getSalesAgentsForBrand(
    req.selectedBrand
  );
  res.status(200).json({ sales_agents });
};

export default {
  middleware: {
    all: [
      isCRMUser,
      checkBrandAccess,
      userHasAnyPermission([PERMISSIONS.USERS.change_sales_assignment]),
    ],
  },
};
