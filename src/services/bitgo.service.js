import axios from "axios";
import {
  BITGO_API_KEY,
  BITGO_API_PROXY_URL,
  BITGO_PIX_BTC_WALLET_ID,
  BITGO_PIX_ETH_WALLET_ID,
  BITGO_TIO_BTC_WALLET_ID,
  BITGO_TIO_ETH_WALLET_ID,
  TIO_PROXY_API_KEY,
} from "../config/envs";
import BitgoWalletAddressModel from "../models/BitgoWalletAddress.model";
import { TIO_BRANDS } from "../config/enums";

const bitgoAxios = axios.create({
  baseURL: BITGO_API_PROXY_URL,
  headers: {
    authorization: `Bearer ${BITGO_API_KEY}`,
    "x-api-key": TIO_PROXY_API_KEY,
  },
});

const currencyToCoinMap = {
  BTC: "BTC",
  ETH: "ETH",
  TIO: "TIOx",
  USDT: "USDT",
  UST: "UST",
  BUSD: "BUSD",
};
const walletForCurrencyMap = {
  [TIO_BRANDS.PIX]: {
    BTC: { walletCoin: "btc", walletId: BITGO_PIX_BTC_WALLET_ID },
    ETH: { walletCoin: "eth", walletId: BITGO_PIX_ETH_WALLET_ID },
    TIO: { walletCoin: "eth", walletId: BITGO_PIX_ETH_WALLET_ID },
    USDT: { walletCoin: "eth", walletId: BITGO_PIX_ETH_WALLET_ID },
    UST: { walletCoin: "eth", walletId: BITGO_PIX_ETH_WALLET_ID },
    BUSD: { walletCoin: "eth", walletId: BITGO_PIX_ETH_WALLET_ID },
  },
  [TIO_BRANDS.TIO]: {
    BTC: { walletCoin: "btc", walletId: BITGO_TIO_BTC_WALLET_ID },
    ETH: { walletCoin: "eth", walletId: BITGO_TIO_ETH_WALLET_ID },
    TIO: { walletCoin: "eth", walletId: BITGO_TIO_ETH_WALLET_ID },
    USDT: { walletCoin: "eth", walletId: BITGO_TIO_ETH_WALLET_ID },
    UST: { walletCoin: "eth", walletId: BITGO_TIO_ETH_WALLET_ID },
    BUSD: { walletCoin: "eth", walletId: BITGO_TIO_ETH_WALLET_ID },
  },
};

const bitgoService = {
  getAccountFromAddressId: async (addressId) => {
    return BitgoWalletAddressModel.findOne({
      addressId: addressId,
    })
      .populate("accountId")
      .then((e) => e?.accountId);
  },
  getAccountAddress: async (account) => {
    return BitgoWalletAddressModel.findOne({
      accountId: account._id,
    });
  },
  createAddressForAccount: async (account, brand) => {
    const { walletCoin, walletId } =
      walletForCurrencyMap[brand][account.currency];
    const coin = currencyToCoinMap[account.currency];
    let bitgoAddress = await bitgoAxios
      .post(`/${walletCoin}/wallet/${walletId}/address`, {
        label: `${account.first_name ?? ""} ${account.last_name ?? ""} - ${
          account.login_id
        } (${account.platform})`,
        onToken: coin,
        forwarderVersion: 1,
      })
      .then((res) => res.data);
    return BitgoWalletAddressModel.create({
      accountId: account._id,
      walletId: bitgoAddress.wallet,
      addressId: bitgoAddress.id,
      coin: bitgoAddress.coin,
    });
  },
  getAddressDetails: async ({ coin, walletId, addressId }) => {
    return bitgoAxios
      .get(`/${coin}/wallet/${walletId}/address/${addressId}`)
      .then((res) => res.data);
  },
  getTransfer: async ({ coin, walletId, transferId }) =>
    bitgoAxios
      .get(`/${coin}/wallet/${walletId}/transfer/${transferId}`)
      .then((res) => res.data),
};

export default bitgoService;
