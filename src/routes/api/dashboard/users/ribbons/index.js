import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import HTTPError from "../../../../../utils/HTTPError";
import errorCodes from "../../../../../config/errorCodes";
import ribbonsService from "../../../../../services/ribbons.service";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../config/permissions";
import { RequestHandler } from "express";
import Joi from "joi";
import {
  mongooseIDFunction,
  COLOR_REGEX,
} from "../../../../../utils/customValidation";

const getRibbonsSchema = Joi.object({
  user_id: Joi.string().custom(mongooseIDFunction),
  segment_id: Joi.string().custom(mongooseIDFunction),
}).or("user_id", "segment_id");

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = getRibbonsSchema.validate(req.query);
  if (error) {
    throw new HTTPError("Validation error", 400, {
      ...error,
      ...errorCodes.queryValidation,
    });
  }
  if (value.user_id) {
    const { userRibbons, segmentRibbons } =
      await ribbonsService.getRibbonsForUser(value.user_id);
    res.status(200).json({ userRibbons, segmentRibbons });
  } else {
    const segmentRibbons = await ribbonsService.getRibbonsForSegment(
      value.segment_id
    );
    res.status(200).json({ segmentRibbons });
  }
};

const createRibbonSchema = Joi.object({
  color: Joi.string().regex(COLOR_REGEX).required(),
  title: Joi.string().required(),
  url: Joi.string().required(),
  isExternal: Joi.boolean().required(),
  enabled: Joi.boolean().required(),
  closable: Joi.boolean().required(),
  user_id: Joi.string().custom(mongooseIDFunction),
  segment_id: Joi.string().custom(mongooseIDFunction),
}).or("user_id", "segment_id");

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = createRibbonSchema.validate(req.body);
  if (error) {
    throw new HTTPError("Validation Error", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }

  let ribbon;
  if (value.user_id) {
    ribbon = await ribbonsService.createRibbonForUser(value);
  } else {
    ribbon = await ribbonsService.createRibbonForSegment(value);
  }
  res.status(201).json({ ribbon });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    get: [userHasAnyPermission([PERMISSIONS.RIBBONS.view_ribbons])],
    post: [userHasAnyPermission([PERMISSIONS.RIBBONS.create_ribbons])],
  },
};
