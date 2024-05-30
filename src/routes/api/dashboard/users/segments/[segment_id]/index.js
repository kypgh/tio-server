import { RequestHandler } from "express";
import Joi from "joi";
import mongoose from "mongoose";
import errorCodes from "../../../../../../config/errorCodes";
import { PERMISSIONS } from "../../../../../../config/permissions";
import { isCRMUser } from "../../../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import usersSegmentService from "../../../../../../services/usersSegment.service";
import {
  filterValidationSchema,
  mongooseIDFunction,
} from "../../../../../../utils/customValidation";
import HTTPError from "../../../../../../utils/HTTPError";

const getUsersSegmentsClientsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
  segment_id: Joi.string().custom(mongooseIDFunction).required(),
});

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  // Validate request query
  const { value, error } = getUsersSegmentsClientsSchema.validate(req.query);

  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }

  let Segment = await usersSegmentService.getSegmentClientsById(
    value.segment_id,
    req.selectedBrand,
    value.page,
    value.limit
  );

  res.status(200).json(Segment);
};

const createOrUpdateUsersSegment = Joi.object({
  name: Joi.string().required(),
  filters: filterValidationSchema({
    country: "country",
    language: "metadata.language",
    kycStatus: {
      validation: Joi.boolean(),
      key: "flags.kycApproved",
    },
    userDeposits: (value, op) => ({
      "accounts_info.total_deposits_usd": {
        ["$" + op]: mongoose.Types.Decimal128(value),
      },
    }),
    liveAccounts: (value) => ({
      "accounts.live": { $gte: parseInt(value) },
    }),
    demoAccounts: (value) => ({
      "accounts.demo": { $gte: parseInt(value) },
    }),
    fromDate: (value) => ({ createdAt: { $gte: new Date(value) } }),
    toDate: (value) => ({ createdAt: { $lte: new Date(value) } }),
    deviceType: "metadata.deviceType",
    ftdAmount: (value, op) => ({
      "user_transactions.0.processed_usd_amount": {
        ["$" + op]: mongoose.Types.Decimal128(value),
      },
    }),
  }),
});

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  // Validate request query
  const { value, error } = createOrUpdateUsersSegment.validate(req.body);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }

  // Business logic
  let response = await usersSegmentService.updateSegment(
    req.query.segment_id,
    value.name,
    value.filters,
    req.body.filters
  );

  res.status(202).json({ response });
};

const mongooseIDSchema = Joi.string().custom(mongooseIDFunction).required();
/**
 * @type {RequestHandler}
 */
export const DELETE = async (req, res) => {
  // Validate request
  const { value, error } = mongooseIDSchema.validate(req.query.segment_id);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid crmuser_id", 400, { ...error, ...errorCodes.bodyValidation });
  }
  // Business logic
  let delete_details = await usersSegmentService.deleteSegment(
    req.query.segment_id
  );
  res.status(201).json(delete_details);
};

export default {
  middleware: {
    all: [isCRMUser],
    get: [
      userHasAnyPermission([
        PERMISSIONS.USER_SEGMENTS.view_user_segment_results,
      ]),
    ],
    put: [
      userHasAnyPermission([PERMISSIONS.USER_SEGMENTS.update_user_segments]),
    ],
    delete: [
      userHasAnyPermission([PERMISSIONS.USER_SEGMENTS.delete_user_segments]),
    ],
  },
};
