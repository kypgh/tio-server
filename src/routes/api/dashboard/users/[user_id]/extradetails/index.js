import {
  checkAccessToUserId,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import usersService from "../../../../../../services/users.service";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../../config/permissions";
import { RequestHandler } from "express";
import userTransactionsService from "../../../../../../services/userTransactions.service";
import userAccountsService from "../../../../../../services/userAccounts.service";
import tradesService from "../../../../../../services/trades.service";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  // Business logic
  let extraInfo = await usersService.getUserExtraDetails(req.query.user_id);
  let accounts = await userAccountsService.getUserAccounts(req.query.user_id, {
    environment_type: "live",
  });
  let volumes = await Promise.all(
    accounts.map((acc) => tradesService.calculateAccountVolume(acc))
  );
  let totalVolume = volumes.reduce((acc, curr) => acc + curr, 0);
  let totals = await userTransactionsService.getUserTotalDepositsWithdrawals(
    req.query.user_id
  );
  if (!totals) totals = {};
  res.status(200).json({ ...extraInfo, ...totals, totalVolume });
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    get: [userHasAnyPermission([PERMISSIONS.USERS.view_user_extra_details])],
  },
};
