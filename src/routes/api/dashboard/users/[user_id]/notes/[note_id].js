import {
  checkAccessToUserId,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import usersNotesService from "../../../../../../services/usersNotes.service";
import errorCodes from "../../../../../../config/errorCodes";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../../config/permissions";
import { RequestHandler } from "express";
import Joi from "joi";

const updateNoteSchema = Joi.object({
  note: Joi.string().trim().required(),
  isPinned: Joi.boolean(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  // Validate request query
  const { value, error } = updateNoteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
  }
  let details = await usersNotesService.updateNote(
    req.query.note_id,
    value.note,
    value.isPinned,
    req.query.user_id
  );
  res.status(202).json({ details });
};

/**
 * @type {RequestHandler}
 */
export const DELETE = async (req, res) => {
  let details = await usersNotesService.deleteNote(req.query.note_id);
  res.status(201).json(details);
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    put: [userHasAnyPermission([PERMISSIONS.NOTES.update_note])],
    delete: [userHasAnyPermission([PERMISSIONS.NOTES.delete_note])],
  },
};
