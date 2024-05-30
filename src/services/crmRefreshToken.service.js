import randomToken from "random-token";
import errorCodes from "../config/errorCodes";
import CRMRefreshTokenModel from "../models/CRMRefreshToken.model";
import HTTPError from "../utils/HTTPError";

const crmRefreshTokenService = {
  createRefreshToken: async (user_id, retry = 0) => {
    const token = randomToken(64);
    if (retry < 3) {
      const existingToken = await CRMRefreshTokenModel.findOne({ token });
      if (existingToken) {
        return createRefreshToken(user_id, retry + 1);
      }
    } else {
      throw new HTTPError(
        "Could not create refresh token, too mnay retries",
        500,
        errorCodes.serverError
      );
    }
    await CRMRefreshTokenModel.updateOne(
      { user: user_id },
      {
        user: user_id,
        token,
      },
      { upsert: true }
    );
    return token;
  },
  deleteRefreshToken: async (user_id) => {
    return CRMRefreshTokenModel.deleteOne({ user: user_id });
  },
  validateRefreshToken: async (token) => {
    let refresh_token = await CRMRefreshTokenModel.findOne({ token }).populate(
      "user"
    );
    if (!refresh_token) {
      throw new HTTPError(
        "Invalid refresh token",
        401,
        errorCodes.invalidRefreshToken
      );
    }
    if (
      new Date(refresh_token.updatedAt) <
      new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
    ) {
      throw new HTTPError(
        "Refresh token expired",
        401,
        errorCodes.expiredRefreshToken
      );
    }
    if (refresh_token.user.suspended) {
      throw new HTTPError("User is suspended", 403, errorCodes.userSuspended);
    }
    return refresh_token.user;
  },
  findOrCreateRefreshTokenForUser: async (userId) => {
    let refresh_token = await CRMRefreshTokenModel.findOne({
      user: userId,
    }).populate("user");
    if (!refresh_token) {
      return crmRefreshTokenService.createRefreshToken(userId);
    }
    if (
      new Date(refresh_token.updatedAt) <
      new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
    ) {
      return crmRefreshTokenService.createRefreshToken(userId);
    }
    return refresh_token.token;
  },
};

export default crmRefreshTokenService;
