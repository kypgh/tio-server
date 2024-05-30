import errorCodes from "../../../../../config/errorCodes";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import userDocumentsService from "../../../../../services/userDocuments.service";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../config/permissions";
import { sortValidationSchema } from "../../../../../utils/customValidation";
import { USER_DOCUMENTS_STATUSES } from "../../../../../config/enums";
import Joi from "joi";
import { RequestHandler } from "express";
import HTTPError from "../../../../../utils/HTTPError";

const documentFiltersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
})
  .keys({
    status: Joi.string().valid(...Object.values(USER_DOCUMENTS_STATUSES)),
    sort: sortValidationSchema({
      cid: "user.ctrader_id",
      name: "user.first_name",
      email: "user.email",
      type: "document_type",
      createdAt: "created_at",
      updatedAt: "updatedAt",
    }),
  })
  .unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = documentFiltersSchema.validate(req.query);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      details: error.details,
      ...errorCodes.bodyValidation,
    });
  }
  // Business logic
  let documents = await userDocumentsService.getAll({
    ...value,
    brand: req.selectedBrand,
    allowedCountries: req.allowedCountries,
  });
  res.status(200).json(documents);
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.DOCUMENTS.view_documents])],
  },
};
