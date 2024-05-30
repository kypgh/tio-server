import { RequestHandler } from "express";
import Joi from "joi";
import { isMembersAreaUser } from "../../../../../middleware/membersArea.middleware";
import { hasAccessToAccount } from "../../../../../middleware/hasAccessToAccount";
import { TIO_BRANDS } from "../../../../../config/enums";
import userTransactionsService from "../../../../../services/userTransactions.service";
import VirtualPayService from "../../../../../services/virtualPay.service";

const depositToAccountSchema = Joi.object({
  amount: Joi.number().min(10).cast("string").required(),
});

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { value, error } = depositToAccountSchema.validate(req.body);
  if (error) {
    res.status(400).json(error);
    return;
  }
  if (req.user.brand !== TIO_BRANDS.PIX) {
    res.status(409).json({ message: "Virtual Pay is not supported" });
    return;
  }

  const transaction =
    await userTransactionsService.createPendingVirtualPayDeposit({
      account: req.userAccount,
      amount: value.amount,
    });
  const vp_Res = await VirtualPayService.initiateTransactionPIX({
    transactionId: String(transaction._id),
    accountId: req.userAccount._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    amount: value.amount,
    currency: req.userAccount.currency,
    description: `Account - ${req.userAccount.login_id}`,
    postalCode: req.user.postcode,
    email: req.user.email,
    city: req.user.city,
    country: req.user.country,
  });
  // for (const [key, value] of Object.entries(vp_Res.body.headers.toJSON())) {
  //   res.setHeader(key, value);
  //   console.log(key, value);
  // }
  // res.status(307).location(vp_Res.url).send(vp_Res.body.data);
  res.status(200).json(vp_Res);
};

export default {
  middleware: {
    all: [isMembersAreaUser, hasAccessToAccount],
  },
};
