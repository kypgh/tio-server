import { RequestHandler } from "express";
import { PERMISSIONS } from "../../../../config/permissions";
import { isCRMUser } from "../../../../middleware/auth.middleware";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  res.status(200).json({ permissions: PERMISSIONS });
};

export default {
  middleware: {
    all: [isCRMUser],
  },
};
