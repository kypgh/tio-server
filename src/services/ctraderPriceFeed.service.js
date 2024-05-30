import WebSocket from "ws";
import { CTRADER_PRICE_FEED_WS } from "../config/envs";

//prettier-ignore
export const FOREX_SYMBOLS = Object.freeze([
  "EURUSD", "GBPUSD", "EURJPY", "USDJPY", "AUDUSD", "USDCHF", "GBPJPY", "USDCAD", 
  "EURGBP", "EURCHF", "AUDJPY", "NZDUSD", "CHFJPY", "EURAUD", "CADJPY", "GBPAUD", 
  "EURCAD", "AUDCAD", "GBPCAD", "AUDNZD", "NZDJPY", "USDNOK", "AUDCHF", "USDMXN", 
  "GBPNZD", "EURNZD", "CADCHF", "USDSGD", "USDSEK", "NZDCAD", "EURSEK", "GBPSGD", 
  "EURNOK", "EURHUF", "USDPLN", "USDDKK", "GBPNOK", "AUDDKK", "NZDCHF", "GBPCHF", 
  "USDTRY", "EURTRY", "EURHKD", "EURZAR", "SGDJPY", "USDHKD", "USDZAR", "EURMXN", 
  "EURPLN", "GBPZAR", "NZDSGD", "USDHUF", "EURCZK", "USDCZK", "EURDKK", "EURRUB", 
  "USDRUB", "USDCNH", "GBPSEK", "GBPPLN", "AUDSEK", "AUDSGD", "AUDZAR", "CADDKK", 
  "CADHKD", "CADMXN", "CADNOK", "CADSEK", "CADSGD", "CHFNOK", "CHFPLN", "CHFSEK", 
  "CHFSGD", "CHFZAR", "DKKNOK", "DKKSEK", "EURCNH", "EURILS", "EURRON", "EURSGD", 
  "GBPDKK", "GBPTRY", "HKDJPY", "NOKJPY", "NOKSEK", "NZDSEK", "TRYJPY", "USDRON", 
  "USDTHB", "ZARJPY"
]);

//prettier-ignore
export const FOREX_SYMBOLS_USD_CONVERSIONS = Object.freeze({
  EURJPY: "USDJPY", GBPJPY: "USDJPY", EURGBP: "GBPUSD", EURCHF: "USDCHF", AUDJPY: "USDJPY", 
  CHFJPY: "USDJPY", EURAUD: "AUDUSD", CADJPY: "USDJPY", GBPAUD: "AUDUSD", EURCAD: "USDCAD", 
  AUDCAD: "USDCAD", GBPCAD: "USDCAD", AUDNZD: "NZDUSD", NZDJPY: "USDJPY", AUDCHF: "USDCHF", 
  GBPNZD: "NZDUSD", EURNZD: "NZDUSD", CADCHF: "USDCHF", NZDCAD: "USDCAD", EURSEK: "USDSEK", 
  GBPSGD: "USDSGD", EURNOK: "USDNOK", EURHUF: "USDHUF", GBPNOK: "USDNOK", AUDDKK: "USDDKK", 
  NZDCHF: "USDCHF", GBPCHF: "USDCHF", EURTRY: "USDTRY", EURHKD: "USDHKD", EURZAR: "USDZAR", 
  SGDJPY: "USDJPY", EURMXN: "USDMXN", EURPLN: "USDPLN", GBPZAR: "USDZAR", NZDSGD: "USDSGD", 
  EURCZK: "USDCZK", EURDKK: "USDDKK", EURRUB: "USDRUB", GBPSEK: "USDSEK", GBPPLN: "USDPLN", 
  AUDSEK: "USDSEK", AUDSGD: "USDSGD", AUDZAR: "USDZAR", CADDKK: "USDDKK", CADHKD: "USDHKD", 
  CADMXN: "USDMXN", CADNOK: "USDNOK", CADSEK: "USDSEK", CADSGD: "USDSGD", CHFNOK: "USDNOK", 
  CHFPLN: "USDPLN", CHFSEK: "USDSEK", CHFSGD: "USDSGD", CHFZAR: "USDZAR", DKKNOK: "USDNOK", 
  DKKSEK: "USDSEK", EURCNH: "USDCNH", EURILS: "EURUSD", EURRON: "USDRON", EURSGD: "USDSGD", 
  GBPDKK: "USDDKK", GBPTRY: "USDTRY", HKDJPY: "USDJPY", NOKJPY: "USDJPY", NOKSEK: "USDSEK", 
  NZDSEK: "USDSEK", TRYJPY: "USDJPY", ZARJPY: "USDJPY",
});

