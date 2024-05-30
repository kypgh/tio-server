import randomToken from "random-token";
import errorCodes from "../config/errorCodes";
import UserRefreshTokenModel from "../models/UserRefreshToken.model";
import HTTPError from "../utils/HTTPError";
import jwt from "jsonwebtoken";
import { USER_REFRESH_TOKEN_LENGTH } from "../config/enums";
import { JWT_SECRET } from "../config/envs";

const userRefreshTokenService = {
  createToken: async (user_id, retries = 0) => {
    let token = randomToken(USER_REFRESH_TOKEN_LENGTH);
    if (retries > 3) {
      throw new HTTPError("Unable to generate token", 500, {
        message: "Unable to generate token",
      });
    }
    const existingToken = await UserRefreshTokenModel.findOne({ token });
    if (existingToken) {
      return userRefreshTokenService.createToken(user_id, retries + 1);
    }
    await UserRefreshTokenModel.updateOne(
      { user: user_id },
      {
        token,
        expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 30), // 30 days
      },
      { upsert: true }
    );
    return token;
  },
  verifyToken: async (token) => {
    await UserRefreshTokenModel.deleteMany({ expiresIn: { $lt: new Date() } });
    let user_token = await UserRefreshTokenModel.findOne({ token }).populate(
      "user"
    );
    if (!user_token) {
      throw new HTTPError("Invalid token", 401, errorCodes.invalidUserToken);
    }
    if (user_token.expiresIn < new Date()) {
      await user_token.remove();
      throw new HTTPError("Token expired", 401, errorCodes.userTokenExpired);
    }
    return user_token.user;
  },
  createJWT: (user) => {
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
    return token;
  },
  validateJWT: (token) => {
    try {
      const user = jwt.verify(token, JWT_SECRET);
      return user;
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new HTTPError("Token expired", 401, errorCodes.userTokenExpired);
      }
    }
  },
};

export default userRefreshTokenService;
