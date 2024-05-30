// import errorCodes from "../../../../../../config/errorCodes";
import usersService from "../../../../../../services/users.service";
import {
  checkAccessToUserId,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import HTTPError from "../../../../../../utils/HTTPError";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../../config/permissions";
import { RequestHandler } from "express";
import { mongooseIDFunction } from "../../../../../../utils/customValidation";
import Joi from "joi";
import { USER_KYC_STATUS } from "../../../../../../config/enums";

const approveKYC = Joi.object({
  user_id: Joi.string().custom(mongooseIDFunction).required(),
  status: Joi.string()
    .valid(...Object.keys(USER_KYC_STATUS))
    .required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const PATCH = async (req, res) => {
  const { error, value } = approveKYC.validate({
    ...req.body,
    ...req.query,
  });
  if (error) {
    throw new HTTPError("Invalid request body", 400, {
      ...error,
      ...errorCodes.invalidRequestBody,
    });
  }
  const result = await usersService.setKycStatus(value.user_id, value.status);
  res.status(201).json(result);
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    patch: [
      userHasAnyPermission([PERMISSIONS.DOCUMENTS.force_change_kyc_status]),
    ],
  },
};
