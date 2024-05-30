import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import userRequestsService from "../../../../../services/userRequests.service";
import HTTPError from "../../../../../utils/HTTPError";
import errorCodes from "../../../../../config/errorCodes";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../config/permissions";
import exportService from "../../../../../services/export.service";
import { ALLOWED_EXPORT_FORMATS } from "../../../../../config/enums";
import { RequestHandler } from "express";
import Joi from "joi";
import {
  filterValidationSchema,
  sortValidationSchema,
  fieldValidationSchema,
} from "../../../../../utils/customValidation";
import FIELDS from "../../../../../config/fields";
import mongoose from "mongoose";
import responseUtils from "../../../../../utils/response.utils";
import _ from "lodash";
import { DateTime } from "luxon";

const getUserRequestsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
  filters: filterValidationSchema({
    user_id: (v) => ({ "user._id": mongoose.Types.ObjectId(v) }),
    request_type: "request_type",
    status: "status",
    withdrawAmount: { validation: Joi.number(), key: "metadata.amount" },
    withdrawCurrency: "metadata.currency",
    fromDate: (value) => ({ createdAt: { $gte: new Date(value) } }),
    toDate: (value) => ({ createdAt: { $lte: new Date(value) } }),
  }),
  sort: sortValidationSchema({
    cid: "user.ctrader_id",
    email: "user.email",
    type: "request_type",
    createdAt: "created_at",
    updatedAt: "updatedAt",
  }),
  export: Joi.string()
    .trim()
    .allow(...Object.values(ALLOWED_EXPORT_FORMATS)),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = getUserRequestsSchema.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid query params", 400, {
      ...errorCodes.invalidQueryParams,
      ...error,
    });
  }

  const requests = await userRequestsService.getRequests({
    page: value.page,
    limit: value.limit,
    filters: value.filters,
    sort: value.sort,
    paginated: !value.export,
    brand: req.selectedBrand,
    allowedCountries: req.allowedCountries,
  });
  if (!value.export) {
    return res.status(200).json(requests);
  }

  const csv = exportService.jsonToCSV(requests, [
    { label: "User ID", value: "user.readableId" },
    { label: "Name", value: (v) => `${v.user.first_name} ${v.user.last_name}` },
    { label: "Email", value: "user.email" },
    { label: "Request Type", value: (v) => _.lowerCase(v.request_type) },
    { label: "Request Status", value: "status" },
    { label: "Request Description", value: "metadata.description" },
    {
      label: "Created At",
      value: (v) =>
        DateTime.fromJSDate(new Date(v.createdAt)).toFormat("dd/MM/yyyy HH:mm"),
    },
    {
      label: "Updated At",
      value: (v) =>
        DateTime.fromJSDate(new Date(v.updatedAt)).toFormat("dd/MM/yyyy HH:mm"),
    },
  ]);
  return responseUtils.sendExportResponse({
    csv,
    filename: "requests",
    format: value.export,
    res,
  });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [
      userHasAnyPermission([
        PERMISSIONS.REQUESTS.view_requests,
        PERMISSIONS.REQUESTS.view_pending_withdrawals,
      ]),
    ],
  },
};
