import { RequestHandler } from "express";
import { validatePraxisSignature } from "../../../../middleware/praxis.middleware";
import praxisService from "../../../../services/praxis.service";
import { validateVPaySignature } from "../../../../middleware/virtualpay.middleware";
import { VIRTUAL_PAY_PIX_MERCHANT_ID } from "../../../../config/envs";
import { VP_RESPONSE_CODES } from "../../../../services/virtualPay.service";
import userTransactionsService from "../../../../services/userTransactions.service";
import userAccountsService from "../../../../services/userAccounts.service";
import userLogsService from "../../../../services/userLogs.service";
import usersService from "../../../../services/users.service";
import { PRAXIS_TRANSACTION_STATUS } from "../../../../config/enums";

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  /**
   * @type {{
   *  signature: string;
   *  requestID: string;
   *  responseCode: string;
   *  amount: string;
   *  currency: string;
   *  card: string;
   *  responsedescription: string;
   * }}
   */
  const body = req.body;
  const transaction =
    await userTransactionsService.updatePendingVirtualPayDeposit({
      transactionId: body.requestID,
      amount: body.amount,
      currency: body.currency,
      vpStatus: body.responseCode,
      card: body.card,
    });
  let account;
  if (
    transaction.transaction_status ===
    PRAXIS_TRANSACTION_STATUS.payment_approved
  ) {
    account = await userAccountsService.depositToAccount(
      transaction.userAccount?._id ?? transaction.userAccount,
      transaction
    );
  }

  if (!account) {
    account = await userAccountsService.getAccountById(
      transaction.userAccount?._id ?? transaction.userAccount
    );
  }

  const user = await usersService.getUserById(account.user?.id ?? account.user);
  await userLogsService.USER_ACTIONS.depositTransaction(
    user,
    transaction,
    account
  );
  return res.status(200).json({ message: "Accept" });
};

export default {
  middleware: {
    all: [validateVPaySignature(VIRTUAL_PAY_PIX_MERCHANT_ID)],
  },
};
