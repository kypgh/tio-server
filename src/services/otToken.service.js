import randomToken from "random-token";
import { OT_TOKEN_LENGTH } from "../config/enums";
import errorCodes from "../config/errorCodes";
import OTtokenModel from "../models/OTtoken.model";
import HTTPError from "../utils/HTTPError";

const otTokenService = {
  createOT: async (user_id, keep_logged_in = false) => {
    let unique_addition = new Buffer.from(user_id);
    let token =
      randomToken(OT_TOKEN_LENGTH) + unique_addition.toString("base64");
    await OTtokenModel.updateOne(
      { user: user_id },
      {
        $set: {
          token,
          keep_logged_in,
          expiresIn: new Date(Date.now() + 1000 * 60),
        },
      },
      { upsert: true }
    );
    return token;
  },
  validateOTtoken: async (token) => {
    let ot_doc = await OTtokenModel.findOne({ token }).populate("user");
    if (!ot_doc) {
      throw new HTTPError(
        "OT token not found",
        403,
        errorCodes.otTokenNotFound
      );
    }
    if (ot_doc.expiresIn < new Date()) {
      throw new HTTPError("OT token expired", 403, errorCodes.otTokenExpired);
    }
    if (ot_doc?.user?.isSuspended) {
      throw new HTTPError("User is suspended", 401, errorCodes.userSuspended);
    }
    let ctrader_id = ot_doc?.user?.ctrader_id;
    let user_id = ot_doc?.user?.id;
    let keep_logged_in = ot_doc?.keep_logged_in;
    await ot_doc.remove();
    return { ctrader_id, keep_logged_in, user_id };
  },
};

export default otTokenService;
