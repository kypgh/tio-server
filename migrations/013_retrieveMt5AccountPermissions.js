import UserAccountsModel from "../src/models/UserAccounts.model";
import mt5Service, { mt5AccountRightsUtils } from "../src/services/mt5.service";

const migration013 = {
  up: async () => {
    await UserAccountsModel.find({
      platform: "mt5",
      permissions: { $exists: false },
    })
      .cursor()
      .eachAsync(async (userAccount) => {
        try {
          const details = await mt5Service.getAccountDetails({
            login_id: userAccount.login_id,
            environment_type: userAccount.environment_type,
          });

          const permissions = mt5AccountRightsUtils.getRightsFromNumber(
            Number(details.Rights)
          );

          userAccount.permissions = permissions;

          await userAccount.save();
        } catch (err) {
          console.error(
            userAccount.login_id,
            userAccount.environment_type,
            "failed"
          );
        }
      });
  },
  down: async () => {},
};

export default migration013;
