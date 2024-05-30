import { RequestHandler } from "express";
import Joi from "joi";
import bitgoService from "../../../../services/bitgo.service";
import userTransactionsService from "../../../../services/userTransactions.service";
import Currency from "../../../../utils/Currency";
import userAccountsService from "../../../../services/userAccounts.service";
import userRequestsService from "../../../../services/userRequests.service";
import { BITGO_CURRENCY_DIGITS } from "../../../../config/currencies";

const bitgoWebhookSchema = Joi.object({
  transfer: Joi.string().required(),
  wallet: Joi.string().required(),
  coin: Joi.string().required(),
  type: Joi.string().required(),
  state: Joi.string().required(),
}).unknown(true);

/**
 *
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  const { error, value } = bitgoWebhookSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: "Unexpected body" });
    return;
  }
  const transferDetails = await bitgoService.getTransfer({
    coin: value.coin,
    walletId: value.wallet,
    transferId: value.transfer,
  });
  if (
    transferDetails.type === "receive" &&
    transferDetails.state === "confirmed"
  ) {
    let receivingAddress = transferDetails.entries.find((e) => e.value > 0);
    if (!receivingAddress) {
      console.error(
        `[BITGO WEBHOOK]: Receiving address not found coin ${transferDetails.coin}, wallet ${transferDetails.wallet}, transferId: ${transferDetails.id}`
      );
      return res.status(200).json({ message: "Success" });
    }
    const addressDetails = await bitgoService.getAddressDetails({
      coin: value.coin,
      walletId: value.wallet,
      addressId: receivingAddress.address,
    });
    const account = await bitgoService.getAccountFromAddressId(
      addressDetails.id
    );
    if (!account) {
      console.error(
        `[BITGO WEBHOOK]: Account not found coin ${transferDetails.coin}, wallet ${transferDetails.wallet}, address ${addressDetails.id}, transferId: ${transferDetails.id}`
      );
      return res.status(200).json({ message: "Success" });
    }

    let amount = Currency.fromCustom({
      amount: transferDetails.valueString,
      currency: account.currency,
      digits: BITGO_CURRENCY_DIGITS[account.currency] || 18,
    });
    // Automatic condition is to create a deposit request instead of a deposit transaction
    // when the amount is too high
    const automaticCondition = (
      await amount.convertToCurrency("USD")
    ).isLessThanOrEqualTo(1000, 0);
    const transaction = await userTransactionsService.depositBitgoCrypto({
      account: account,
      amount: amount.getAmount(),
      pending: !automaticCondition,
      bitgoCoin: transferDetails.coin,
      bitgoWalletId: transferDetails.wallet,
      bitgoTransferId: transferDetails.id,
      bitgoAddressId: addressDetails.id,
    });
    if (automaticCondition) {
      await userAccountsService.depositToAccount(account._id, transaction);
    } else {
      await userRequestsService.DEPOSIT_FUNDS.request(
        account.user._id ?? account.user,
        transaction
      );
    }
  }
  res.status(200).json({ message: "Success" });
};
