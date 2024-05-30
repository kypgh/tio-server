import { RequestHandler } from "express";
import Joi from "joi";
import mongoose from "mongoose";
import { PERMISSIONS } from "../../../../../config/permissions";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import usersSegmentService from "../../../../../services/usersSegment.service";
import { filterValidationSchema } from "../../../../../utils/customValidation";

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
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request query
  const { value, error } = createOrUpdateUsersSegment.validate(req.body);
  if (error) {
    return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
  }

  // Business logic
  let response = await usersSegmentService.createSegment(
    value.name,
    value.filters,
    req.body.filters,
    req.selectedBrand
  );
  res.status(200).json(response);
};

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  let segments = await usersSegmentService.getAllSegments(req.selectedBrand);
  res.status(200).json(segments);
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.USER_SEGMENTS.view_user_segments])],
    post: [
      userHasAnyPermission([PERMISSIONS.USER_SEGMENTS.create_user_segments]),
    ],
  },
};
