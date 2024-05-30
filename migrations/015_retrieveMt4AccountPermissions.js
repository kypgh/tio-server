import UserAccountsModel from "../src/models/UserAccounts.model";
import ctraderService from "../src/services/ctrader.service";
import mt4Service from "../src/services/mt4.service";

const migration014 = {
  up: async () => {
    await UserAccountsModel.find({
      platform: "mt4",
      permissions: { $exists: false },
      archived: false,
    })
      .cursor()
      .eachAsync(async (userAccount) => {
        try {
          const details = await mt4Service(
            userAccount.server
          ).getAccountByLoginId(userAccount.login_id);
          let permissions = [];
          if (details.enable) permissions.push("ENABLED");
          if (details.enable_change_password)
            permissions.push("ENABLE_CHANGE_PASSWORD");
          if (details.enable_read_only) permissions.push("READ_ONLY");
          if (details.send_reports) permissions.push("SEND_REPORTS");

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
