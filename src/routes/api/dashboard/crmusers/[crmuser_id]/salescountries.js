// import { isCRMUser } from "../../../../../backend/middleware/auth.middleware";
// import errorCodes from "../../../../../config/errorCodes";
// import validator from "../../../../../backend/validation/validator";
// import crmUsersService from "../../../../../backend/services/crmUsers.service";
// import { userHasAnyPermission } from "../../../../../backend/middleware/permissions.middleware";
// import { PERMISSIONS } from "../../../../../config/permissions";
// import HTTPError from "../../../../../backend/utils/HTTPError";
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
import { mongooseIDFunction } from "../../../../../utils/customValidation";
import HTTPError from "../../../../../utils/HTTPError";

const crmAddSalesCountriesSchema = Joi.object({
  crmuser_id: Joi.string().custom(mongooseIDFunction).required(),
  sales_rotation_countries: Joi.array().required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const PATCH = async (req, res) => {
  // Validate request
  const { value, error } = crmAddSalesCountriesSchema.validate({
    ...req.body,
    ...req.query,
  });

  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.bodyValidation });
  }

  // Business logic
  let update_details = await crmUsersService.addCRMSalesCountries(
    req.query.crmuser_id,
    value.sales_rotation_countries,
    req.selectedBrand
  );
  res.status(201).json(update_details);
};

const crmRemoveSalesCountriesSchema = Joi.object({
  crmuser_id: Joi.string().custom(mongooseIDFunction).required(),
  sales_rotation_countries: Joi.array().required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const DELETE = async (req, res) => {
  // Validate request
  const { value, error } = crmRemoveSalesCountriesSchema.validate({
    ...req.body,
    ...req.query,
  });

  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.bodyValidation });
  }
  // Business logic
  let update_details = await crmUsersService.removeCRMSalesCountries(
    req.query.crmuser_id,
    value.sales_rotation_countries,
    req.selectedBrand
  );
  res.status(201).json(update_details);
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    patch: [
      userHasAnyPermission([
        PERMISSIONS.CRM_USERS.add_crm_user_sales_countries,
      ]),
    ],
    delete: [
      userHasAnyPermission([
        PERMISSIONS.CRM_USERS.remove_crm_user_sales_countries,
      ]),
    ],
  },
};
