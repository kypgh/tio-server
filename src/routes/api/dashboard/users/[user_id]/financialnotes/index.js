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
  let userFinancialNotes = await usersFinancialNotesService.getNotesForUser(
    req.query.user_id,
    value.page,
    value.limit
  );
  res.status(200).json(userFinancialNotes);
};

const createUsersFinancialNote = Joi.object({
  note: Joi.string().trim().required(),
}).unknown(true);

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // Validate request query
  const { value, error } = createUsersFinancialNote.validate(req.body);
  if (error) {
    return res.status(400).json({ ...error, ...errorCodes.bodyValidation });
  }
  let userFinancialNote = await usersFinancialNotesService.createNewNote(
    req.query.user_id,
    req.crm_user._id,
    value.note
  );
  res.status(201).json({ financial_note: userFinancialNote });
};

export default {
  middleware: {
    all: [isCRMUser, checkAccessToUserId],
    get: [
      userHasAnyPermission([PERMISSIONS.FINANCIAL_NOTES.view_financial_notes]),
    ],
    post: [
      userHasAnyPermission([PERMISSIONS.FINANCIAL_NOTES.create_financial_note]),
    ],
  },
};
