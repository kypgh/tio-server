import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import { RequestHandler } from "express";
import emailService from "../../../../services/email.service";
import universalTokensService from "../../../../services/universalTokens.service";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  if (req.user?.flags?.emailVerified) {
    res.status(409).json({ message: "Email already verified" });
    return;
  }
  const verifyEmailToken = await universalTokensService.createVerifyEmailToken(
    req.user._id
  );
  await emailService.emailVerifyEmail({ user: req.user, verifyEmailToken });
  res.status(200).json({ message: "Email send to user" });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
