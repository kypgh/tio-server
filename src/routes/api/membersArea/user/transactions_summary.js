import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import userTransactionsService from "../../../../services/userTransactions.service";

/**
 * @type {import("express").RequestHandler}
 */
export const GET = async (req, res) => {
  const summary = await userTransactionsService.getUserTotalDepositsWithdrawals(
    req.user._id
  );

  res.status(200).json({ summary });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
