import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../../config/errorCodes";
import { PERMISSIONS } from "../../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import HTTPError from "../../../../../utils/HTTPError";
import { USER_LOGS_ACTION_TYPES } from "../../../../../config/enums";
import userLogsService from "../../../../../services/userLogs.service";

const getUserLogsSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(USER_LOGS_ACTION_TYPES))
    .required(),
  cursor: Joi.string().trim().allow(""),
  limit: Joi.number().default(50),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  // Validate request query
  const { value, error } = getUserLogsSchema.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid request query", 400, {
      ...error,
      ...errorCodes.queryValidation,
    });
  }

  const logs = await userLogsService.getLogs({
    ...value,
    brand: req.selectedBrand,
    allowedCountries: req.allowedCountries,
  });

  res.status(200).json({
    docs: logs,
    next_cursor: logs[logs.length - 1]?._id?.toString() || null,
  });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.ADMINISTRATION.user_logs])],
  },
};
