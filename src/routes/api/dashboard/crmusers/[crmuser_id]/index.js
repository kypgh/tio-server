import { RequestHandler } from "express";
import Joi from "joi";
import { CRM_USER_DEPARTMENTS } from "../../../../../config/enums";
import errorCodes from "../../../../../config/errorCodes";
import { PERMISSIONS } from "../../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import crmUsersService from "../../../../../services/crmUsers.service";
import {
  mongooseIDFunction,
  passwordFunction,
} from "../../../../../utils/customValidation";
import HTTPError from "../../../../../utils/HTTPError";

const crmUpdateUserSchema = Joi.object({
  email: Joi.string().email().lowercase(),
  password: Joi.string().custom(passwordFunction),
  first_name: Joi.string(),
  last_name: Joi.string(),
  role: Joi.string().custom(mongooseIDFunction),
  department: Joi.string().valid(...Object.values(CRM_USER_DEPARTMENTS)),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const PATCH = async (req, res) => {
  // Validate request
  const { value, error } = crmUpdateUserSchema.validate(req.body);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.bodyValidation });
  }
  // Business logic
  let update_details = await crmUsersService.updateUserDetails(
    req.query.crmuser_id,
    req.selectedBrand,
    value
  );
  res.status(201).json(update_details);
};

const mongooseIdSchema = Joi.string().custom(mongooseIDFunction).required();

/**
 * @type {RequestHandler}
 */
export const DELETE = async (req, res) => {
  // Validate request
  const { value, error } = mongooseIdSchema.validate(req.query.crmuser_id);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid crmuser_id", 400, { ...error, ...errorCodes.bodyValidation });
  }
  // Business logic
  let delete_details = await crmUsersService.deleteCRMUser(
    value,
    req.selectedBrand
  );
  res.status(201).json(delete_details);
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    patch: [userHasAnyPermission([PERMISSIONS.CRM_USERS.update_crm_user])],
    delete: [userHasAnyPermission([PERMISSIONS.CRM_USERS.delete_crm_user])],
  },
};
