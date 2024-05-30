import { RequestHandler } from "express";
import { isCRMUser } from "../../../../middleware/auth.middleware";
import crmUsersService from "../../../../services/crmUsers.service";

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Business logic
  let success = await crmUsersService.logoutUser(req.crm_user._id);
  res.status(200).json({ success });
};

export default {
  middleware: {
    post: [isCRMUser],
  },
};
