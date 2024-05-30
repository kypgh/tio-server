import { RequestHandler } from "express";
import Joi from "joi";
import universalTokensService from "../../../../services/universalTokens.service";
import usersService from "../../../../services/users.service";
import { TIO_BRANDS } from "../../../../config/enums";
import userAccountsService from "../../../../services/userAccounts.service";
import utilFunctions from "../../../../utils/util.functions";

const verifyEmailSchema = Joi.object({
  verifyEmailToken: Joi.string().required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = verifyEmailSchema.validate(req.body);
  if (error) {
    res.status(400).json(error);
    return;
  }
  const { isValid, user: _user } =
    await universalTokensService.validateVerifyEmailToken(
      value.verifyEmailToken
    );
  if (!isValid) {
    res.status(400).json({ message: "Invalid token" });
    return;
  }
  let user = await usersService.setEmailVerified(_user._id);
  if (user.brand === TIO_BRANDS.PIX) {
    if (!user.ctrader_id) {
      user = await usersService.createCtraderUserForExistingUser(user);
    }
    await userAccountsService.createCtraderAccount({
      user,
      currency: "EUR",
      account_type: "standard",
      environment_type: "live",
      leverage: 100,
      first_account: true,
    });
  }

  const normalizedUser = utilFunctions.decimal2JSONReturn(user.toJSON());
  const jwt = await universalTokensService.createJWT(normalizedUser);
  const accessToken = await universalTokensService.createAccessToken(user);
  res.status(200).json({ user: normalizedUser, jwt, accessToken });
};
