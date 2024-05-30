import { RequestHandler } from "express";
import jsSHA from "jssha";
/**
 * @param {[string]} ALLOWED_API_KEYS
 * @returns {RequestHandler}
 */
export const validateVPaySignature = (merhcantId) => (req, res, next) => {
  if (!req.body.signature)
    return res.status(401).json({ message: "No 'signature' found" });

  let sign = new jsSHA("SHA-256", "TEXT");
  sign.update(
    req.body.requestID + merhcantId + req.body.amount + req.body.currency
  );
  let recreatedSignature = sign.getHash("B64");

  if (req.body.signature !== recreatedSignature) {
    return res.status(401).json({ message: "Invalid signature" });
  }
  next();
};
