import UsersNotesModel from "../models/UsersNotes.model";
import _ from "lodash";

const usersNotesService = {
  getNotesForUser: (user_id, page = 1, limit = 50) => {
    return UsersNotesModel.paginate(
      { user: user_id },
      {
        page,
        limit,
        populate: {
          path: "created_by",
          select: "first_name last_name",
        },
      }
    );
  },
  createNewNote: (user_id, crmuser_id, note) => {
    return UsersNotesModel.create({
      user: user_id,
      created_by: crmuser_id,
      note: note,
    });
  },
  updateNote: async (note_id, note, isPinned, user_id) => {
    if (!_.isNil(isPinned)) {
      await UsersNotesModel.updateMany({ user: user_id }, { isPinned: false });
      await UsersNotesModel.updateOne({ _id: note_id }, { isPinned: isPinned });
    }
    return UsersNotesModel.updateOne({ _id: note_id }, { note: note });
  },
  deleteNote: (note_id) => {
    return UsersNotesModel.deleteOne({ _id: note_id });
  },
};

export default usersNotesService;
