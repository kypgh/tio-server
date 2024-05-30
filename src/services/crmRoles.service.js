import errorCodes from "../config/errorCodes";
import CRMPermissionsModel from "../models/CRMPermissions.model";
import CRMUserRolesModel from "../models/CRMUserRoles.model";
import CRMUsersModel from "../models/CRMUsers.model";
import HTTPError from "../utils/HTTPError";

const crmRolesService = {
  getAllRoles: async (brand) => {
    return await CRMUserRolesModel.find({ brand });
  },
  createNewRole: async (name, permissions, brand) => {
    let existingRole = await CRMUserRolesModel.findOne({ name, brand });
    if (existingRole) {
      throw new HTTPError(
        "Role with that name already exists",
        409,
        errorCodes.userAlreadyExists
      );
    }
    return CRMUserRolesModel.create({
      name,
      permissions,
      brand,
    });
  },
  deleteRoleById: async (id, brand) => {
    let role = await CRMUserRolesModel.findOne({ _id: id, brand });
    if (["admin", "default"].includes(role.name)) {
      throw new HTTPError(
        "Cannot delete default or admin roles",
        403,
        errorCodes.cannotDeleteDefaultAndAdminRoles
      );
    }
    let numberOfUsersAssignedToRole = await CRMPermissionsModel.countDocuments({
      role: id,
    });
    if (numberOfUsersAssignedToRole > 0) {
      throw new HTTPError(
        "Cannot delete role with users assigned to it",
        409,
        errorCodes.roleAssignedToUsers
      );
    }
    return role.remove();
  },
  addPermissionsToRole: async (role_id, permissions, brand) => {
    return CRMUserRolesModel.findOneAndUpdate(
      { _id: role_id, brand },
      { $addToSet: { permissions } },
      { returnDocument: "after" }
    );
  },
  removePermissionsToRole: async (role_id, permissions, brand) => {
    return CRMUserRolesModel.findOneAndUpdate(
      { _id: role_id, brand },
      { $pullAll: { permissions } },
      { returnDocument: "after" }
    );
  },
};

export default crmRolesService;
