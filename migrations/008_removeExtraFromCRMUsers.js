import { TIO_BRANDS } from "../src/config/enums";
import CRMPermissionsModel from "../src/models/CRMPermissions.model";
import CRMUserRolesModel from "../src/models/CRMUserRoles.model";
import CRMUsersModel from "../src/models/CRMUsers.model";

const migration007 = {
  up: async () => {
    await CRMUsersModel.find({})
      .cursor({ batchSize: 10 })
      .eachAsync(async (user) => {
        delete user.department;
        delete user.permissions;
        delete user.role;
        delete user.suspended;
        delete user.sales_rotation_countries;
        await user.save();
      });
  },
  down: async () => {},
};

export default migration007;
