import { isMembersAreaUser } from "../../../../middleware/membersArea.middleware";
import { RequestHandler } from "express";
import Joi from "joi";
import usersService from "../../../../services/users.service";

const receiveEmailNotifications = Joi.object({
  dailyEmail: Joi.boolean(),
});

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  const { value, error } = receiveEmailNotifications.validate(req.body);
  if (error) {
    res.status(400).json(error);
    return;
  }
  const result = await usersService.updateUserNotificationPreferences(
    req.user._id,
    value
  );
  res.status(201).json({ message: "Notification preferences updated" });
};

export default {
  middleware: {
    all: [isMembersAreaUser],
  },
};
