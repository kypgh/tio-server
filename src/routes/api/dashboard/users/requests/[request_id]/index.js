import { RequestHandler } from "express";
import Joi from "joi";
import { PERMISSIONS } from "../../../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import userRequestsService from "../../../../../../services/userRequests.service";
import { mongooseIDFunction } from "../../../../../../utils/customValidation";

const getUserRequestSchema = Joi.object({
  request_id: Joi.string().custom(mongooseIDFunction).required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = getUserRequestSchema.validate(req.query);
  if (error) {
    return res.status(400).json(error);
  }
  const result = await userRequestsService.getDetailedRequestById(
    value.request_id,
    req.selectedBrand,
    req.allowedCountries
  );
  res.status(200).json(result);
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [
      userHasAnyPermission([
        PERMISSIONS.REQUESTS.view_requests,
        PERMISSIONS.REQUESTS.view_pending_withdrawals,
      ]),
    ],
  },
};
