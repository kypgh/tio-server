import { RequestHandler } from "express";
import Joi from "joi";
import errorCodes from "../../../../config/errorCodes";
import {
  checkBrandAccess,
  isCRMUser,
} from "../../../../middleware/auth.middleware";
import HTTPError from "../../../../utils/HTTPError";
import { CALENDAR_EVENT_TYPES } from "../../../../config/enums";
import calendarEventsService from "../../../../services/calendarEvents.service";
import { mongooseIDFunction } from "../../../../utils/customValidation";

const GetCalendarEventsSchema = Joi.object({
  user_id: Joi.string().custom(mongooseIDFunction).required(),
  start: Joi.number().required(),
  end: Joi.number().required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  const { value, error } = GetCalendarEventsSchema.validate(req.query);
  if (error) {
    return res.status(400).json(error);
  }
  const calendarEvents = await calendarEventsService.getCalendarEvents({
    user: value.user_id,
    start: value.start,
    end: value.end,
  });
  res.status(200).json({ calendarEvents });
};

const createCalendarEventSchema = Joi.object({
  title: Joi.string().trim().required(),
  start: Joi.date().required(),
  end: Joi.date().required(),
  eventType: Joi.string()
    .valid(...Object.values(CALENDAR_EVENT_TYPES))
    .required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request query
  const { value, error } = createCalendarEventSchema.validate(req.body);
  if (error) {
    // prettier-ignore
    throw new HTTPError("Invalid request", 400, { ...error, ...errorCodes.bodyValidation });
  }

  const calendarEvent = await calendarEventsService.createCalendarEvent({
    ...value,
    user: req.query.user_id,
  });

  return res.status(200).json({ calendarEvent });
};

export default {
  middleware: {
    all: [isCRMUser, checkBrandAccess],
  },
};
