import { RequestHandler } from "express";
import ctraderAPITokenService from "../../../../services/ctraderAPIToken.service";

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  const crmApiToken = await ctraderAPITokenService.createToken(
    req.body.password
  );
  res.status(200).json({ crmApiToken });
};

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const crmApiToken = await ctraderAPITokenService.createToken(
    req.body.password
  );
  res.status(200).json({ crmApiToken });
};
