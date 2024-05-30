import CalendarEventsModel from "../models/CalendarEvents.Model";

const calendarEventsService = {
  createCalendarEvent: async ({ title, start, end, eventType, user }) => {
    return CalendarEventsModel.create({
      title,
      start,
      end,
      eventType,
      user,
    });
  },
  getCalendarEvents: async ({ user, start, end }) => {
    return CalendarEventsModel.find({
      $or: [
        {
          $and: [
            { start: { $gte: new Date(start) } },
            { start: { $lte: new Date(end) } },
          ],
        },
        {
          $and: [
            { end: { $gte: new Date(start) } },
            { end: { $lte: new Date(end) } },
          ],
        },
      ],
      user: user,
      completed: false,
    }).sort({ start: 1 });
  },
  updateCalendarEvent: async ({ event, completed }) => {
    return CalendarEventsModel.findByIdAndUpdate(
      event,
      { completed },
      { new: true }
    );
  },
  deleteCalendarEvent: async ({ calendarEvent }) => {
    return CalendarEventsModel.findByIdAndDelete(calendarEvent);
  },
};

export default calendarEventsService;
