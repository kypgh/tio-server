import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import { RequestHandler } from "express";
import twilioSmsService from "../../../../services/twilioSms.service";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import usersService from "../../../../services/users.service";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  if (req.user?.flags?.phoneVerified) {
    res.status(409).json({ message: "Phone already verified" });
    return;
  }
  await twilioSmsService.genOTP(req.user.phone, req.user.language);
  res.status(200).json({ message: "OTP send to phone number" });
};

const verifyPhoneSchema = Joi.object({
  otp: Joi.string().required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = verifyPhoneSchema.validate(req.body);
  if (error) {
    res.status(400).json(error);
    return;
  }
  // Verify phone one time password
  const verify_phone_otp = await twilioSmsService.verifyOTP(
    req.user.phone,
    value.otp
  );
  if (!verify_phone_otp.valid) {
    res.status(400).json(errorCodes.invalidPhoneOTP);
    return;
  }
  await usersService.setPhoneVerified(req.user._id);
  res.status(200).json({ message: "Success" });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
