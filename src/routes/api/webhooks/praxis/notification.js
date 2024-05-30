import { RequestHandler } from "express";
import { validatePraxisSignature } from "../../../../middleware/praxis.middleware";
import praxisService from "../../../../services/praxis.service";

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { session } = req.body;
  const status = 0;
  await praxisService.NOTIFICATION.savePraxisNotification(
    session.order_id,
    req.body
  );
  const { signature, timestamp } =
    praxisService.NOTIFICATION.generateSignature(status);
  res.setHeader("GT-Authentication", signature);
  res.status(200).json({
    status,
    description: "OK",
    version: "1.3",
    timestamp,
  });
};

export default {
  middleware: {
    all: [validatePraxisSignature("NOTIFICATION")],
  },
};
