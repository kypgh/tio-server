import Joi from "joi";
import { PERMISSIONS } from "../../../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import { mongooseIDFunction } from "../../../../../../utils/customValidation";
import userTransactionsService from "../../../../../../services/userTransactions.service";

const updateTransactionSchema = Joi.object({
  transactionId: Joi.string().custom(mongooseIDFunction).required(),
  refundAmount: Joi.number().required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  const { value, error } = updateTransactionSchema.validate({
    ...req.body,
    ...req.query,
  });
  if (error) {
    return res.status(400).json(error);
  }
  const transaction = await userTransactionsService.getTransactionById(
    value.transactionId
  );

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  if (transaction.user?.brand !== req.selectedBrand) {
    return res.status(409).json({ message: "Different brand" });
  }
  if (value.refundAmount > Number(transaction.processed_amount)) {
    return res.status(409).json({
      message: "Refund amount cannot be greater than processed amount",
    });
  }
  const updatedTransaction =
    await userTransactionsService.updateTransactionById({
      transactionId: transaction._id,
      refundAmount: value.refundAmount,
    });

  res.status(200).json({ transaction: updatedTransaction });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    put: [
      userHasAnyPermission([PERMISSIONS.TRANSACTIONS.edit_transaction_refund]),
    ],
  },
};
