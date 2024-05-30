import { countryDataCodes } from "../config/countries";
import {
  CRYPTO_CURRENCIES,
  CURRENCY_FRACTIONS,
  CURRENCY_SYMBOLS,
} from "../config/currencies";
import { Model } from "mongoose";
import _ from "lodash";

const utilFunctions = {
  /**
   *
   * @param {Object} obj
   *
   * Removes all keys which have either null or undefined values
   */
  pruneNullOrUndefinedFields(obj) {
    function recursiveTransform(result, value, key) {
      if (_.isPlainObject(value)) {
        let objRes = _.transform(value, recursiveTransform, {});
        if (!_.isEmpty(objRes)) {
          result[key] = objRes;
        }
        return result;
      }
      if (!_.isNil(value)) {
        result[key] = value;
      }
      return result;
    }
    return _.transform(obj, recursiveTransform);
  },
  /**
   *
   * @param {Model} model
   */
  getModelKeys(model) {
    return Object.keys(model.schema.paths);
  },
  /**
   * @param {Object} obj
   * @returns {String[]}
   *
   * This will list all keys in an object and expand all sub-objects to nested keys (dot notation)
   */
  getAllObjKeys(item) {
    function recursiveGetKeys(obj, prefix) {
      return Object.keys(obj).reduce((acc, key) => {
        if (_.isPlainObject(obj[key])) {
          acc.push(...recursiveGetKeys(obj[key], key));
        } else {
          acc.push(prefix ? `${prefix}.${key}` : key);
        }
        return acc;
      }, []);
    }
    return recursiveGetKeys(item);
  },
  /**
   *
   * @param {String} countryISO
   * @returns {{name: String, iso2: String, dialCode: String, priority: Number, areaCodes: Array, countryId: Number}|null}
   * Returns the country data object for the given country ISO ('US', 'GB', etc)
   */
  getCountryDetailsFromISO(countryISO) {
    return countryDataCodes.find(
      (c) => countryISO.toLocaleLowerCase() === c.iso2.toLocaleLowerCase()
    );
  },
  /**
   * @param {String} currency | iso2 currency code
   * @param {Number} amountInCurrency
   */
  convertCurrencyToCent(currency, amountInCurrency) {
    if (isNaN(amountInCurrency)) {
      throw new Error("Amount in currency is not a number");
    }
    return (
      Number(amountInCurrency) *
      (CURRENCY_FRACTIONS[currency.toUpperCase()] || 100)
    );
  },
  /**
   * @param {String} currency | iso 2 currency code
   * @param {Number} amountInCents
   */
  convertCentToCurrency(currency, amountInCents) {
    if (isNaN(amountInCents)) {
      throw new Error("Amount in cents is not a number");
    }
    return (
      Number(amountInCents) /
      (CURRENCY_FRACTIONS[currency.toUpperCase()] || 100)
    );
  },
  /**
   *
   * @param {String} currency
   * @param {Number} amount
   */
  checkDecimalsForCurrency(currency, amount) {
    const decimals =
      String(CURRENCY_FRACTIONS[currency.toUpperCase()] || 100).length - 1;
    // Check if amount has more decimals than allowed
    if (utilFunctions.decimalCount(amount) > decimals) {
      return false;
    }
    return true;
  },
  /**
   * @param {Number} num
   * @returns {Number} number of decimal digits
   */
  decimalCount(num) {
    // Convert to String
    const numStr = String(num);
    // String Contains Decimal
    if (numStr.includes(".")) {
      return numStr.split(".")[1].length;
    }
    // String Does Not Contain Decimal
    return 0;
  },
  /**
   * @param {Object} v
   */
  decimal2JSON(v, i, prev) {
    if (v !== null && typeof v === "object") {
      if (v.constructor.name === "Decimal128") prev[i] = v.toString();
      if (v.constructor.name === "Long") {
        prev[i] = String(v);
      } else
        Object.entries(v).forEach(([key, value]) =>
          utilFunctions.decimal2JSON(value, key, prev ? prev[i] : v)
        );
    }
  },
  decimal2JSONReturn(v) {
    if (Array.isArray(v))
      return v.map((_v) => utilFunctions.decimal2JSONReturn(_v));
    if (v !== null && typeof v === "object") {
      if (v instanceof Date) return v;
      if (v.constructor.name === "ObjectId") return v.toString();
      if (v.constructor.name === "Decimal128") return v.toString();
      if (v.constructor.name === "Long") return v.toString();
      return Object.entries(v).reduce((acc, [key, value]) => {
        acc[key] = utilFunctions.decimal2JSONReturn(value);
        return acc;
      }, {});
    }
    return v;
  },
  // Return offset on date for loc in ±H[:mm] format. Minutes only included if not zero
  getTimezoneOffset(date, loc) {
    // Try English to get offset. If get abbreviation, use French
    let offset;
    ["en", "fr"].some((lang) => {
      // Get parts - can't get just timeZoneName, must get one other part at least
      let parts = new Intl.DateTimeFormat(lang, {
        minute: "numeric",
        timeZone: loc,
        timeZoneName: "short",
      }).formatToParts(date);
      // Get offset from parts
      let tzName = parts.filter(
        (part) => part.type == "timeZoneName" && part.value
      );
      // timeZoneName starting with GMT or UTC is offset - keep and stop looping
      // Otherwise it's an abbreviation, keep looping
      if (/^(GMT|UTC)/.test(tzName[0].value)) {
        offset = tzName[0].value.replace(/GMT|UTC/, "") || "+0";
        return true;
      }
    });
    // Format offset as ±HH:mm
    // Normalise minus sign as ASCII minus (charCode 45)
    let sign = offset[0] == "\x2b" ? "\x2b" : "\x2d";
    let [h, m] = offset.substring(1).split(":");
    return (Number(h || 0) * 60 + Number(m || 0)) * (sign === "\x2b" ? -1 : +1);
  },
  findKey: (searchKey, obj) => {
    for (const key of Object.keys(obj)) {
      if (key === searchKey) return obj[key];
      if (typeof obj[key] === "object") {
        const res = utilFunctions.findKey(searchKey, obj[key]);
        if (res !== -1) return res;
      }
    }
    return -1;
  },
  /**
   *
   * @param {string | number} amount
   * @param {string} currency
   * @returns
   */
  formatCurrency: (amount, currency) => {
    try {
      if (isNaN(amount)) return "NaN";
      if (CRYPTO_CURRENCIES.includes(currency.toUpperCase())) {
        return `${currency.toUpperCase()} ${parseFloat(amount).toFixed(6)}`;
      }
      return parseFloat(amount).toLocaleString("en", {
        style: "currency",
        currency,
      });
    } catch (err) {
      console.error(err);
      if (isNaN(amount)) return "NaN";
      const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
      return symbol + amount;
    }
  },
  escapeStringForRegExp: (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  },
};

export default utilFunctions;
