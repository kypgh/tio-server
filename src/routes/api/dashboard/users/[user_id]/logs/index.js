import {
  checkAccessToUserId,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import userLogsService from "../../../../../../services/userLogs.service";
import HTTPError from "../../../../../../utils/HTTPError";
import errorCodes from "../../../../../../config/errorCodes";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../../config/permissions";
import {
  filterValidationSchema,
  mongooseIDFunction,
} from "../../../../../../utils/customValidation";
import { RequestHandler } from "express";
import Joi from "joi";
import { USER_LOGS_ACTION_TYPES } from "../../../../../../config/enums";

const userLogsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
  user_id: Joi.string().custom(mongooseIDFunction).required(),
  actionType: Joi.string().valid(...Object.values(USER_LOGS_ACTION_TYPES)),
  filters: filterValidationSchema({
    fromDate: (value) => ({ createdAt: { $gte: new Date(value) } }),
    toDate: (value) => ({ createdAt: { $lte: new Date(value) } }),
  }),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  // Validate request query (pagination plus some extra fields)
  const { value, error } = userLogsSchema.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid request query", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }
  // Business logic
  const result = await userLogsService.getLogsForAUser(
    value.user_id,
    value.page,
    value.limit,
    value.actionType,
    value.filters
  );
  res.status(200).json(result);
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    get: [userHasAnyPermission([PERMISSIONS.USERS.logs])],
  },
};
