import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import { RequestHandler } from "express";
import Joi from "joi";
import twilioSmsService from "../../../../services/twilioSms.service";
import usersService from "../../../../services/users.service";

const changePhoneSchema = Joi.object({
  phone: Joi.string().required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = changePhoneSchema.validate(req.body);
  if (error) {
    res.status(400).json(error);
    return;
  }
  await twilioSmsService.genOTP(value.phone, req.user.language);
  res.status(200).json({ message: `OTP send to phone ${value.phone}` });
};

const verifyPhoneSchema = Joi.object({
  phone: Joi.string().required(),
  otp: Joi.number().required(),
});

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  const { value, error } = verifyPhoneSchema.validate(req.body);
  if (error) {
    res.status(400).json(error);
    return;
  }

  await twilioSmsService.verifyOTP(value.phone, value.otp);

  await usersService.changePhone({
    user_id: req.user._id,
    phone: value.phone,
  });
  res.status(201).json({ message: "Phone verified" });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
