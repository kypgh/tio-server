/**
 * Flags boolean (0 = disabled, 1 = enabled)
 *
 * authorisation: (and capture) is an integration type which
 * is supported by few processors and actually gives to the merchant
 * (you) an additional step before processing the DEPOSIT to the
 * PSP -> just to review and then to "capture" it , meaning send it to PSP
 *
 * sale: if the gateway (psp) supports deposit (sale) or not
 * payout: if the gateway (psp) supports withdrawal (payout) or not
 * refund: if the gateway (psp) supports refund or not
 * newWindow: if the gateway supports  redirection of the user outside the iframe (cashier)
 * active: if is this psp is enabled or not
 */
export const PAYMENT_GATEWAYS = Object.freeze([
  {
    title: "Adjustment",
    systemName: "PIX-Adjustment",
    paymentProcessor: "adjustment",
    paymentMethod: "other",
    active: 1,
    id: "pixAdjustment",
  },
  {
    title: "PIX Virtual Pay",
    systemName: "VirtualPay",
    paymentProcessor: "VirtualPay",
    paymentMethod: "virtualPay",
    active: 1,
    id: "pixVirtualPay",
  },
  {
    title: "Bitgo",
    systemName: "PrimeIndex-Bitgo",
    paymentProcessor: "bitgo",
    paymentMethod: "crypto",
    active: 1,
    id: "pixBitgo",
  },
  {
    title: "Bitgo",
    systemName: "TioMarkets-Bitgo",
    paymentProcessor: "bitgo",
    paymentMethod: "crypto",
    active: 1,
    id: "tioMarketsBitgo",
  },
  {
    title: "OpenPayd",
    systemName: "PrimeIndex-OpenPayd",
    paymentProcessor: "openpayd",
    paymentMethod: "bank wire",
    active: 1,
    id: "pixOpenPayd",
  },
  {
    title: "OpenPayd",
    systemName: "TioMarkets-OpenPayd",
    paymentProcessor: "openpayd",
    paymentMethod: "bank wire",
    active: 1,
    id: "tioMarketsOpenPayd",
  },
  {
    title: "Adjustment",
    systemName: "TioMarkets-Adjustment",
    paymentProcessor: "adjustment",
    paymentMethod: "other",
    active: 1,
    id: "tioMarketsAdjustment",
  },
  {
    title: "Balance Correction",
    systemName: "TioMarkets-BalanceCorrection",
    paymentProcessor: "balanceCorrection",
    paymentMethod: "other",
    active: 1,
    id: "tioMarketsBalanceCorrection",
  },
  {
    title: "FXPay",
    systemName: "TioMarkets-HelpToPay",
    hash: "Hm-r5YTsR4VpJu5psdcMc7x-trrgLWQq",
    paymentProcessor: "Help2Pay",
    paymentMethod: "fxpay",
    authorization: 0,
    sale: 1,
    payout: 1,
    refund: 0,
    newWindow: 1,
    active: 1,
    created: "Nov 12, 2020 12:14:09 PM",
    id: "tioMarketsHelpToPay",
  },
  {
    title: "Skrill",
    systemName: "TioMarkets-Skrill",
    hash: "f7DrX0gd6Laa04ELaBCye5FQjNaMmxSc",
    paymentProcessor: "Skrill",
    paymentMethod: "skrill",
    authorization: 0,
    sale: 1,
    payout: 1,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 12, 2020 12:14:13 PM",
    id: "tioMarketsSkrill",
  },
  {
    title: "Neteller",
    systemName: "TioMarkets-Neteller",
    hash: "ELCIdqykARJE9vp-Y02xS64wmZ5180Xu",
    paymentProcessor: "Neteller",
    paymentMethod: "altneteller",
    authorization: 0,
    sale: 1,
    payout: 1,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 12, 2020 12:14:14 PM",
    id: "tioMarketsNeteller",
  },
  {
    title: "Wire Transfer",
    systemName: "TIOMARKETS - WIRE TRANSFER ENGLISH",
    hash: "fYBpysYx7O2ubMuwh_4VV-lIEz6mu2b5",
    paymentProcessor: "Custom Processor With Variables",
    paymentMethod: "Default APM",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 16, 2020 7:19:22 AM",
    id: "tiomarketsWireTransferEnglish",
  },
  {
    title: "FasaPay",
    systemName: "TIOMARKETS - FasaPay",
    hash: "Y2R0Zi-qGG0ObDFe6bQ6IiP1FTZlskPQ",
    paymentProcessor: "FasaPay",
    paymentMethod: "fasapay",
    authorization: 0,
    sale: 1,
    payout: 1,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 16, 2020 7:30:08 AM",
    id: "tiomarketsFasaPay",
  },
  {
    title: "INTERAC eTransfer",
    systemName: "TIOMARKET - Gigadat (INTERAC)",
    hash: "I9omVfzqHMnKpI02YaDjJqdSB-GFOy-I",
    paymentProcessor: "Gigadat",
    paymentMethod: "interac",
    authorization: 0,
    sale: 1,
    payout: 1,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 16, 2020 7:35:46 AM",
    id: "tiomarketGigadatInterac",
  },
  {
    title: "EFTpay",
    systemName: "TIOMARKETS - EFTPay",
    hash: "YGMNGXluKf6uFBDXXZqRMyYIvuAE5Jyf",
    paymentProcessor: "PayGuruAPM",
    paymentMethod: "alteasyeft",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 16, 2020 7:43:41 AM",
    id: "tiomarketsEftPay",
  },
  {
    title: "PayTrust88",
    systemName: "TIOMARKETS- PayTrust88",
    hash: "Gpz3hAB4wb9iqUmI-QDG-q54ydR354Bc",
    paymentProcessor: "PayTrust88",
    paymentMethod: "paytrust",
    authorization: 0,
    sale: 1,
    payout: 1,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 16, 2020 8:11:07 AM",
    id: "tiomarketsPayTrust88",
  },
  {
    title: "EMPGenesis - USD - VISA",
    systemName: "TIOMARKETS -EMPGenesis - USD - Visa",
    hash: "LA2dufr3fUDnpO_Te9KedyTLDghIBPcW",
    paymentProcessor: "EMPGenesis",
    paymentMethod: "Credit Card",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 19, 2020 2:04:29 PM",
    id: "tiomarketsEmpGenesisUsdVisa",
  },
  {
    title: "EMPGenesis - EUR - VISA",
    systemName: "TIOMARKET - EMPGenesis - EUR - VISA",
    hash: "UK7t3cTpHAsba7r5HoRnVZTZ9eucQ0rZ",
    paymentProcessor: "EMPGenesis",
    paymentMethod: "Credit Card",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 19, 2020 2:06:22 PM",
    id: "tiomarketEmpGenesisEurVisa",
  },
  {
    title: "EMPGenesis - GBP - VISA",
    systemName: "TioMarkets-  EMPGenesis - GBP - VISA",
    hash: "vUD3pJZOZ1rOT4tsBRhsa8vBEkeYElUc",
    paymentProcessor: "EMPGenesis",
    paymentMethod: "Credit Card",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 19, 2020 2:09:04 PM",
    id: "tioMarketsEmpGenesisGbpVisa",
  },
  {
    title: "تحويل مصرفي",
    systemName: "TioMarketss - Wire Transfer ARABIC",
    hash: "76YtHdtDOFzXfUcKNsxvy1CHak-DBUcd",
    paymentProcessor: "Custom Processor With Variables",
    paymentMethod: "Default APM",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 24, 2020 3:36:23 PM",
    id: "tioMarketssWireTransferArabic",
  },
  {
    title: "Banküberweisung",
    systemName: "Wire Transfer DE - TioMarkets",
    hash: "9husf-Eer9lFSizRAIwLIix7JMdxMvlq",
    paymentProcessor: "Custom Processor With Variables",
    paymentMethod: "Default APM",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 24, 2020 3:50:51 PM",
    id: "wireTransferDeTioMarkets",
  },
  {
    title: "Transferencia bancaria",
    systemName: "Wire Transfer ES - TioMarkets",
    hash: "6vhPEN4gJ8xQLZ1algWGnMKbKSEKJ8w8",
    paymentProcessor: "Custom Processor With Variables",
    paymentMethod: "Default APM",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 24, 2020 3:55:00 PM",
    id: "wireTransferEsTioMarkets",
  },
  {
    title: "Transfer bank",
    systemName: "Wire Transfer ID - TioMarkets",
    hash: "42q8liS-e1ajwZCYqCYNTesq9sa_JPBe",
    paymentProcessor: "Custom Processor With Variables",
    paymentMethod: "Default APM",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 25, 2020 8:11:26 AM",
    id: "wireTransferIdTioMarkets",
  },
  {
    title: "Bonifico bancario",
    systemName: "Wire Transfer IT - TioMarkets",
    hash: "qM2K0_zZDZg5og-QpJ5ALtgKS7QiuX78",
    paymentProcessor: "Custom Processor With Variables",
    paymentMethod: "Default APM",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 25, 2020 8:14:58 AM",
    id: "wireTransferItTioMarkets",
  },
  {
    title: "Przelew bankowy",
    systemName: "Wire Transfer PL - TioMarkets",
    hash: "3zcfmkeR7Bh072gca6TzR2ZV9HZqv1JB",
    paymentProcessor: "Custom Processor With Variables",
    paymentMethod: "Default APM",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 25, 2020 8:17:09 AM",
    id: "wireTransferPlTioMarkets",
  },
  {
    title: "Transferência bancária",
    systemName: "Wire Transfer PT - TioMarkets",
    hash: "wDnLkV4dv4vwQC641axOqQY8obb85cdQ",
    paymentProcessor: "Custom Processor With Variables",
    paymentMethod: "Default APM",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 25, 2020 8:23:46 AM",
    id: "wireTransferPtTioMarkets",
  },
  {
    title: "银行转账",
    systemName: "Wire Transfer- Chinese - TioMarkets",
    hash: "S4aBsF1KqprmdFoYCn4rDKWsPPW4dYUS",
    paymentProcessor: "Custom Processor With Variables",
    paymentMethod: "Default APM",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 25, 2020 8:27:11 AM",
    id: "wireTransferChineseTioMarkets",
  },
  {
    title: "การโอนเงินทางธนาคาร",
    systemName: "Wire Transfer TH - TioMarkets",
    hash: "H7D62fuzNbcNW-P4Vob3eqYEi9rFjgt6",
    paymentProcessor: "Custom Processor With Variables",
    paymentMethod: "Default APM",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 25, 2020 8:32:49 AM",
    id: "wireTransferThTioMarkets",
  },
  {
    title: "WIRE TRANSFER",
    systemName: "Wire Transfer VI - TioMarkets",
    hash: "fFryG3VPeN2D6e9ekIcAvgd_UKjsH2ZR",
    paymentProcessor: "Custom Processor With Variables",
    paymentMethod: "Default APM",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Nov 25, 2020 8:37:53 AM",
    id: "wireTransferViTioMarkets",
  },
  {
    title: "EMPGenesis - CZK - VISA",
    systemName: "TioMarkets-  EMPGenesis - CZK- VISA",
    hash: "is7WcBqZW0pLstRyidmJZfRuz9Wtj5VZ",
    paymentProcessor: "EMPGenesis",
    paymentMethod: "Credit Card",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Jan 29, 2021 8:29:17 AM",
    id: "tioMarketsEmpGenesisCzkVisa",
  },
  {
    title: "EMPGenesis - CZK - MC",
    systemName: "TioMarkets-  EMPGenesis - CZK- MC",
    hash: "_tSzOfd7-_Lzogy6cksVUG53Zrkchcw4",
    paymentProcessor: "EMPGenesis",
    paymentMethod: "Credit Card",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Jan 29, 2021 8:31:13 AM",
    id: "tioMarketsEmpGenesisCzkMc",
  },
  {
    title: "Fairpay Online Transferencia Local",
    systemName: "Fairpay - TioMarkets",
    hash: "IOjp_GV80oOiqwJrnkIOZPZbS3Fflj_z",
    paymentProcessor: "Fairpay",
    paymentMethod: "ONLINE",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Apr 8, 2021 7:01:22 AM",
    id: "fairpayTioMarketsOnline",
  },
  {
    title: "Fairpay Pago Cash",
    systemName: "Fairpay - TioMarkets",
    hash: "HuUAcWr12Rkmj8XVnJOHigjAbLzFv0nY",
    paymentProcessor: "Fairpay",
    paymentMethod: "CASH",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Apr 12, 2021 8:20:46 AM",
    id: "fairpayTioMarketsCash",
  },
  {
    title: "EMPGenesis",
    systemName: "EMPGenesis - Tradextraders - USD",
    hash: "Wbi5UknS7wpiV4IKWmgZ9pE_YzlmZwMo",
    paymentProcessor: "EMPGenesis",
    paymentMethod: "Credit Card",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Apr 29, 2021 3:22:06 PM",
    id: "empGenesisTradextradersUsd",
  },
  {
    title: "EMPGenesis",
    systemName: "EMPGenesis - Tradextraders - EUR",
    hash: "yXza-gTuIHCiPON79iYM0tIK_C-IMLnx",
    paymentProcessor: "EMPGenesis",
    paymentMethod: "Credit Card",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Apr 29, 2021 3:23:44 PM",
    id: "empGenesisTradextradersEur",
  },
  {
    title: "QubePay",
    systemName: "QubePay - TioMarkets-ZAR",
    hash: "WffE_Xcmov2gYXFV0c0GAk3sYZwf-cqc",
    paymentProcessor: "QubePay",
    paymentMethod: "Credit Card",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Aug 10, 2021 10:15:32 AM",
    id: "qubePayTioMarketsZar",
  },
  {
    title: "QubePay",
    systemName: "QubePay - Tio Markets-CZK",
    hash: "sHfAFy0tT9N1QWy079AWn3asLxUaa2Ss",
    paymentProcessor: "QubePay",
    paymentMethod: "Credit Card",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Aug 24, 2021 12:25:27 PM",
    id: "qubePayTioMarketsCzk",
  },
  {
    title: "QubePay",
    systemName: "QubePay - Tio Markets-EUR",
    hash: "2KvBa9vEyJvM0NRa00UqGUewifPkNalT",
    paymentProcessor: "QubePay",
    paymentMethod: "Credit Card",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Aug 24, 2021 12:26:17 PM",
    id: "qubePayTioMarketsEur",
  },
  {
    title: "QubePay",
    systemName: "QubePay - Tio Markets-GBP",
    hash: "5tE0GfMAizgxEwI9y9mFYQ5wIMluDZvF",
    paymentProcessor: "QubePay",
    paymentMethod: "Credit Card",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 1,
    active: 1,
    created: "Aug 24, 2021 12:26:53 PM",
    id: "qubePayTioMarketsGbp",
  },
  {
    title: "QubePay",
    systemName: "QubePay - Tio Markets-USD",
    hash: "xthH1qhX3lohzZf1g73znFv_ItEwCNr3",
    paymentProcessor: "QubePay",
    paymentMethod: "Credit Card",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Aug 24, 2021 12:27:31 PM",
    id: "qubePayTioMarketsUsd",
  },
  {
    title: "PayRetailers",
    systemName: "PayRetailers - Tiomarkets - LATAM",
    hash: "D5auamdqeyICiChcUK59SqC1uAuFth8s",
    paymentProcessor: "PayRetailers",
    paymentMethod: "payrtransfer",
    authorization: 0,
    sale: 1,
    payout: 0,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Jan 27, 2022 7:26:20 AM",
    id: "payRetailersTiomarketsLatam",
  },
  {
    title: "Wire Transfer",
    systemName: "TIOMARKETS - WIRE TRANSFER NL",
    hash: "btpn998kzfIVz_fp3LRxIusqAnsL4JtL",
    paymentProcessor: "Custom Processor With Variables",
    paymentMethod: "Default APM",
    authorization: 0,
    sale: 1,
    payout: 1,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Jan 27, 2022 9:17:57 AM",
    id: "tiomarketsWireTransferNl",
  },
  {
    title: "PayGate10",
    systemName: "PayGate10 - RupeePayments - TioMarkets",
    hash: "2ad59237db6b7c091d95d95c6ed3f7bf",
    paymentProcessor: "PayGate10",
    paymentMethod: "rupeepayments",
    authorization: 0,
    sale: 1,
    payout: 1,
    refund: 0,
    newWindow: 1,
    active: 1,
    created: "May 9, 2022 5:34:50 PM",
    id: "payGate10RupeePaymentsTioMarkets",
  },
  {
    title: "SEPA Instant Credit Transfer",
    systemName: "SEPA - NEW - Tiomarkets",
    hash: "d1864c18e31291095d7532ba623c61b3",
    paymentProcessor: "Custom Processor With Variables",
    paymentMethod: "Default APM",
    authorization: 0,
    sale: 1,
    payout: 1,
    refund: 0,
    newWindow: 0,
    active: 1,
    created: "Sep 30, 2022 12:51:01 PM",
    id: "sepaNewTiomarkets",
  },
  {
    title: "Gigadat",
    systemName: "Gigadat -test",
    hash: "a78f1dfb91c11c27591f2b82f4cd8649",
    paymentProcessor: "Gigadat",
    paymentMethod: "interac",
    authorization: 0,
    sale: 1,
    payout: 1,
    refund: 0,
    newWindow: 1,
    active: 1,
    created: "Mar 29, 2023 7:10:11 AM",
    id: "gigadatTest",
  },
]);
