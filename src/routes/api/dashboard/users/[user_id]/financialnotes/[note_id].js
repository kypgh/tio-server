import {
  checkAccessToUserId,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import usersFinancialNotesService from "../../../../../../services/usersFinancialNotes.service";
import errorCodes from "../../../../../../config/errorCodes";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../../config/permissions";
import { RequestHandler } from "express";
import Joi from "joi";

const updateFinancialNoteSchema = Joi.object({
  note: Joi.string().trim().required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const PUT = async (req, res) => {
  // Validate request query
  // Validate request query
  const { value, error } = updateFinancialNoteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
  }
  let details = await usersFinancialNotesService.updateNote(
    req.query.note_id,
    value.note
  );
  res.status(202).json({ details });
};

/**
 * @type {RequestHandler}
 */
export const DELETE = async (req, res) => {
  let details = await usersFinancialNotesService.deleteNote(req.query.note_id);
  res.status(201).json(details);
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    put: [
      userHasAnyPermission([PERMISSIONS.FINANCIAL_NOTES.update_financial_note]),
    ],
    delete: [
      userHasAnyPermission([PERMISSIONS.FINANCIAL_NOTES.delete_financial_note]),
    ],
  },
};
