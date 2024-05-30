import UserAccountsModel from "../src/models/UserAccounts.model";
import ctraderService from "../src/services/ctrader.service";

const migration014 = {
  up: async () => {
    await UserAccountsModel.find({
      platform: "ctrader",
      permissions: { $exists: false },
      archived: false,
    })
      .cursor()
      .eachAsync(async (userAccount) => {
        try {
          const details = await ctraderService(
            userAccount.server
          ).getTraderAccountByLogin(userAccount.login_id);
          let permissions = [details.accessRights];
          if (details.sendOwnStatement) permissions.push("SEND_OWN_STATEMENT");
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

export default migration014;
