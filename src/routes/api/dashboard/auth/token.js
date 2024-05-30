// import errorCodes from "../../../../config/errorCodes";
// import crmUsersService from "../../../../backend/services/crmUsers.service";
// import validator from "../../../../backend/validation/validator";
import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import crmUsersService from "../../../../services/crmUsers.service";

const crmUserRefreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required(),
  brand: Joi.string().required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request
  const { value, error } = crmUserRefreshTokenSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
  }

  // Business logic
  try {
    let jwt_token = await crmUsersService.refreshUserAccessToken(
      value.refresh_token,
      value.brand
    );
    res.status(200).json({ token: jwt_token });
  } catch (err) {
    res.status(403).json(errorCodes.invalidRefreshToken);
  }
};
