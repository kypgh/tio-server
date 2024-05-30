import CRMPermissionsModel from "../src/models/CRMPermissions.model";

const migration010 = {
  up: async () => {
    await CRMPermissionsModel.updateMany(
      {},
      { $set: { whitelist_countries: [], enable_country_whitelist: false } }
    );
  },
  down: async () => {},
};

export default migration010;
