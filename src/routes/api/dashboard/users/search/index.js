import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import HTTPError from "../../../../../utils/HTTPError";
import errorCodes from "../../../../../config/errorCodes";
import Joi from "joi";
import { mongooseIDFunction } from "../../../../../utils/customValidation";
import { RequestHandler } from "express";
import usersService from "../../../../../services/users.service";
import utilFunctions from "../../../../../utils/util.functions";

const usersSearchSchema = Joi.object({
  field: Joi.string()
    .valid(
      "id",
      "name",
      "mt5_id",
      "ctrader_id",
      "email",
      "phone",
      "account",
      "readableId"
    )
    .required(),
  searchText: Joi.string().required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  let { value, error } = usersSearchSchema.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid query params", 400, {
      ...errorCodes.invalidQueryParams,
      ...error,
    });
  }

  let users = await usersService.searchUser(
    value.field,
    value.searchText,
    req.selectedBrand,
    req.allowedCountries
  );
  const resultUsers = users.map((user) =>
    utilFunctions.decimal2JSONReturn(
      typeof user.toJSON === "function" ? user.toJSON() : user
    )
  );
  res.status(200).json(resultUsers);
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
  },
};
