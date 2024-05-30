import UsersModel from "../models/Users.model";

export default async function userExists(user_id) {
  let user = await UsersModel.findById(user_id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}