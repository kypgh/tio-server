import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../../config/errorCodes";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../../middleware/auth.middleware";
import HTTPError from "../../../../../utils/HTTPError";
import calendarEventsService from "../../../../../services/calendarEvents.service";

/**
 * @type {RequestHandler}
 */
export const DELETE = async (req, res) => {
  await calendarEventsService.deleteCalendarEvent({
    calendarEvent: req.query.calendar_event_id,
  });
  res.status(200).json({ message: "Event deleted" });
};

const UpdateCalendarEventSchemaStatus = Joi.object({
  completed: Joi.boolean().required(),
});

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  // Validate request query
  const { value, error } = UpdateCalendarEventSchemaStatus.validate(req.body);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.bodyValidation });
  }

  const calendarEvent = await calendarEventsService.updateCalendarEvent({
    ...value,
    event: req.query.calendar_event_id,
  });

  return res.status(200).json({ calendarEvent });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
  },
};
