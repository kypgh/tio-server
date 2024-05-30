import { RequestHandler } from "express";
import Joi from "joi";
import { ALLOWED_API_KEYS, ENV } from "../../../../../../../../config/envs";
import { isValidAPIKey } from "../../../../../../../../middleware/webhook.middleware";
import userAccountsService from "../../../../../../../../services/userAccounts.service";
import HTTPError from "../../../../../../../../utils/HTTPError";
import { TIO_BRANDS } from "../../../../../../../../config/enums";

const addTraderIdSchema = Joi.object({
  login_id: Joi.string().required(),
  env_type: Joi.string().required(),
  trader_id: Joi.string().required(),
}).unknown(true);
/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = addTraderIdSchema.validate({
    ...req.body,
    ...req.query,
  });
  if (error) {
    throw new HTTPError("Invalid webhook", 400, error);
  }
  if (ENV !== "production") {
    let brand = req?.headers?.brand === "pix" ? TIO_BRANDS.PIX : TIO_BRANDS.TIO;
    await userAccountsService.stagingAddCtraderTraderId(
      value.login_id,
      value.trader_id,
      value.env_type,
      brand
    );
  } else {
    await userAccountsService.addCtraderTraderId(
      value.login_id,
      value.trader_id,
      value.env_type
    );
  }
  res.status(201).json({ message: "Updated" });
};

export default {
  middleware: {
    all: [isValidAPIKey(ALLOWED_API_KEYS)],
  },
};
