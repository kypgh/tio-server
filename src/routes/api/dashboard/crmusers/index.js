import { RequestHandler } from "express";
import Joi from "joi";
import { CRM_USER_DEPARTMENTS } from "../../../../config/enums";
import errorCodes from "../../../../config/errorCodes";
import { PERMISSIONS } from "../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../middleware/permissions.middleware";
import crmUsersService from "../../../../services/crmUsers.service";
import {
  mongooseIDFunction,
  passwordFunction,
  sortValidationSchema,
  validPermissionsSchema,
} from "../../../../utils/customValidation";
import HTTPError from "../../../../utils/HTTPError";

const getCRMUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
  department: Joi.string().valid(...Object.values(CRM_USER_DEPARTMENTS)),
  sort: sortValidationSchema({
    first_name: "first_name",
    last_name: "last_name",
    department: "department",
  }),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  // Validate reuqest query
  const { value, error } = getCRMUsersSchema.validate(req.query);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.queryValidation });
  }
  // Business logic
  let crm_users = await crmUsersService.getAllCRMUsersPerBrand(
    value.page,
    value.limit,
    value.sort,
    value.department,
    req.selectedBrand
  );
  res.status(200).json(crm_users);
};

const crmCreateUserSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().custom(passwordFunction).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  department: Joi.string()
    .valid(...Object.values(CRM_USER_DEPARTMENTS))
    .required(),
  roleId: Joi.string().custom(mongooseIDFunction),
  permissions: Joi.array().items(validPermissionsSchema).required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request query
  const { value, error } = crmCreateUserSchema.validate(req.body);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.bodyValidation });
  }
  // Business logic
  let user = await crmUsersService.createNewUser({
    ...value,
    brand: req.selectedBrand,
  });
  res.status(201).json({ user: user.toJSON() });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.CRM_USERS.get_crm_users])],
    post: [userHasAnyPermission([PERMISSIONS.CRM_USERS.create_crm_user])],
  },
};
