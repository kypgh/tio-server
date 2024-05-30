import { TIO_BRANDS } from "../src/config/enums";
import CRMPermissionsModel from "../src/models/CRMPermissions.model";
import CRMUserRolesModel from "../src/models/CRMUserRoles.model";
import CRMUsersModel from "../src/models/CRMUsers.model";

const migration007 = {
  up: async () => {
    await CRMUserRolesModel.updateMany(
      {},
      {
        $set: {
          brand: TIO_BRANDS.TIO,
        },
      }
    );
    await CRMUserRolesModel.create({
      brand: TIO_BRANDS.PIX,
      name: "admin",
    });
    await CRMUserRolesModel.create({
      brand: TIO_BRANDS.PIX,
      name: "default",
    });
  },
  down: async () => {},
};

export default migration007;
