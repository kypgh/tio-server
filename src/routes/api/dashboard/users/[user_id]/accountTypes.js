import Joi from "joi";
import {
  CTRADER_CURRENCIES,
  MT5_CURRENCIES,
  PIX_CTRADER_CURRENCIES,
} from "../../../../../config/currencies";
import { CTRADER_LEVERAGES } from "../../../../../config/leverages";
import {
  MT5_DEMO_GROUPS,
  MT5_LIVE_GROUPS,
} from "../../../../../config/mt5Enums";
import {
  MT4_DEMO_GROUPS,
  MT4_LIVE_GROUPS,
} from "../../../../../config/mt4Enums";
import {
  checkAccessToUserId,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import usersService from "../../../../../services/users.service";
import { mongooseIDFunction } from "../../../../../utils/customValidation";
import { PERMISSIONS } from "../../../../../config/permissions";
import { userHasAnyPermission } from "../../../../../middleware/permissions.middleware";
import groupsService from "../../../../../services/groups.service";

const maGetAccountTypesSchema = Joi.object({
  user_id: Joi.string().custom(mongooseIDFunction).required(),
  environment_type: Joi.string().valid("live", "demo").default("live"),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = maGetAccountTypesSchema.validate(req.query);
  if (error) {
    return res.status(400).json(error);
  }
  const user = await usersService.getUserById(value.user_id);
  const response = groupsService.getAllowedAccountTypes({
    brand: user.brand,
    env: value.environment_type,
    shariaEnabled: user.metadata?.sharia_enabled,
  });

  if (response.ctrader.length === 0) delete response.ctrader;
  if (response.mt5.length === 0) delete response.mt5;
  if (response.mt4.length === 0) delete response.mt4;
  res.status(200).json(response);
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    get: [userHasAnyPermission([PERMISSIONS.USERS.get_user])],
  },
};
