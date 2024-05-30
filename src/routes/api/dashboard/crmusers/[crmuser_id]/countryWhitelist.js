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
import HTTPError from "../../../../../utils/HTTPError";
import { COUNTRIES_ISO2 } from "../../../../../config/countries";
import { mongooseIDFunction } from "../../../../../utils/customValidation";

const crmUpdateCountryWhitelistSchema = Joi.object({
  crmuser_id: Joi.string().custom(mongooseIDFunction).required(),
  enable_country_whitelist: Joi.boolean().required(),
  whitelist_countries: Joi.array()
    .items(Joi.string().valid(...COUNTRIES_ISO2))
    .required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  // Validate request
  const { value, error } = crmUpdateCountryWhitelistSchema.validate({
    ...req.body,
    ...req.query,
  });
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.bodyValidation });
  }
  // Business logic
  let updatedPermissions = await crmUsersService.updateUserWhitelistCountries({
    crmuserId: value.crmuser_id,
    brand: req.selectedBrand,
    ...value,
  });
  res.status(201).json({ permissions: updatedPermissions });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    put: [
      userHasAnyPermission([
        PERMISSIONS.CRM_USERS.update_crm_user_whitelist_countries,
      ]),
    ],
  },
};
