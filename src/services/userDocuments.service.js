import randomToken from "random-token";
import UserDocumentsModel from "../models/UserDocuments.model";
import googleCloudStorageService from "./googleCloudStorage.service";
import {
  USER_ALLOWED_DOCUMENTS,
  USER_DOCUMENTS_STATUSES,
} from "../config/enums";
import HTTPError from "../utils/HTTPError";
import errorCodes from "../config/errorCodes";
import utilFunctions from "../utils/util.functions";
import usersService from "./users.service";

function convertDocumentTypeHistory(documentType) {
  switch (documentType) {
    case USER_ALLOWED_DOCUMENTS.id_document:
      return USER_ALLOWED_DOCUMENTS.id_document_history;
    case USER_ALLOWED_DOCUMENTS.proof_of_address:
      return USER_ALLOWED_DOCUMENTS.proof_of_address_history;
    default:
      return documentType;
  }
}

async function updateDocumentAndAddHistory(user_id, savedFile, documentType) {
  if (
    [
      USER_ALLOWED_DOCUMENTS.id_document,
      USER_ALLOWED_DOCUMENTS.proof_of_address,
    ].includes(documentType)
  ) {
    await UserDocumentsModel.updateOne(
      { user: user_id, document_type: documentType },
      {
        $set: {
          document_type: convertDocumentTypeHistory(documentType),
        },
      }
    );
    return await UserDocumentsModel.create({
      user: user_id,
      document_type: documentType,
      document: savedFile,
      status: USER_DOCUMENTS_STATUSES.pending,
    });
  } else if (USER_ALLOWED_DOCUMENTS.other === documentType) {
    return await UserDocumentsModel.create({
      user: user_id,
      document_type: documentType,
      document: savedFile,
      status: USER_DOCUMENTS_STATUSES.pending,
    });
  } else {
    return await UserDocumentsModel.create({
      user: user_id,
      document_type: documentType,
      document: savedFile,
      status: USER_DOCUMENTS_STATUSES.not_applicable,
    });
  }
}

