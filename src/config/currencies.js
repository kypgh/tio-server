export const CURRENCIES = Object.freeze([
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "BTC",
  "USDT",
  "ETH",
  "TIO",
]);

export const CTRADER_CURRENCIES = Object.freeze([
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "USDT",
]);

export const MT5_CURRENCIES = Object.freeze([
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "BTC",
  "ETH",
  "USDT",
]);

export const MT4_CURRENCIES = Object.freeze([
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  // "ZAR",
  "CZK",
]);

export const FRONT_END_CURRENCIES = Object.freeze([
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
]);

export const CRYPTO_CURRENCIES = Object.freeze(["BTC", "USDT", "ETH", "TIO"]);
export const INNOVOULT_SUPPORTED_CURRENCIES = Object.freeze([
  "USDT",
  "ETH",
  "TIO",
]);

export const PIX_CURRENCIES = Object.freeze([
  "EUR",
  "USD",
  "GBP",
  "AUD",
  "ETH",
  "USDT",
  "BTC",
  // "TIO",
]);
export const PIX_CTRADER_CURRENCIES = Object.freeze([
  "EUR",
  // "USD",
  // "GBP",
  // "AUD",
  "ETH",
  "USDT",
  "BTC",
  // "TIO",
]);
/**
 * This is the list of currencies that convert to cent differently than the rest of the currencies.
 * normal is 1 currency = 100 cent (1 USD = 100 cent).
 */
// prettier-ignore
export const CURRENCY_FRACTIONS = Object.freeze({
  BHD: 1000, IQD: 1000, JOD: 1000, KWD: 1000, LYD: 1000, OMR: 1000, TND: 1000, BIF: 1, CLP: 1, 
  DJF: 1, GNF: 1, ISK: 1, JPY: 1, KMF: 1, KRW: 1, PYG: 1, RWF: 1, UGX: 1, UYI: 1, VND: 1, VUV: 1, 
  XAF: 1, XOF: 1, XPF: 1, BTC: 100000000, ETH: 100000000, USDT: 100000000,
});

// prettier-ignore
const CURRENCY_DIGITS = Object.freeze({
  BHD: 3, IQD: 3, JOD: 3, KWD: 3, LYD: 3, OMR: 3, TND: 3, BIF: 1, CLP: 1, 
  DJF: 0, GNF: 0, ISK: 0, JPY: 0, KMF: 0, KRW: 0, PYG: 0, RWF: 0, UGX: 0, UYI: 0, VND: 0, VUV: 0, 
  XAF: 0, XOF: 0, XPF: 0, BTC: 8, ETH: 8, USDT: 8,
});
export function getDigitsForCurrency(currency) {
  return CURRENCY_DIGITS[currency] ?? 2;
}

// prettier-ignore
export const CURRENCY_SYMBOLS = Object.freeze({
  USD: "$", EUR: "€", GBP: "£", AUD: "$", CAD: "$", CHF: "Fr", CNY: "¥", DKK: "kr", HKD: "$", INR: "₹", 
  JPY: "¥", KRW: "₩", NZD: "$", PLN: "zł", RUB: "₽", SEK: "kr", SGD: "$", THB: "฿", TRY: "₺", ZAR: "R", 
  BTC:'₿', ETH:'Ξ', USDT:'$', USDC: '$'
});

export const BITGO_CURRENCY_DIGITS = Object.freeze({
  USDT: 6,
  BTC: 8,
  ETH: 18,
});
