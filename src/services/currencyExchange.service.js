import CurrencyExchangeCacheModel from "../models/CurrencyExchangeCache.model";
import HTTPError from "../utils/HTTPError";
import errorCodes from "../config/errorCodes";
import utilFunctions from "../utils/util.functions";

const currencyExchangeService = {
  getCurrencyExchangeFromUSD: async (base_currency) => {
    base_currency = base_currency.toUpperCase();
    if (base_currency === "USD") return 1;
    if (base_currency === "TIO") base_currency = "TIOX";
    let ceCache = await CurrencyExchangeCacheModel.findOne({
      base_currency: "USD",
    });
    let exchange_rate = ceCache.exchange_rates[base_currency];
    if (!exchange_rate) {
      throw new HTTPError(
        `Convertion for currency ${base_currency} -> USD not found`,
        500,
        errorCodes.serverError
      );
    }
    let numberOfDecimalDigits = utilFunctions.decimalCount(exchange_rate);
    return Number((1 / exchange_rate).toFixed(numberOfDecimalDigits));
  },
  getAmounToUSD: async (amount, currency) => {
    const rate = await currencyExchangeService.getCurrencyExchangeFromUSD(
      currency
    );
    return amount * rate;
  },
  getExchangeRate: async (currencyFrom, currencyTo) => {
    const rateFrom = await currencyExchangeService.getCurrencyExchangeFromUSD(
      currencyFrom
    );
    const rateTo = await currencyExchangeService.getCurrencyExchangeFromUSD(
      currencyTo
    );
    return rateFrom / rateTo;
  },
  getExchangeAmount: async (amount, currencyFrom, currencyTo) => {
    const rate = await currencyExchangeService.getExchangeRate(
      currencyFrom,
      currencyTo
    );
    return amount * rate;
  },
};

export default currencyExchangeService;
