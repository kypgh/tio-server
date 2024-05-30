import Joi from "joi";
import mongoose from "mongoose";
import _ from "lodash";
import { PERMISSIONS } from "../config/permissions";

export const passwordFunction = (value, helper) => {
  // const password_regex =
  //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\+\=<>\-_£@$!%*#?&,./\\';[\]"\^\(\)]).{8,}$/gm;
  let errorMsg = [];
  // split above regex:
  // ^(?=.*\d) - at least one digit
  // (?=.*[a-z]) - at least one lowercase letter
  // (?=.*[A-Z]) - at least one uppercase letter
  // (?=.*[\+\=<>\-_£@$!%*#?&,./\\';[\]"\^\(\)]) - at least one special character
  // .{8,} - at least 8 characters long
  if (!/^(?=.*\d)/gm.test(value)) {
    errorMsg.push("At least one digit");
  }
  if (!/^(?=.*[a-z])/gm.test(value)) {
    errorMsg.push("At least one lowercase letter");
  }
  if (!/^(?=.*[A-Z])/gm.test(value)) {
    errorMsg.push("At least one uppercase letter");
  }
  if (!/^(?=.*[\+\=<>\-_£@$!%*#?&,./\\';[\]"\^\(\)])/gm.test(value)) {
    errorMsg.push("At least one special character");
  }
  if (!/^(?=.{8,})/gm.test(value)) {
    errorMsg.push("At least 8 characters");
  }
  if (errorMsg.length > 0) {
    return helper.message(errorMsg.join("\n"));
  }
  return value;
};

export const COLOR_REGEX = /^#[0-9A-F]{6}$/i;

export const validPermissionsSchema = Joi.string().valid(
  ...Object.values(PERMISSIONS)
    .map((obj) => Object.values(obj))
    .flat()
);

export const mongooseIDFunction = (value, helper) => {
  if (mongoose.Types.ObjectId.isValid(value)) {
    return value;
  }
  return helper.message("Invalid ID format");
};

export const bicSwiftValidation = (value, helper) => {
  const re = new RegExp(
    "^([a-zA-Z]){4}([a-zA-Z]){2}([0-9a-zA-Z]){2}([0-9a-zA-Z]{3})?$"
  );
  if (re.test(value)) {
    return value;
  }
  return helper.message("Invalid BIC/Swift");
};

/**
 * @param {Object} allowedMap
 * @returns {Joi}
 *
 * Example: allowedMap = {
 *  name: "first_name",
 *  surname: "last_name",
 *  language: "metadata.lang",
 * }
 *
 * The key is the allowed value and the value is the resulting field name/location
 */
export const sortValidationSchema = (allowedMap) =>
  Joi.string().custom((value, helper) => {
    let sorts = value.split(",");
    let result = {};
    for (const sort of sorts) {
      let [field, direction = "asc"] = sort.split(":");
      if (!["asc", "desc"].includes(direction)) {
        return helper.message("Invalid sort direction", { field, direction });
      }
      if (!allowedMap[field]) {
        return helper.message("Invalid sort field", {
          field,
          direction,
          allowedFields: Object.keys(allowedMap),
        });
      }
      result[allowedMap[field]] = direction === "asc" ? 1 : -1;
    }
    return result;
  });

export const fieldValidationSchema = (allowedKeys = {}) =>
  Joi.string()
    .custom((value, helper) => {
      let fields = value.split(",");
      if (fields.length === 0) {
        return helper.message("Invalid fields");
      }
      for (const field of fields) {
        if (!allowedKeys[field]) {
          return helper.message(`Invalid field '${field}'`, {
            allowedFields: Object.keys(allowedKeys),
          });
        }
      }

      return _.filter(allowedKeys, (value, key) => fields.includes(key));
    })
    .default((value) => {
      if (!value.fields && !!value.export) {
        return Object.values(allowedKeys);
      }
      return [];
    });

const allowedOperators = ["eq", "ne", "gt", "gte", "lt", "lte", ""];
export const filterValidationSchema = (schema) =>
  Joi.string()
    .custom((_value, helper) => {
      let acc = {};
      for (const v of _value.split(",")) {
        let [_field, value] = v.split(":");
        const [field, _operator] = _field.split("[");
        const operator = _operator ? _operator.slice(0, -1) : "";
        if (!operator) {
          let check = value.split("|");
          value = check.length > 1 ? { $in: check } : value;
        }
        if (!field || !value) {
          return helper.message("Invalid filter syntax");
        }
        if (!Object.keys(schema).includes(field)) {
          return helper.message("Invalid filters", {
            allowedFields: Object.keys(schema),
          });
        }
        if (!allowedOperators.includes(operator)) {
          return helper.message("Invalid filter operators", {
            allowedOperators,
          });
        }
        if (typeof schema[field] === "string") {
          if (operator === "") {
            acc[schema[field]] = value;
          } else if (operator === "ne") {
            let check = value.split("|");
            acc[schema[field]] =
              check.length > 1
                ? { ["$nin"]: check }
                : { [`$${operator}`]: value };
          } else {
            acc[schema[field]] = { [`$${operator}`]: value };
          }
        } else if (typeof schema[field] === "function") {
          const result = schema[field](value, operator);
          for (const key in result) {
            if (acc[key]) acc[key] = { ...acc[key], ...result[key] };
            else acc = { ...acc, [key]: result[key] };
          }
        } else if (_.isPlainObject(schema[field])) {
          const validation = schema[field].validation.validate(value);
          if (validation.error) {
            validation.error.message = `invalid value for '${field}'`;
            throw validation.error;
          }
          const keyField = schema[field].key;
          if (typeof keyField === "function") {
            const result = keyField(validation.value, operator);
            for (const key in result) {
              if (acc[key]) acc[key] = { ...acc[key], ...result[key] };
              else acc = { ...acc, [key]: result[key] };
            }
          } else {
            if (operator === "") {
              acc[keyField] = validation.value;
            } else if (operator === "ne") {
              let check = value.split("|");
              acc[schema[field]] =
                check.length > 1
                  ? { ["$nin"]: check }
                  : { [`$${operator}`]: value };
            } else {
              acc[keyField] = { [`$${operator}`]: validation.value };
            }
          }
        } else {
          return helper.message("Filter setup error");
        }
      }
      return acc;
    })
    .default({});

// ------------------------------ //
// IBAN Validation
// ------------------------------ //

const ifStringIsNumber = (_string) => !Number.isNaN(Number(_string));

// prettier-ignore
const countries = {
  al: 28, ad: 24, at: 20, az: 28, bh: 22, be: 16, ba: 20, br: 29, bg: 22, cr: 21, hr: 21, cy: 28, cz: 24, dk: 18,
  do: 28, ee: 20, fo: 18, fi: 18, fr: 27, ge: 22, de: 22, gi: 23, gr: 27, gl: 18, gt: 28, hu: 28, is: 26, ie: 22,
  il: 23, it: 27, jo: 30, kz: 20, kw: 30, lv: 21, lb: 28, li: 21, lt: 20, lu: 20, mk: 19, mt: 31, mr: 27, mu: 30,
  mc: 27, md: 24, me: 22, nl: 18, no: 15, pk: 24, ps: 29, pl: 28, pt: 25, qa: 29, ro: 24, sm: 27, sa: 24, rs: 22,
  sk: 24, si: 19, es: 24, se: 24, ch: 21, tn: 24, tr: 26, ae: 23, gb: 22, vg: 24,
};

// prettier-ignore
const chars = {
  a: 10, b: 11, c: 12, d: 13, e: 14, f: 15, g: 16, h: 17, i: 18, j: 19, k: 20, l: 21, m: 22, n: 23, o: 24, p: 25,
  q: 26, r: 27, s: 28, t: 29, u: 30, v: 31, w: 32, x: 33, y: 34, z: 35,
};

const modulo = (aNumStr, aDiv) => {
  var tmp = "";
  var i, r;
  for (i = 0; i < aNumStr.length; i++) {
    tmp += aNumStr.charAt(i);
    r = tmp % aDiv;
    tmp = r.toString();
  }
  return tmp / 1;
};

function isValidIban(ib) {
  let iban = ib.replace(" ", "", ib).toLowerCase();
  if (countries[iban.slice(0, 2)]) {
    let moveChar = iban.substring(4) + iban.substring(0, 4);
    let movedCharArray = moveChar.split("");
    let newString = "";

    for (let index = 0; index < movedCharArray.length; ++index) {
      if (!ifStringIsNumber(movedCharArray[index])) {
        movedCharArray[index] = chars[movedCharArray[index]];
      }
      newString = newString + movedCharArray[index];
    }
    if (modulo(newString, "97") == 1) {
      return true;
    } else {
      return false;
    }
  }
}

export const ibanValidation = (value, helper) => {
  if (isValidIban(value)) {
    return value;
  }
  return helper.message("Invalid IBAN");
};

export const transactionsPercentagePerMonth = (
  deposits,
  withdrawals,
  month,
  year
) => {
  let total = deposits + withdrawals;
  let percentageD = Math.floor((deposits / total) * 100);
  let percentageW = 100 - percentageD;
  return { deposits: percentageD, withdrawals: percentageW, month, year };
};

// ------------------------------ //
