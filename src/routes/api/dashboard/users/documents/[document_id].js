import errorCodes from "../../../../../config/errorCodes";
import userDocumentsService from "../../../../../services/userDocuments.service";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import HTTPError from "../../../../../utils/HTTPError";
import { USER_DOCUMENTS_STATUSES } from "../../../../../config/enums";
import userLogsService from "../../../../../services/userLogs.service";
import emailService from "../../../../../services/email.service";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../config/permissions";
import { mongooseIDFunction } from "../../../../../utils/customValidation";
import { RequestHandler } from "express";
import Joi from "joi";

const mongooseIDSchema = Joi.string().custom(mongooseIDFunction).required();
/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = mongooseIDSchema.validate(req.query.document_id);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...errorCodes.queryValidation,
      ...error,
    });
  }
  let document = await userDocumentsService.getDocumentById(
    value,
    req.selectedBrand,
    req.allowedCountries
  );
  res.status(200).json(document.toJSON());
};

const approveUserDocumentsSchema = Joi.object({
  document_id: Joi.string().custom(mongooseIDFunction).required(),
  status: Joi.string()
    .valid(...Object.values(USER_DOCUMENTS_STATUSES))
    .invalid(USER_DOCUMENTS_STATUSES.pending)
    .required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  // Validation on request query
  const { value, error } = approveUserDocumentsSchema.validate(req.query);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...errorCodes.queryValidation,
      ...error,
    });
  }
  // Approve user document and sent to archive
  let checkDoc = await userDocumentsService.getDocumentById(
    value.document_id,
    req.selectedBrand,
    req.allowedCountries
  );
  if (!checkDoc) {
    return res.status(404).json({ message: "Document not found" });
  }
  let document;
  if (value.status === USER_DOCUMENTS_STATUSES.approved) {
    document = await userDocumentsService.approveDocument(
      value.document_id,
      req.crm_user._id
    );

    await userLogsService.CRM_ACTIONS.approveKYCDocument(
      document.user,
      document,
      req.crm_user
    );
  } else if (value.status === USER_DOCUMENTS_STATUSES.pendingChanges) {
    document = await userDocumentsService.pendingChangesDocument(
      value.document_id,
      req.crm_user._id
    );

    await userLogsService.CRM_ACTIONS.pendingChangesKYCDocument(
      document.user,
      document,
      req.crm_user
    );
  } else {
    document = await userDocumentsService.rejectDocument(
      value.document_id,
      req.crm_user._id
    );

    await userLogsService.CRM_ACTIONS.rejectKYCDocument(
      document.user,
      document,
      req.crm_user
    );
  }
  res.status(200).json(document.toJSON());
};

/**
 * @type {RequestHandler}
 */
export const DELETE = async (req, res) => {
  //validate document_name in query
  let details = await userDocumentsService.deleteDocument(
    req.query.document_id,
    req.selectedBrand
  );
  res.status(201).json(details);
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.DOCUMENTS.view_document_per_id])],
    put: [userHasAnyPermission([PERMISSIONS.DOCUMENTS.update_document])],
    delete: [userHasAnyPermission([PERMISSIONS.DOCUMENTS.delete_document])],
  },
};
