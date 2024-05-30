import {
  checkAccessToUserId,
  isCRMUser,
} from "../../../../../../middleware/auth.middleware";
import usersNotesService from "../../../../../../services/usersNotes.service";
import errorCodes from "../../../../../../config/errorCodes";
import { userHasAnyPermission } from "../../../../../../middleware/permissions.middleware";
import { PERMISSIONS } from "../../../../../../config/permissions";
import Joi from "joi";
import { RequestHandler } from "express";

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(50),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  // Validate request query
  const { value, error } = paginationSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ ...error, ...errorCodes.queryValidation });
  }
  let userNotes = await usersNotesService.getNotesForUser(
    req.query.user_id,
    value.page,
    value.limit
  );
  res.status(200).json(userNotes);
};

const createUsersNote = Joi.object({
  note: Joi.string().trim().required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request query
  const { value, error } = createUsersNote.validate(req.body);
  if (error) {
    return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
  }
  let userNote = await usersNotesService.createNewNote(
    req.query.user_id,
    req.crm_user._id,
    value.note
  );
  res.status(201).json({ note: userNote });
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    get: [userHasAnyPermission([PERMISSIONS.NOTES.view_notes])],
    post: [userHasAnyPermission([PERMISSIONS.NOTES.create_note])],
  },
};
