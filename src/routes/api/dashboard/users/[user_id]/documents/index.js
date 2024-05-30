import errorCodes from "../../../../../../config/errorCodes";
import userExists from "../../../../../../middleware/userExists";
import userDocumentsService from "../../../../../../services/userDocuments.service";
import {
  checkAccessToUserId,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import formDataHandler from "../../../../../../utils/formDataHandler";
import userLogsService from "../../../../../../services/userLogs.service";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../../config/permissions";
import {
  USER_ALLOWED_DOCUMENTS,
  KYC_ALLOWED_DOCUMENT_MIMETYPES,
} from "../../../../../../config/enums";
import { RequestHandler } from "express";
import Joi from "joi";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  // get user from request parameters :user_id
  let user;
  try {
    user = await userExists(req.query.user_id);
  } catch (err) {
    return res.status(404).json(errorCodes.userWithIdNotFound);
  }
  let documents = await userDocumentsService.getUsersDocuments(user._id);
  res.status(200).json(documents.map((doc) => doc.toJSON()));
};

const kycSchema = Joi.array().items(
  Joi.object({
    fieldName: Joi.string().valid(...Object.values(USER_ALLOWED_DOCUMENTS)),
    headers: Joi.object({
      "content-type": Joi.string().valid(...KYC_ALLOWED_DOCUMENT_MIMETYPES),
    }).unknown(true),
  }).unknown(true)
);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // get user from request parameters :user_id
  let user;
  try {
    user = await userExists(req.query.user_id);
  } catch (err) {
    return res.status(404).json(errorCodes.userWithIdNotFound);
  }

  let formData;
  try {
    formData = await formDataHandler(req);
  } catch (err) {
    return res.status(400).json(errorCodes.invalidRequestBody);
  }

  // Validate request query
  const { value: files, error } = kycSchema.validate(
    Object.values(formData.files).map((v) => v[0])
  );
  if (error) {
    return res
      .status(400)
      .json({ details: error.details, ...errorCodes.bodyValidation });
  }
  // Save file data to Cloud Storage and create/update user documents in DB
  let result = await userDocumentsService.addDocuments(
    req.query.user_id,
    files
  );

  for (let doc of result) {
    await userLogsService.USER_ACTIONS.uploadKYCDocument(user, doc);
  }
  res.status(200).json(result);
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    get: [userHasAnyPermission([PERMISSIONS.DOCUMENTS.view_user_documents])],
    post: [userHasAnyPermission([PERMISSIONS.DOCUMENTS.upload_user_documents])],
  },
};
