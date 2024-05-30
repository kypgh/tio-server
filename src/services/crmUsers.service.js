import bcrypt from "bcrypt";
import { CRM_JWT_SECRET } from "../config/envs";
import { BCRYPT_SALT_ROUNDS } from "../config/enums";
import jwt from "jsonwebtoken";
import CRMUsersModel from "../models/CRMUsers.model";
import CRMUserRolesModel from "../models/CRMUserRoles.model";
import crmRefreshTokenService from "./crmRefreshToken.service";
import HTTPError from "../utils/HTTPError";
import errorCodes from "../config/errorCodes";
import utilFunctions from "../utils/util.functions";
import CRMPermissionsModel from "../models/CRMPermissions.model";

function createJWT(user) {
  return jwt.sign(user, CRM_JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "10m",
  });
}

const crmUsersService = {
  getAllCRMUsers: async ({ page = 1, limit = 50, brand }) => {
    return CRMUsersModel.paginate(
      { brands: { $ne: brand } },
      {
        page,
        limit,
        select: {
          _id: 1,
          email: 1,
          first_name: 1,
          last_name: 1,
          brands: 1,
        },
      }
    );
  },
  getSalesAgentsForBrand: async (brand) => {
    return CRMPermissionsModel.aggregate([
      { $match: { brand, department: "sales" } },
      {
        $lookup: {
          from: "crmusers",
          localField: "crmuserId",
          foreignField: "_id",
          as: "crmuser",
        },
      },
      { $unwind: "$crmuser" },
      { $replaceRoot: { newRoot: "$crmuser" } },
    ]);
  },
  getAllCRMUsersPerBrand: async (
    page = 1,
    limit = 50,
    sort,
    department,
    brand
  ) => {
    let filter = { department, brands: brand };
    filter = utilFunctions.pruneNullOrUndefinedFields(filter);
    let aggrgation = CRMUserRolesModel.aggregate([
      {
        $lookup: {
          from: "crmpermissions",
          localField: "_id",
          foreignField: "crmuserId",
          as: "extras",
          pipeline: [{ $match: { brand: brand } }],
        },
      },
      { $unwind: "$extras" },
      {
        $addFields: {
          role: "$extras.role",
          permissions: "$extras.permissions",
          suspended: "$extras.suspended",
          sales_rotation_countries: "$extras.sales_rotation_countries",
          department: "$extras.department",
          enable_country_whitelist: "$extras.enable_country_whitelist",
          whitelist_countries: "$extras.whitelist_countries",
        },
      },
      { $project: { extras: 0, password: 0 } },
      {
        $lookup: {
          from: "crmuserroles",
          localField: "role",
          foreignField: "_id",
          as: "role",
        },
      },
      { $unwind: "$role" },
      { $match: filter },
    ]);

    return CRMUsersModel.aggregatePaginate(aggrgation, {
      page,
      limit,
      sort,
      populate: "role",
    });
  },
  copyCRMUserPermissions: async (crmuserId, brand, otherBrand) => {
    const crmUser = await CRMUsersModel.findOne({ _id: crmuserId });
    let existingPerms = await CRMPermissionsModel.findOne({
      crmuserId: crmuserId,
      brand,
    });
    if (existingPerms) {
      throw new HTTPError("User already has permissions for this brand", 409, {
        message: "User already has permissions for this brand",
      });
    }
    let otherPerms = await CRMPermissionsModel.findOne({
      crmuserId: crmuserId,
      brand: otherBrand,
    }).populate("role");

    if (existingPerms) {
      throw new HTTPError("User not found for the other brand", 409, {
        message: "User not found for the other brand",
      });
    }
    let otherRole = await CRMUserRolesModel.findOne({
      brand,
      name: otherPerms.role.name,
    });
    if (!otherRole) {
      otherRole = await CRMUserRolesModel.findOne({
        brand,
        name: "default",
      });
    }
    await CRMPermissionsModel.create({
      crmuserId: crmuserId,
      brand,
      department: otherPerms.department,
      role: otherRole._id,
      permissions: otherPerms.permissions,
      suspended: otherPerms.suspended,
    });
    crmUser.brands.push(brand);
    return crmUser.save();
  },
  getCRMUserPermissionsByBrand: async (crmuserId, brand) => {
    return CRMPermissionsModel.findOne({ crmuserId, brand }).populate("role");
  },
  createNewUser: async ({
    email,
    password,
    first_name,
    last_name,
    department,
    roleId,
    permissions,
    brand,
  }) => {
    let existingUser = await CRMUsersModel.findOne({ email });
    if (existingUser) {
      if (existingUser.brands.includes(brand)) {
        throw new HTTPError(
          "User with that email already exists",
          409,
          errorCodes.userAlreadyExists
        );
      } else {
        let roleExists = await CRMUserRolesModel.findOne({
          _id: roleId,
          brand,
        });
        if (!roleExists) {
          let defaultRole = await CRMUserRolesModel.findOne({
            brand,
            name: "default",
          });
          roleId = defaultRole._id;
        }
        let newUserPerms = await CRMPermissionsModel.create({
          crmuserId: existingUser._id,
          brand: brand,
          department,
          role: roleId,
          permissions,
        });
        let crmUser = await CRMUsersModel.findOneAndUpdate(
          { _id: existingUser._id },
          { $addToSet: { brands: brand } },
          {
            returnDocument: "after",
          }
        );
        return crmUser;
      }
    } else {
      let hashed_password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
      let crm_user = new CRMUsersModel({
        email,
        password: hashed_password,
        first_name,
        last_name,
        brands: [brand],
      });
      let roleExists = await CRMUserRolesModel.findOne({ _id: roleId, brand });
      if (!roleExists) {
        let defaultRole = await CRMUserRolesModel.findOne({
          brand,
          name: "default",
        });
        roleId = defaultRole._id;
      }

      let newUserPerms = await CRMPermissionsModel.create({
        crmuserId: crm_user._id,
        brand: brand,
        department,
        role: roleId,
        permissions,
      });
      return crm_user.save();
    }
  },
  loginUser: async (email, password) => {
    let user = await CRMUsersModel.findOne({ email });
    if (!user) {
      throw new HTTPError(
        "User does not exist",
        404,
        errorCodes.userDoesNotExist
      );
    }
    let perms = await CRMPermissionsModel.findOne({
      crmuserId: user._id,
      brand: user.brands[0],
    }).populate("role");

    if (!perms) {
      throw new HTTPError(
        "User Permissions do not exist",
        404,
        errorCodes.userDoesNotExist
      );
    }
    if (perms.suspended) {
      throw new HTTPError("User is suspended", 403, errorCodes.userSuspended);
    }
    let result = user.validatePassword(password);
    if (!result) {
      throw new HTTPError(
        "Invalid password",
        401,
        errorCodes.invalidLoginCredentials
      );
    }
    let refresh_token = await crmRefreshTokenService.createRefreshToken(
      user._id
    );
    let resultUser = user.toJSON();
    resultUser.permissions = perms.permissions;
    resultUser.suspended = perms.suspended;
    resultUser.role = perms.role;
    resultUser.department = perms.department;
    resultUser.selectedBrand = perms.brand;
    resultUser.sales_rotation_countries = perms.sales_rotation_countries;
    resultUser.enable_country_whitelist = perms.enable_country_whitelist;
    resultUser.whitelist_countries = perms.whitelist_countries;
    let jwt_token = createJWT(resultUser);
    return { jwt_token, refresh_token, user: resultUser };
  },
  logoutUser: (user_id) => {
    return crmRefreshTokenService.deleteRefreshToken(user_id);
  },
  updateUserDetails: async (
    user_id,
    brand,
    { email, password, first_name, last_name, department, role }
  ) => {
    if (department || role) {
      let updatePerms = {};
      if (department) updatePerms.department = department;
      if (role) updatePerms.role = role;
      await CRMPermissionsModel.updateOne(
        {
          crmuserId: user_id,
          brand: brand,
        },
        {
          $set: updatePerms,
        }
      );
    }
    let update = {};
    if (password) {
      let hashed_password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
      update.password = hashed_password;
    }
    if (email) update.email = email;
    if (first_name) update.first_name = first_name;
    if (last_name) update.last_name = last_name;
    return CRMUsersModel.updateOne({ _id: user_id }, { $set: update });
  },
  addCRMSalesCountries: async (user_id, sales_rotation_countries, brand) => {
    return CRMPermissionsModel.findOneAndUpdate(
      { crmuserId: user_id, brand },
      { $addToSet: { sales_rotation_countries } },
      { returnDocument: "after" }
    ).then((res) => {
      if (!res) {
        throw new HTTPError(
          "Invalid CRM User Id",
          401,
          errorCodes.userWithIdNotFound
        );
      }
      return res;
    });
  },
  removeCRMSalesCountries: async (user_id, sales_rotation_countries, brand) => {
    return CRMPermissionsModel.findOneAndUpdate(
      { crmuserId: user_id, brand },
      { $pullAll: { sales_rotation_countries } },
      { returnDocument: "after" }
    ).then((res) => {
      if (!res) {
        throw new HTTPError(
          "Invalid CRM User Id",
          401,
          errorCodes.userWithIdNotFound
        );
      }
      return res;
    });
  },
  refreshUserAccessToken: async (token, brand) => {
    let user = await crmRefreshTokenService.validateRefreshToken(token);
    let perms = await CRMPermissionsModel.findOne({
      crmuserId: user._id,
      brand: brand,
    }).populate("role");
    let resultUser = user.toJSON();
    resultUser.permissions = perms.permissions;
    resultUser.suspended = perms.suspended;
    resultUser.role = perms.role;
    resultUser.department = perms.department;
    resultUser.sales_rotation_countries = perms.sales_rotation_countries;
    resultUser.selectedBrand = perms.brand;
    resultUser.enable_country_whitelist = perms.enable_country_whitelist;
    resultUser.whitelist_countries = perms.whitelist_countries;
    return createJWT(resultUser);
  },
  loginAsUser: async (user_id, brand) => {
    let user = await CRMUsersModel.findOne({ _id: user_id });
    let perms = await CRMPermissionsModel.findOne({
      crmuserId: user._id,
      brand: brand,
    }).populate("role");
    if (perms?.role?.name === "admin") {
      throw new HTTPError("User is an admin", 403, {
        message: "User is an admin (cannot login as another admin)",
      });
    }
    let resultUser = user.toJSON();
    resultUser.permissions = perms.permissions;
    resultUser.suspended = perms.suspended;
    resultUser.role = perms.role;
    resultUser.department = perms.department;
    resultUser.sales_rotation_countries = perms.sales_rotation_countries;
    resultUser.selectedBrand = perms.brand;
    resultUser.enable_country_whitelist = perms.enable_country_whitelist;
    resultUser.whitelist_countries = perms.whitelist_countries;
    let jwt_token = createJWT(resultUser);
    let refresh_token =
      await crmRefreshTokenService.findOrCreateRefreshTokenForUser(user_id);
    return { jwt_token, refresh_token, user: resultUser };
  },
  addUserPermissions: async (user_id, permissions, brand) => {
    return CRMPermissionsModel.findOneAndUpdate(
      { crmuserId: user_id, brand },
      { $addToSet: { permissions } },
      { returnDocument: "after" }
    );
  },
  removeUserPermissions: async (user_id, permissions, brand) => {
    return CRMPermissionsModel.findOneAndUpdate(
      { crmuserId: user_id, brand },
      { $pullAll: { permissions } },
      { returnDocument: "after" }
    );
  },
  updateUserWhitelistCountries: async ({
    crmuserId,
    brand,
    enable_country_whitelist,
    whitelist_countries,
  }) => {
    return CRMPermissionsModel.findOneAndUpdate(
      { crmuserId, brand },
      {
        $set: {
          enable_country_whitelist,
          whitelist_countries,
        },
      },
      { returnDocument: "after" }
    );
  },
  deleteCRMUser: async (user_id, brand) => {
    return CRMPermissionsModel.updateOne(
      { crmuserId: user_id, brand },
      { $set: { suspended: true } }
    );
  },
};

export default crmUsersService;
