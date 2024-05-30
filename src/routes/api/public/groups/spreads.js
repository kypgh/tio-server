import { RequestHandler } from "express";
import Joi from "joi";
import { isValidAPIKey } from "../../../../middleware/webhook.middleware";
import groupSpreadsService from "../../../../services/groupSpreads.service";

const getGroupSpreadsSchema = Joi.object({
  group: Joi.string(),
  symbol: Joi.string(),
  platform: Joi.string().default("mt5").valid("mt5"),
});
/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = getGroupSpreadsSchema.validate(req.query);
  if (error) {
    res.status(400).json(error);
    return;
  }
  const results = await groupSpreadsService.getGroupSpreads(value);
  res.status(200).json({ platform: value.platform, groups: results });
};

export default {
  middleware: {
    all: [isValidAPIKey("MQMFaCGETyh87lC74jYCNaMM5idG9WeD")],
  },
};
