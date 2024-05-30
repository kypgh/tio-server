import { RequestHandler } from "express";
import { isMembersAreaUser } from "../../../../../middleware/membersArea.middleware";
import { hasAccessToAccount } from "../../../../../middleware/hasAccessToAccount";
import { CRYPTO_CURRENCIES } from "../../../../../config/currencies";
import bitgoService from "../../../../../services/bitgo.service";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  if (!CRYPTO_CURRENCIES.includes(req.userAccount.currency)) {
    res.status(409).json({ message: "This account is not a crypto account" });
    return;
  }

  if (req.userAccount.provider === "innovoult") {
    res
      .status(409)
      .json({ message: "This account can only be funded by Innovoult" });
    return;
  }

  let bitgoAddress = await bitgoService.getAccountAddress(req.userAccount);
  if (!bitgoAddress) {
    bitgoAddress = await bitgoService.createAddressForAccount(
      req.userAccount,
      req.user.brand
    );
  }

  const details = await bitgoService.getAddressDetails(bitgoAddress);

  res.status(200).json({ address: details.address, coin: details.coin });
};

export default {
  middleware: {
    all: [isMembersAreaUser, hasAccessToAccount],
  },
};
