import { RequestHandler } from "express";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../middleware/auth.middleware";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  res.status(200).json({ user: req.crm_user });
};

export default {
  middleware: {
    all: [isCRMUser],
  },
};
