import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import { isCRMUser } from "../../../../middleware/auth.middleware";
import { MODEL_FIELDS } from "../../../../models/modelFields";
import currencyExchangeService from "../../../../services/currencyExchange.service";
import HTTPError from "../../../../utils/HTTPError";
import { CURRENCIES } from "../../../../config/currencies";

const exchangeRateSchema = Joi.object({
  from: Joi.string()
    .valid(...CURRENCIES)
    .required(),
  to: Joi.string()
    .valid(...CURRENCIES)
    .required(),
});

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = exchangeRateSchema.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid request", 400, {
      ...errorCodes.invalidRequest,
      ...error,
    });
  }
  const usdRateFrom = await currencyExchangeService.getCurrencyExchangeFromUSD(
    value.from
  );
  const usdRateTo = await currencyExchangeService.getCurrencyExchangeFromUSD(
    value.to
  );
  if (!usdRateFrom || !usdRateTo) {
    return res.status(404).json({ message: "Rate not found" });
  }
  res.status(200).json({
    usdRateFrom,
    usdRateTo,
    rate: usdRateFrom / usdRateTo,
  });
};

export default {
  middleware: {
    all: [],
  },
};
