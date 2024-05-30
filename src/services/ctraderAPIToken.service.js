import randomToken from "random-token";
import { CTRADER_ALLOWED_PASSWORD } from "../config/envs";
import CTraderAPITokenModel from "../models/CTraderAPIToken.model";
import HTTPError from "../utils/HTTPError";

const ctraderAPITokenService = {
  createToken: async (password) => {
    if (password !== CTRADER_ALLOWED_PASSWORD)
      throw new HTTPError("Invalid password", 401, {
        message: "Invalid password",
      });
    const token = randomToken(64);
    await CTraderAPITokenModel.updateOne(
      { name: "ctrader" },
      { $set: { token } },
      { upsert: true }
    );
    return token;
  },
  validateToken: async (token) => {
    const tokenDoc = await CTraderAPITokenModel.findOne({ token });
    return !!tokenDoc;
  },
};

export default ctraderAPITokenService;