//prettier-ignore
export const USD_SYMBOLS = Object.freeze([
  "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCHF", "USDCAD", "NZDUSD", "USDNOK", 
  "USDMXN", "USDSGD", "USDSEK", "USDPLN", "USDDKK", "XAUUSD", "XAGUSD", "USDTRY", 
  "USDHKD", "USDZAR", "USDHUF", "USDCZK", "USDRUB", "USDCNH", "USDRON", "USDTHB", 
  "XPDUSD", "XPTUSD", "BTCUSD", "ETHUSD", "USDTUSD", "LTCUSD", "TIOUSD",
]);

const ctraderPriceFeedService = {
  getDataRequestString: (_symbols, accountCurrency) => {
    let symbols = [...new Set(_symbols)];
    let extraSymbols = [];
    for (const symbol of symbols) {
      if (!symbol.includes("USD") && FOREX_SYMBOLS.includes(symbol)) {
        let res = FOREX_SYMBOLS_USD_CONVERSIONS[symbol];
        if (
          res &&
          (!extraSymbols.includes(res.conv) || !symbols.includes(symbol))
        ) {
          extraSymbols.push(res);
        }
      }
    }
    if (accountCurrency !== "USD") {
      let currencyConversion = USD_SYMBOLS.find((s) =>
        s.includes(accountCurrency)
      );
      if (
        currencyConversion &&
        !extraSymbols.includes(currencyConversion) &&
        !symbols.includes(currencyConversion)
      ) {
        extraSymbols.push(currencyConversion);
      }
    }
    return [...symbols, ...extraSymbols];
  },
  calculateOpenProfit: ({
    volume,
    openPrice,
    action,
    symbol,
    priceFeed,
    accountCurrency,
  }) => {
    let price = priceFeed?.find((p) => p.name === symbol);
    let isForex = FOREX_SYMBOLS.indexOf(symbol) >= 0;
    if (!price) return {};
    let closePrice = (action === "BUY" ? price.bid : price.ask) * 10 ** -5;
    let profit =
      (closePrice - openPrice) * parseInt(volume) * (action === "BUY" ? 1 : -1);
    // if symbol is forex and accoun  tCurrency then no need to convert
    if (isForex) {
      let accCurrIdx = symbol.indexOf(accountCurrency);
      if (accCurrIdx === 0) {
        return { profit: profit / closePrice, currency: accountCurrency };
      } else if (accCurrIdx > 0) {
        return { profit, currency: accountCurrency };
      }
    }
    // Convert from SYMBOL to USD
    let conversionSymbol = FOREX_SYMBOLS_USD_CONVERSIONS[symbol];
    if (conversionSymbol) {
      let priceConv = priceFeed?.find((p) => p.name === conversionSymbol);
      if (!priceConv) return { profit, currency: symbol.substring(3) };
      let closePriceConv =
        (action === "BUY" ? priceConv.bid : priceConv.ask) * 10 ** -5;
      closePriceConv =
        conversionSymbol.indexOf("USD") === 0
          ? 1 / closePriceConv
          : closePriceConv;
      profit = profit * closePriceConv;
    }

    // Convert from USD to accountCurrency
    if (accountCurrency === "USD") return { profit, currency: accountCurrency };

    let accountConversionSymbol = USD_SYMBOLS.find((s) =>
      s.includes(accountCurrency)
    );
    if (accountConversionSymbol) {
      let accountConversionPrice = priceFeed?.find(
        (p) => p.name === accountConversionSymbol
      );
      if (accountConversionPrice) {
        let accountConversionPriceClose =
          (action === "BUY"
            ? accountConversionPrice.bid
            : accountConversionPrice.ask) *
          10 ** -5;
        accountConversionPriceClose =
          accountConversionSymbol.indexOf("USD") !== 0
            ? 1 / accountConversionPriceClose
            : accountConversionPriceClose;
        profit = profit * accountConversionPriceClose;
        return { profit, currency: accountCurrency };
      }
    }

    return { profit, currency: "USD" };
  },
  getPricesForSymbols: async (symbols) => {
    return new Promise((res, rej) => {
      const ws = new WebSocket(CTRADER_PRICE_FEED_WS);
      const timeout = setTimeout(() => {
        ws.close();
        rej(new Error("Ws Timeout for getPricesForSymbols"));
      }, 10000);
      ws.on("open", () => {
        ws.send(`symbols:${symbols.join(",")}`);
      });
      ws.on("message", (rawData) => {
        try {
          const data = JSON.parse(rawData);
          res(data);
          clearTimeout(timeout);
          ws.close();
        } catch (err) {}
      });
    });
  },
};

export default ctraderPriceFeedService;
