import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envs";
import UniversalTokenModel, {
  UNIVERSAL_TOKEN_LENGTH,
  UNIVERSAL_TOKEN_TYPE,
} from "../models/UniversalToken.model";
import randomToken from "random-token";
import HTTPError from "../utils/HTTPError";
import errorCodes from "../config/errorCodes";

const VERIFY_EMAIL_TOKEN_DURATION = 1000 * 60 * 60 * 24; // 24 hours as milliseconds

const universalTokensService = {
  createJWT: async (user) => {
    delete user.password;
    delete user.ctrader_password;
    delete user.identificationNumber;
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "10m" });
    return token;
  },
  verifyJWT: async (token) => {
    try {
      const user = jwt.verify(token, JWT_SECRET);
      return { isValid: true, user };
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return { isValid: false, user: null };
      }
      return { isValid: false, user: null };
    }
  },
  createAccessToken: async (user, retry = 0) => {
    if (retry > 3) {
      throw new Error("Token hit too many times");
    }
    let token = randomToken(UNIVERSAL_TOKEN_LENGTH);
    if (
      await UniversalTokenModel.findOne({
        token,
        token_type: UNIVERSAL_TOKEN_TYPE.accessToken,
      })
    ) {
      return createAccessToken(user_id, retry + 1); // recursion
    }
    let accessToken = await UniversalTokenModel.create({
      user: user.id,
      token,
      token_type: UNIVERSAL_TOKEN_TYPE.accessToken,
      expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    });
    return accessToken.token;
  },
  removeAccessToken: async (token) => {
    return UniversalTokenModel.deleteOne({
      token,
      token_type: UNIVERSAL_TOKEN_TYPE.accessToken,
    });
  },
  verifyAccessToken: async (token) => {
    let ac_doc = await UniversalTokenModel.findOne({
      token,
      token_type: UNIVERSAL_TOKEN_TYPE.accessToken,
    }).populate("user");
    if (!ac_doc) {
      return { isValid: false, user: null };
    }
    if (ac_doc.expiresIn < new Date()) {
      await ac_doc.remove();
      return { isValid: false, user: null };
    }
    return { isValid: true, user: ac_doc.user };
  },
  createResetPasswordToken: async (user_id, retry = 0) => {
    if (retry > 3) {
      throw new HTTPError("Token hit too many times", 500, {
        ...errorCodes.serverError,
      });
    }
    if (
      await UniversalTokenModel.findOne({
        user: user_id,
        token_type: UNIVERSAL_TOKEN_TYPE.resetPasswordToken,
        createdAt: { $gte: new Date(Date.now() - 1000 * 60) },
      })
    ) {
      throw new HTTPError(
        "Too many retries",
        425,
        errorCodes.forgotPasswordTooManyRetries
      );
    }
    let token = randomToken(6).toUpperCase();
    if (
      await UniversalTokenModel.findOne({
        token,
        token_type: UNIVERSAL_TOKEN_TYPE.resetPasswordToken,
      })
    ) {
      return createAccessToken(user_id, retry + 1); // recursion
    }
    let resetPasswordToken = await UniversalTokenModel.create({
      user: user_id,
      token,
      token_type: UNIVERSAL_TOKEN_TYPE.resetPasswordToken,
      expiresIn: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    });
    return resetPasswordToken.token;
  },
  validateResetPasswordToken: async (token) => {
    let ac_doc = await UniversalTokenModel.findOne({
      token,
      token_type: UNIVERSAL_TOKEN_TYPE.resetPasswordToken,
    }).populate("user");
    if (!ac_doc) {
      return { isValid: false, user: null };
    }
    if (ac_doc.expiresIn < new Date()) {
      await ac_doc.remove();
      return { isValid: false, user: null };
    }
    let user = ac_doc.user;
    await ac_doc.remove();
    return { isValid: true, user };
  },
  createVerifyEmailToken: async (user_id, retry = 0) => {
    if (retry > 3) {
      throw new HTTPError("Token hit too many times", 500, {
        ...errorCodes.serverError,
      });
    }
    if (
      await UniversalTokenModel.findOne({
        user: user_id,
        token_type: UNIVERSAL_TOKEN_TYPE.verifyEmailToken,
        createdAt: { $gte: new Date(Date.now() - 1000 * 60) },
      })
    ) {
      throw new HTTPError(
        "Too many retries",
        425,
        errorCodes.forgotPasswordTooManyRetries
      );
    }
    let token = randomToken(12);
    if (
      await UniversalTokenModel.findOne({
        token,
        token_type: UNIVERSAL_TOKEN_TYPE.verifyEmailToken,
      })
    ) {
      return createAccessToken(user_id, retry + 1); // recursion
    }
    let verifyEmailToken = await UniversalTokenModel.findOneAndUpdate(
      {
        user: user_id,
        token_type: UNIVERSAL_TOKEN_TYPE.verifyEmailToken,
      },
      {
        token,
        expiresIn: new Date(Date.now() + VERIFY_EMAIL_TOKEN_DURATION), // 1 hour
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );
    return verifyEmailToken.token;
  },
  validateVerifyEmailToken: async (token) => {
    let ac_doc = await UniversalTokenModel.findOne({
      token,
      token_type: UNIVERSAL_TOKEN_TYPE.verifyEmailToken,
    }).populate("user");
    if (!ac_doc) {
      return { isValid: false, user: null };
    }
    if (ac_doc.expiresIn < new Date()) {
      await ac_doc.remove();
      return { isValid: false, user: null };
    }
    let user = ac_doc.user;
    await ac_doc.remove();
    return { isValid: true, user };
  },
};

export default universalTokensService;
