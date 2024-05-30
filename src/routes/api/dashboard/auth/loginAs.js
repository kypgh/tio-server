import { RequestHandler } from "express";
import Joi from "joi";
import crmUsersService from "../../../../services/crmUsers.service";
import HTTPError from "../../../../utils/HTTPError";
import errorCodes from "../../../../config/errorCodes";
import { isCRMUser } from "../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../middleware/permissions.middleware";

const crmUserLoginAsSchema = Joi.object({
  crmuser_id: Joi.string().required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request query
  const { value, error } = crmUserLoginAsSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Invalid request", 400, error);
  }
  // Business logic
  let { refresh_token, jwt_token, user } = await crmUsersService.loginAsUser(
    value.crmuser_id,
    req.query.brand
  );
  res.status(200).json({ token: jwt_token, refresh_token, user });
};

export default {
  middleware: {
    all: [
      isCRMUser,
      userHasAnyPermission(), // Admin bypasses permissions - this means only admins allowed
    ],
  },
};
