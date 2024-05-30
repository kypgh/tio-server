import { RequestHandler } from "express";
import Joi from "joi";
import {
  KYC_ALLOWED_DOCUMENT_MIMETYPES,
  USER_ALLOWED_DOCUMENTS,
} from "../../../../config/enums";
import errorCodes from "../../../../config/errorCodes";
import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import userDocumentsService from "../../../../services/userDocuments.service";
import userLogsService from "../../../../services/userLogs.service";
import formDataHandler from "../../../../utils/formDataHandler";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  let documents = await userDocumentsService.getUsersKYCDocuments(req.user._id);
  await userDocumentsService.createDocumentsPresignedURLs(documents);
  res.status(200).json({ documents: documents.map((doc) => doc.toJSON()) });
};

const kycSchema = Joi.array().items(
  Joi.object({
    fieldName: Joi.string().valid(
      USER_ALLOWED_DOCUMENTS.id_document,
      USER_ALLOWED_DOCUMENTS.proof_of_address,
      USER_ALLOWED_DOCUMENTS.other
    ),
    headers: Joi.object({
      "content-type": Joi.string().valid(...KYC_ALLOWED_DOCUMENT_MIMETYPES),
    }).unknown(true),
    size: Joi.number(),
  }).unknown(true)
);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
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
  let result = await userDocumentsService.addDocuments(req.user._id, files);

  for (let doc of result) {
    await userLogsService.USER_ACTIONS.uploadKYCDocument(req.user, doc);
  }
  res.status(200).json(result);
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