const userDocumentsService = {
  getAll: async ({
    page = 1,
    limit = 50,
    status,
    sort,
    brand,
    allowedCountries,
  }) => {
    let filters = {
      status,
    };
    filters = utilFunctions.pruneNullOrUndefinedFields(filters);
    // prettier-ignore
    let aggregation = UserDocumentsModel.aggregate([
      { $match: filters, },
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user", pipeline: [ { $project: { first_name: 1, last_name: 1, email: 1, ctrader_id: 1, readableId: 1, brand: 1, country: 1, }, }, ], }, },
      { $unwind: "$user", },
      { $match: { "user.brand": brand, ...(allowedCountries ? { "user.country": { $in: allowedCountries } } : {}), }, },
      { $lookup: { from: "crmusers", localField: "crm_user_action", foreignField: "_id", as: "crm_user_action", pipeline: [ { $project: { first_name: 1, last_name: 1, email: 1, department: 1 }, }, ], },
      },
    ]);
    let results = await UserDocumentsModel.aggregatePaginate(aggregation, {
      page,
      limit,
      sort: sort ?? { updatedAt: -1 },
      collation: { locale: "en", numericOrdering: true },
    });
    return results;
  },
  getUsersKYCDocuments: async (userId) => {
    return UserDocumentsModel.find({
      user: userId,
      document_type: {
        $in: [
          USER_ALLOWED_DOCUMENTS.id_document,
          USER_ALLOWED_DOCUMENTS.proof_of_address,
        ],
      },
    });
  },
  getDocumentById: async (documentId, brand, allowedCountries) => {
    let doc = await UserDocumentsModel.findById(documentId).populate("user");
    if (!doc || doc.user.brand !== brand) {
      throw new HTTPError(
        "User's specified document not found",
        404,
        errorCodes.usersDocumentNotFound
      );
    }
    if (allowedCountries && !allowedCountries.includes(doc?.user?.country)) {
      throw new HTTPError("Not allowed to access this users documents", 401, {
        message: "Unauthorized",
      });
    }
    try {
      doc.document.presignedUrl =
        await googleCloudStorageService.getPresignedUrl(
          doc.document.bucket,
          doc.document.name
        );
    } catch (err) {
      console.error(err);
    }
    return doc;
  },
  createDocumentsPresignedURLs: async (documents) => {
    for (const doc of documents) {
      try {
        doc.document.presignedUrl =
          await googleCloudStorageService.getPresignedUrl(
            doc.document.bucket,
            doc.document.name
          );
      } catch (err) {
        console.error(err);
      }
    }
  },
  getUsersDocuments: async (user_id) => {
    return UserDocumentsModel.find({ user: user_id });
  },
  addDocuments: async (user_id, files) => {
    // Save file data to Cloud Storage
    let documents = [];
    for (const file of files) {
      let savedFile = await googleCloudStorageService.saveToArchiveBucket(
        file.path,
        `user_${user_id}/${file.fieldName}-${randomToken(6)}`,
        file.headers?.["content-type"]
      );
      if (savedFile) {
        documents.push(
          await updateDocumentAndAddHistory(user_id, savedFile, file.fieldName)
        );
      }
    }
    for (const doc of documents) {
      try {
        doc.document.presignedUrl =
          await googleCloudStorageService.getPresignedUrl(
            doc.document.bucket,
            doc.document.name
          );
      } catch (err) {
        console.error(err);
      }
    }
    return documents;
  },
  approveDocument: async (document_id, crm_user_id) => {
    let doc = await UserDocumentsModel.findById(document_id).populate("user");
    if (!doc) {
      throw new HTTPError(
        "User's specified document not found",
        404,
        errorCodes.usersDocumentNotFound
      );
    }
    if (doc.status === USER_DOCUMENTS_STATUSES.not_applicable) {
      throw new HTTPError(
        "Cannot approve document with na status",
        409,
        errorCodes.cannotApproveDocument
      );
    }
    doc.status = USER_DOCUMENTS_STATUSES.approved;
    doc.crm_user_action = crm_user_id;
    doc.markModified("document");
    const result = await doc.save();
    return result;
  },
  pendingChangesDocument: async (document_id, crm_user_id) => {
    let doc = await UserDocumentsModel.findById(document_id).populate("user");
    if (!doc) {
      throw new HTTPError(
        "User's specified document not found",
        404,
        errorCodes.usersDocumentNotFound
      );
    }
    if (doc.status === USER_DOCUMENTS_STATUSES.not_applicable) {
      throw new HTTPError(
        "Cannot approve document with na status",
        409,
        errorCodes.cannotApproveDocument
      );
    }
    doc.status = USER_DOCUMENTS_STATUSES.pendingChanges;
    doc.crm_user_action = crm_user_id;
    doc.markModified("document");
    const result = await doc.save();
    return result;
  },
  rejectDocument: async (document_id, crm_user_id) => {
    let doc = await UserDocumentsModel.findById(document_id).populate("user");
    if (!doc) {
      throw new HTTPError(
        "User's specified document not found",
        404,
        errorCodes.usersDocumentNotFound
      );
    }
    if (
      [
        USER_DOCUMENTS_STATUSES.approved,
        USER_DOCUMENTS_STATUSES.not_applicable,
      ].includes(doc.status)
    ) {
      throw new HTTPError(
        "Cannot reject document with na or approved status",
        409,
        errorCodes.cannotRejectDocument
      );
    }
    doc.status = USER_DOCUMENTS_STATUSES.rejected;
    doc.crm_user_action = crm_user_id;
    const result = await doc.save();
    return result;
  },
  deleteDocument: async (document_id, brand) => {
    let doc = await UserDocumentsModel.findOne({ _id: document_id }).populate(
      "user"
    );

    if (!doc || doc.user.brand !== brand) {
      throw new HTTPError(
        "No such document found for this user",
        404,
        errorCodes.userHasNoKYCDocuments
      );
    }
    try {
      await googleCloudStorageService.removeFile(
        doc.document.bucket,
        doc.document.name
      );
    } catch (err) {
      console.error(err);
    }
    const user_id = doc.user._id;
    const result = await doc.remove();
    return result;
  },
};

export default userDocumentsService;
