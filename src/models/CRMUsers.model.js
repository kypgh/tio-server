import mongoose from "mongoose";
import bcrypt from "bcrypt";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import "./CRMUserRoles.model";
const { Schema } = mongoose;

const CRMUsersSchema = new Schema(
  {
    email: String,
    password: String,
    first_name: String,
    last_name: String,
    brands: { type: [String], default: () => [] },
    last_login: { type: Date, default: Date.now },
    metadata: Object,
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.ctrader_password;
      },
    },
  }
);

// CRMUsersSchema.index({ email: 1 }, { unique: true });
CRMUsersSchema.plugin(paginate);
CRMUsersSchema.plugin(aggregatePaginate);

CRMUsersSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model("CRMUsers", CRMUsersSchema);

/**
 *
 * @param {any} user CRMUser document
 * @param {Strin[]} permissions
 * @returns {boolean}
 *
 * Check if user any one of the permissions specified
 */
export const userPermissionsContainAny = (
  userPermissions,
  rolePermissions,
  permissions
) => {
  const combinedPermissions = [
    ...(userPermissions ?? []),
    ...(rolePermissions ?? []),
  ];
  return permissions.some((permission) =>
    combinedPermissions.includes(permission)
  );
};
