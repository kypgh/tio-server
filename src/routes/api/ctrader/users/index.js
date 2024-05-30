import { RequestHandler } from "express";
import { userIsLoggedIn } from "../../../../middleware/user.middleware";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  res.status(200).json({ user: req.user.toJSON() });
};

export default {
  middleware: {
    all: [userIsLoggedIn],
  },
};
