import { RequestHandler } from "express";
import { validatePraxisSignature } from "../../../../middleware/praxis.middleware";
import praxisService from "../../../../services/praxis.service";

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { session, customer, transaction_attempt } = req.body;
  let result = {
    status: 0,
    description: "OK",
    version: "1.3",
  };
  const { valid, error } =
    await praxisService.VALIDATION.validateAmountBasedOnAccountType(
      session.order_id,
      transaction_attempt.attempted_amount ?? transaction_attempt.amount,
      transaction_attempt.attempted_currency ?? transaction_attempt.currency
    );
  if (!valid) {
    result.status = 1;
    result.description = error;
  }
  const { signature, timestamp } = praxisService.VALIDATION.generateSignature(
    result.status
  );
  res.setHeader("GT-Authentication", signature);
  result.timestamp = timestamp;
  res.status(200).json(result);
};

export default {
  middleware: {
    all: [validatePraxisSignature("VALIDATION")],
  },
};
