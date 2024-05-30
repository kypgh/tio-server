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
import { mongooseIDFunction } from "../../../../utils/customValidation";

const copyCRMUserSchema = Joi.object({
  crmuserId: Joi.string().custom(mongooseIDFunction).required(),
  otherBrand: Joi.string().required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate reuqest query
  const { value, error } = copyCRMUserSchema.validate(req.body);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.queryValidation });
  }

  // Business logic
  let crm_user = await crmUsersService.copyCRMUserPermissions(
    value.crmuserId,
    req.selectedBrand,
    value.otherBrand
  );
  res.status(200).json({ crm_user });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess, userHasAnyPermission([])],
  },
};
