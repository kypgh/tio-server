import { TIO_BRANDS } from "../src/config/enums";
import CRMUsersModel from "../src/models/CRMUsers.model";

const migration005 = {
  up: async () => {
    await CRMUsersModel.updateMany({}, { $set: { brands: [TIO_BRANDS.TIO] } });
  },
  down: async () => {},
};

export default migration005;
