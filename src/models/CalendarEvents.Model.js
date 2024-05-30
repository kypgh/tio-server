import mongoose from "mongoose";
import "./Users.model";
import { CALENDAR_EVENT_TYPES } from "../config/enums";
const { Schema } = mongoose;

// This token is used by ctrader to verify the user for long term access
const CalendarEventsSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    eventType: {
      type: String,
      enum: Object.values(CALENDAR_EVENT_TYPES),
      required: true,
    },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CalendarEvents", CalendarEventsSchema);
