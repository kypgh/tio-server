import { RequestHandler } from "express";
import { isValidAPIKey } from "../../../../middleware/webhook.middleware";
import usersService from "../../../../services/users.service";
import userTransactionsService from "../../../../services/userTransactions.service";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const usersPerMonth = await usersService.getUsersPerMonth();
  const transactionsPerMonth =
    await userTransactionsService.getTransactionsStatus();

  //  res.setHeader("Access-Control-Allow", "application/json");
  res.status(200).json({
    usersPerMonth: usersPerMonth,
    transactionsPerMonth: transactionsPerMonth,
  });
};

export default {
  middleware: {
    all: [isValidAPIKey(["267fb91e-8d64-40ea-9382-7159254b5a00"])],
  },
};
