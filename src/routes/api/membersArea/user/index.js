import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import { RequestHandler } from "express";
import utilFunctions from "../../../../utils/util.functions";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const user = utilFunctions.decimal2JSONReturn(req.user);
  delete user.password;
  delete user.ctrader_password;
  delete user.nationalIdentificationNumber;
  res.status(200).json({ user });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
