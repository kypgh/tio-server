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

const updateRibbonsSchema = Joi.object({
  color: Joi.string().regex(COLOR_REGEX).required(),
  title: Joi.string().required(),
  url: Joi.string().required(),
  isExternal: Joi.boolean().required(),
  enabled: Joi.boolean().required(),
  closable: Joi.boolean().required(),
  type: Joi.string().valid("user", "segment").required(),
  ribbon_id: Joi.string().custom(mongooseIDFunction),
});

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  const { value, error } = updateRibbonsSchema.validate({
    ...req.query,
    ...req.body,
  });
  if (error) {
    throw new HTTPError("Validation Error", 400, {
      ...error,
      ...errorCodes.bodyValidation,
    });
  }

  let ribbon;
  if (value.type === "user") {
    ribbon = await ribbonsService.updateRibbonForUser(value.ribbon_id, value);
  } else {
    ribbon = await ribbonsService.updateRibbonForSegment(
      value.ribbon_id,
      value
    );
  }
  res.status(201).json({ ribbon });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
    put: [userHasAnyPermission([PERMISSIONS.RIBBONS.update_ribbons])],
  },
};
