import { USER_ALLOWED_DOCUMENTS } from "../dist/config/enums";
import CRMPermissionsModel from "../src/models/CRMPermissions.model";
import UserDocumentsModel from "../src/models/UserDocuments.model";
import UsersModel from "../src/models/Users.model";

const migration012 = {
  up: async () => {
    await UsersModel.find({ readableId: { $exists: false } })
      .cursor()
      .eachAsync(async (user) => {
        const readableId =
          (await UsersModel.countDocuments({
            _id: { $lt: user._id },
          })) + 1;
        await UsersModel.updateOne({ _id: user._id }, { $set: { readableId } });
      });
  },
  down: async () => {},
};

export default migration012;
