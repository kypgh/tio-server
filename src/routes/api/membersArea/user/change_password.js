import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import { RequestHandler } from "express";
import Joi from "joi";
import { passwordFunction } from "../../../../utils/customValidation";
import usersService from "../../../../services/users.service";

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().custom(passwordFunction).required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = changePasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error);
  }
  let user = await usersService.changePassword(
    req.user._id,
    value.oldPassword,
    value.newPassword
  );
  res.status(200).json({ user });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
