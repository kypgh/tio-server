import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import { isCRMUser } from "../../../../middleware/auth.middleware";
import { MODEL_FIELDS } from "../../../../models/modelFields";
import HTTPError from "../../../../utils/HTTPError";

const getFieldsForDataSchema = Joi.object({
  type: Joi.string().valid(...Object.keys(MODEL_FIELDS)),
});

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = getFieldsForDataSchema.validate(req.query);
  if (error) {
    throw new HTTPError("Invalid request", 400, {
      ...errorCodes.invalidRequest,
      ...error,
    });
  }
  if (value.type && MODEL_FIELDS[value.type]) {
    res.status(200).json(MODEL_FIELDS[value.type]);
  } else {
    res.status(200).json(MODEL_FIELDS);
  }
};

export default {
  middleware: {
    all: [isCRMUser],
  },
};
