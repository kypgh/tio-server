import randomToken from "random-token";
import { USER_TOKEN_LENGTH } from "../config/enums";
import errorCodes from "../config/errorCodes";
import UserTokenModel from "../models/UserToken.model";
import HTTPError from "../utils/HTTPError";

const userTokenService = {
  createToken: async (user_id) => {
    let token = randomToken(USER_TOKEN_LENGTH);
    await UserTokenModel.updateOne(
      { user: user_id },
      {
        token,
        expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 4), // 30 min
      },
      { upsert: true }
    );
    return token;
  },
  verifyToken: async (token) => {
    let user_token = await UserTokenModel.findOne({ token }).populate("user");
    if (!user_token) {
      throw new HTTPError("Invalid token", 401, errorCodes.invalidUserToken);
    }
    if (user_token.expiresIn < new Date()) {
      await user_token.remove();
      throw new HTTPError("Token expired", 401, errorCodes.userTokenExpired);
    }
    return user_token.user;
  },
};

export default userTokenService;
