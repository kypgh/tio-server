import UsersFinancialNotesModel from "../models/UsersFinancialNotes.model";

const UsersFinancialNotesService = {
  getNotesForUser: (user_id, page = 1, limit = 50) => {
    return UsersFinancialNotesModel.paginate(
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
    return UsersFinancialNotesModel.create({
      user: user_id,
      created_by: crmuser_id,
      note: note,
    });
  },
  updateNote: (note_id, note) => {
    return UsersFinancialNotesModel.updateOne({ _id: note_id }, { note: note });
  },
  deleteNote: (note_id) => {
    return UsersFinancialNotesModel.deleteOne({ _id: note_id });
  },
};

export default UsersFinancialNotesService;
