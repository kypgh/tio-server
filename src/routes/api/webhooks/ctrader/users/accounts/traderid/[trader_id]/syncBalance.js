import { RequestHandler } from "express";
import Joi from "joi";
import { ALLOWED_API_KEYS, ENV } from "../../../../../../../../config/envs";
import { isValidAPIKey } from "../../../../../../../../middleware/webhook.middleware";
import userAccountsService from "../../../../../../../../services/userAccounts.service";
import HTTPError from "../../../../../../../../utils/HTTPError";
import { TIO_BRANDS } from "../../../../../../../../config/enums";

const syncTraderBalanceSchema = Joi.object({
  trader_id: Joi.string().required(),
  env_type: Joi.string().valid("live", "demo").required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = syncTraderBalanceSchema.validate({
    ...req.body,
    ...req.query,
  });
  if (error) {
    throw new HTTPError("Invalid webhook", 400, error);
  }

  if (ENV !== "production") {
    let brand = req?.headers?.brand === "pix" ? TIO_BRANDS.PIX : TIO_BRANDS.TIO;
    await userAccountsService.stagingSyncCtraderBalance(
      value.trader_id,
      value.env_type,
      brand
    );
  } else {
    await userAccountsService.syncCtraderBalance(
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
