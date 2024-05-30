import praxisService from "../services/praxis.service";
import { RequestHandler } from "express";

/**
 *
 * @param {"NOTIFICATION"} type
 * @returns {RequestHandler}
 */
export const validatePraxisSignature = (type) => {
  return (req, res, next) => {
    const praxisSignature = req.headers["gt-authentication"];
    if (!praxisSignature) {
      return res
        .status(400)
        .json({ message: "Missing GT-Authentication header" });
    }
    if (type === "NOTIFICATION") {
      const { timestamp, customer, session, transaction } = req.body;
      if (
        praxisService.NOTIFICATION.validateSignature(
          praxisSignature,
          timestamp,
          customer,
          session,
          transaction
        )
      ) {
        return next();
      }
    } else if (type === "VALIDATION") {
      const { timestamp, customer, session, transaction_attempt } = req.body;
      if (
        praxisService.VALIDATION.validateSignature(
          praxisSignature,
          timestamp,
          customer,
          session,
          transaction_attempt
        )
      ) {
        return next();
      }
    }
    return res.status(401).json({ message: "Unauthorized" });
  };
};
