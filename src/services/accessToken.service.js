import randomToken from "random-token";
import { ACCESS_TOKEN_LENGTH } from "../config/enums";
import errorCodes from "../config/errorCodes";
import AccessTokenModel from "../models/AccessToken.model";
import HTTPError from "../utils/HTTPError";

const accessTokenService = {
  createAccessToken: async (user_id, retry = 0) => {
    if (retry > 3) {
      throw new Error("Token hit too many times");
    }
    let unique_addition = new Buffer.from(user_id);
    let random_array = Array.from(
      randomToken(ACCESS_TOKEN_LENGTH) + unique_addition.toString("base64")
    ); // join strings and convert to array
    let token = random_array.sort(() => Math.random() - 0.5).join(""); // shuffle
    if (await AccessTokenModel.findOne({ token })) {
      return createAccessToken(user_id, retry + 1); // recursion
    }
    let accessToken = await AccessTokenModel.create({
      user: user_id,
      token,
    });
    return token;
  },
  validateAccessToken: async (token) => {
    let ac_doc = await AccessTokenModel.findOne({ token }).populate("user");
    if (!ac_doc) {
      throw new HTTPError(
        "Access token not found",
        401,
        errorCodes.accessTokenNotFound
      );
    }
    let ctrader_id = ac_doc?.user?.ctrader_id;
    if (ac_doc?.user?.isSuspended) {
      throw new HTTPError("User suspended", 401, errorCodes.userSuspended);
    }
    return { ctrader_id, user: ac_doc.user };
  },
};

export default accessTokenService;
