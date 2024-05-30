import { TIO_BRANDS } from "../src/config/enums";
import CRMPermissionsModel from "../src/models/CRMPermissions.model";
import CRMUsersModel from "../src/models/CRMUsers.model";

const migration006 = {
  up: async () => {
    await CRMUsersModel.find({})
      .cursor({ batchSize: 10 })
      .eachAsync(async (_user) => {
        const perms = await CRMPermissionsModel.find({ crmuserId: _user._id });
        if (perms.length === 0) {
          let user = _user.toJSON();
          await CRMPermissionsModel.create({
            crmuserId: user._id,
            brand: TIO_BRANDS.TIO,
            department: user.department || "admin",
            role: user.role,
            permissions: user.permissions || [],
            suspended: user.suspended || false,
            sales_rotation_countries: user.sales_rotation_countries || [],
          });
        }
      });
  },
  down: async () => {},
};

export default migration006;
