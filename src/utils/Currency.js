import BigNumber from "bignumber.js";
import currencyExchangeService from "../services/currencyExchange.service";
import _ from "lodash";

const CURRENCIES = {
  EUR: {
    symbol: "€",
    name: "Euro",
    digits: 2,
  },
  USD: {
    symbol: "$",
    name: "US Dollar",
    digits: 2,
  },
  GBP: {
    symbol: "£",
    name: "British Pound",
    digits: 2,
  },
  CAD: {
    symbol: "$",
    name: "Canadian Dollar",
    digits: 2,
  },
  AUD: {
    symbol: "$",
    name: "Australian Dollar",
    digits: 2,
  },
  BTC: {
    symbol: "₿",
    name: "Bitcoin",
    unit: "Satoshi",
    digits: 8,
  },
  USDT: {
    symbol: "$",
    name: "Tether",
    unit: "USDT cents",
    digits: 2,
  },
  ETH: {
    symbol: "Ξ",
    name: "Ethereum",
    unit: "gWei",
    digits: 9,
  },
  TIO: {
    symbol: "₮",
    name: "Trade Token",
    unit: "TIO cents(gWei)",
    digits: 9,
  },
  MYR: {
    symbol: "RM",
    name: "Malaysian Ringgit",
    digits: 2,
    unit: "Sen",
  },
};

class Currency {
  constructor({ amount, currency }) {
    if (!CURRENCIES[currency])
      throw new Error(`Currency ${currency} not supported`);
    this.amount = BigNumber(amount);
    this.currency = currency;
  }
  static fromPrecise({ amount, currency }) {
    let data = CURRENCIES[currency];
    if (!data) throw new Error(`Currency ${currency} not supported`);
    return new Currency({
      amount: BigNumber(amount).multipliedBy(10 ** data.digits),
      currency,
    });
  }
  static fromCustom({ amount, currency, digits }) {
    let data = CURRENCIES[currency];
    if (!data) throw new Error(`Currency ${currency} not supported`);
    return new Currency({
      amount: BigNumber(amount).multipliedBy(10 ** (data.digits - digits)),
      currency,
    });
  }
  /**
   * CCC - Currency Name
   * SS - Symbol
   * AA - Amount
   * NNN - Long Name
   * @param template
   * @returns
   */
  toFormat(template = "SS AA") {
    template = template.replace(/AA/g, this.getAmountPrecise());
    template = template.replace(/CCC/g, this.currency);
    template = template.replace(/SS/g, CURRENCIES[this.currency].symbol);
    template = template.replace(/NNN/g, CURRENCIES[this.currency].name);
    return template;
  }
  getAmount() {
    return this.amount.toString();
  }
  getAmountPrecise() {
    let symbol = CURRENCIES[this.currency];
    return this.amount.dividedBy(10 ** symbol.digits).toFixed(symbol.digits);
  }
  getCustomAmount(digits) {
    return this.amount
      .dividedBy(10 ** (CURRENCIES[this.currency].digits - digits))
      .toString();
  }
  getCurrency() {
    return this.currency;
  }
  getCurrencySymbol() {
    return CURRENCIES[this.currency].symbol;
  }
  getCurrencyName() {
    return CURRENCIES[this.currency].name;
  }
  getCurrencyDigits() {
    return CURRENCIES[this.currency].digits;
  }

  async getExchangeRate(currency) {
    if (!CURRENCIES[currency])
      throw new Error(`Currency ${currency} not supported`);
    return currencyExchangeService.getExchangeRate(this.currency, currency);
  }

  async convertToCurrency(currency) {
    let otherCurrencyData = CURRENCIES[currency];
    let thisCurrencyData = CURRENCIES[this.currency];
    if (!otherCurrencyData)
      throw new Error(`Currency ${currency} not supported`);
    let exchangeRate = await this.getExchangeRate(currency);

    return new Currency({
      amount: this.amount
        .multipliedBy(exchangeRate)
        .dividedBy(10 ** (thisCurrencyData.digits - otherCurrencyData.digits)),
      currency,
    });
  }

  add(amount) {
    this.amount = this.amount.plus(amount);
    return this;
  }
  subtract(amount) {
    this.amount = this.amount.minus(amount);
    return this;
  }
  multiply(amount) {
    this.amount = this.amount.multipliedBy(amount);
    return this;
  }
  divide(amount) {
    this.amount = this.amount.dividedBy(amount);
    return this;
  }
  isGreaterThan(amount, digits) {
    if (_.isNil(digits)) return this.amount.isGreaterThan(amount);
    else {
      let data = CURRENCIES[this.currency];
      return this.amount.isGreaterThan(
        new BigNumber(amount).multipliedBy(10 ** (data.digits - digits))
      );
    }
  }
  isGreaterThanOrEqualTo(amount, digits) {
    if (_.isNil(digits)) return this.amount.isGreaterThanOrEqualTo(amount);
    else {
      let data = CURRENCIES[this.currency];
      return this.amount.isGreaterThanOrEqualTo(
        new BigNumber(amount).multipliedBy(10 ** (data.digits - digits))
      );
    }
  }
  isLessThan(amount, digits) {
    if (_.isNil(digits)) return this.amount.isLessThan(amount);
    else {
      let data = CURRENCIES[this.currency];
      return this.amount.isLessThan(
        new BigNumber(amount).multipliedBy(10 ** (data.digits - digits))
      );
    }
  }
  isLessThanOrEqualTo(amount, digits) {
    if (_.isNil(digits)) return this.amount.isLessThanOrEqualTo(amount);
    else {
      let data = CURRENCIES[this.currency];
      return this.amount.isLessThanOrEqualTo(
        new BigNumber(amount).multipliedBy(10 ** (data.digits - digits))
      );
    }
  }
  // toString() {
  //   return `${this.getAmountPrecise()} ${this.currency}`;
  // }
}
Currency.prototype.toString = function () {
  return `${this.getAmountPrecise()} ${this.currency}`;
};

export default Currency;
