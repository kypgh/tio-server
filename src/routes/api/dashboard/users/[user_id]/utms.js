import Joi from "joi";
import {
  checkAccessToUserId,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import usersService from "../../../../../services/users.service";
import { mongooseIDFunction } from "../../../../../utils/customValidation";
import HTTPError from "../../../../../utils/HTTPError";
import { PERMISSIONS } from "../../../../../config/permissions";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";

const utmsSchema = Joi.object({
  user_id: Joi.string().custom(mongooseIDFunction).required(),
  utm_source: Joi.string(),
  utm_medium: Joi.string(),
  utm_campaign: Joi.string(),
  utm_term: Joi.string(),
  utm_content: Joi.string(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  const { error, value } = utmsSchema.validate({
    ...req.body,
    user_id: req.query.user_id,
  });
  if (error) {
    throw new HTTPError("Invalid request body", 400, {
      ...error,
    });
  }

  const result = await usersService.updateUserUTMs(req.query.user_id, value);
  res.status(201).json(result);
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    put: [userHasAnyPermission([PERMISSIONS.USERS.update_utms])],
  },
};
