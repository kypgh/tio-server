import Joi from "joi";
import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import groupsService from "../../../../services/groups.service";

const maGetAccountTypesSchema = Joi.object({
  environment_type: Joi.string().valid("live", "demo").default("live"),
});

/**
 * @type {import("express").RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = maGetAccountTypesSchema.validate(req.query);
  if (error) {
    return res.status(400).json(error);
  }
  const response = groupsService.getAllowedAccountTypes({
    brand: req.user.brand,
    env: value.environment_type,
    shariaEnabled: req.user.metadata?.sharia_enabled,
  });

  if (response.ctrader.length === 0) delete response.ctrader;
  if (response.mt5.length === 0) delete response.mt5;
  if (response.mt4.length === 0) delete response.mt4;

  res.status(200).json(response);
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
