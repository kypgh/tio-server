import { USER_ALLOWED_DOCUMENTS } from "../dist/config/enums";
import CRMPermissionsModel from "../src/models/CRMPermissions.model";
import UserDocumentsModel from "../src/models/UserDocuments.model";

const migration011 = {
  up: async () => {
    await UserDocumentsModel.updateMany(
      {
        document_type: {
          $in: [
            USER_ALLOWED_DOCUMENTS.id_document_history,
            USER_ALLOWED_DOCUMENTS.proof_of_address_history,
          ],
        },
        status: "na",
      },
      { $set: { status: "pending" } }
    );
  },
  down: async () => {},
};

export default migration011;
