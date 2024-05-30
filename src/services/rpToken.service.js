import randomToken from "random-token";
import errorCodes from "../config/errorCodes";
import RPTokenModel from "../models/RPToken.model";
import HTTPError from "../utils/HTTPError";

const rpTokenService = {
  createRPToken: async (user_id, retry = 0) => {
    if (retry > 3) {
      throw new HTTPError(
        "Token hit too many times",
        500,
        errorCodes.serverError
      );
    }

    var rt = randomToken.gen("0123456789");
    let token = rt(6); //create random token 6 numbers
    if (await RPTokenModel.findOne({ token })) {
      return createRPToken(user_id, retry + 1); // recursion
    }
    const rpToken = await RPTokenModel.findOne({ user: user_id });
    const expiresIn = new Date(Date.now() + 1000 * 60 * 10);
    if (!rpToken) {
      await RPTokenModel.create({
        user: user_id,
        token,
        expiresIn,
      });
    } else {
      // rate limiting
      if (rpToken.updatedAt > new Date(Date.now() - 1000 * 60 * 2)) {
        throw new HTTPError("Too many retries", 429, {
          ...errorCodes.forgotPasswordTooManyRetries,
          time: new Date(rpToken.updatedAt + 1000 * 60 * 2),
        });
      }
      rpToken.token = token;
      rpToken.expiresIn = expiresIn;
      await rpToken.save();
    }
    return token;
  },
  validateRPToken: async (token) => {
    let rpToken_doc = await RPTokenModel.findOne({ token });
    if (!rpToken_doc) {
      throw new HTTPError(
        "Reset password token not found",
        404,
        errorCodes.resetPasswordTokenNotFound
      );
    }
    if (rpToken_doc.expiresIn < new Date()) {
      throw new HTTPError(
        "Reset password token expired",
        401,
        errorCodes.resetPasswordTokenExpired
      );
    }
    // expiry check
    let user_id = rpToken_doc.user;
    await rpToken_doc.remove();
    return user_id;
  },
};

export default rpTokenService;
