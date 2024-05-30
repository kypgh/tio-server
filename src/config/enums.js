export const OT_TOKEN_LENGTH = 16;
export const USER_TOKEN_LENGTH = 64;
export const USER_REFRESH_TOKEN_LENGTH = 64;
export const ACCESS_TOKEN_LENGTH = 30; // actual length is longer due to unique additional characters
export const RP_TOKEN_LENGTH = 30;
export const BCRYPT_SALT_ROUNDS = 10;
export const MAX_NUMBER_OF_LIVE_ACCOUNTS = 8;
export const MAX_NUMBER_OF_DEMO_ACCOUNTS = 5;
export const CTRADER_MAX_LIVE_ACCOUNTS = 8;
export const CTRADER_MAX_DEMO_ACCOUNTS = 5;
export const MT5_MAX_LIVE_ACCOUNTS = 10;
export const MT5_MAX_DEMO_ACCOUNTS = 5;
export const MT4_MAX_LIVE_ACCOUNTS = 10;
export const MT4_MAX_DEMO_ACCOUNTS = 5;
export const RESET_PASSWORD_URL = "https://examplectrader.com/reset-password";
export const USER_EPC_STATUS = Object.freeze({
  notApplied: 0,
  pending: 1,
  approved: 2,
  rejected: 3,
});
export const SUPPORTED_LANGUAGES = Object.freeze({
  en: "en",
  es: "es",
  ru: "ru",
  pt: "pt",
});

export const KYC_ALLOWED_DOCUMENT_MIMETYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
];

export const TIO_ENTITIES = Object.freeze({
  TIOUK: "TIOUK",
  TIOSV: "TIOSV",
  TIOEU: "TIOEU",
  TIOCO: "TIOCO",
  TIOSE: "TIOSE",
});
export const TIO_BRANDS = Object.freeze({
  TIO: "TIO",
  PIX: "PIX",
});

export const TIO_PLATFORMS = Object.freeze({
  mt5: "mt5",
  mt4: "mt4",
  ctrader: "ctrader",
});

export const TRADE_SERVERS = Object.freeze({
  TIO_MT5_LIVE_1: "TIO_MT5_LIVE_1",
  TIO_MT5_DEMO_1: "TIO_MT5_DEMO_1",
  TIO_MT4_LIVE_1: "TIO_MT4_LIVE_1",
  TIO_MT4_DEMO_1: "TIO_MT4_DEMO_1",
  TIO_CTRADER_LIVE_1: "TIO_CTRADER_LIVE_1",
  TIO_CTRADER_DEMO_1: "TIO_CTRADER_DEMO_1",
  PIX_CTRADER_LIVE_1: "PIX_CTRADER_LIVE_1",
  PIX_CTRADER_DEMO_1: "PIX_CTRADER_DEMO_1",
});

const TRADE_SERVERS_REAL = Object.freeze({
  TIO_MT5_LIVE_1: "TIOMarkets-Live1",
  TIO_MT5_DEMO_1: "TIOMarkets-Demo1",
  TIO_MT4_LIVE_1: "TIOMarkets-Live-4",
  TIO_MT4_DEMO_1: "TIOMarkets-Practice",
});
export const getRealServer = (server) => {
  return TRADE_SERVERS_REAL[server] ?? server;
};

export const ACCOUNT_STATUS = Object.freeze({
  pendingToBeDeleted: "pendingToBeDeleted",
  active: "active",
  inactive: "inactive",
});

export const ALLOWED_EXPORT_FORMATS = Object.freeze({
  CSV: "csv",
  EXCEL: "excel",
  PDF: "pdf",
});

export const WITHDRAWAL_METHODS = Object.freeze({
  fiat: "fiat",
  crypto: "crypto",
});

export const FIAT_WITHDRAWAL_METHODS = Object.freeze({
  bank_wire: "bank_wire",
  credit_card: "credit_card",
  skrill: "skrill",
  neteller: "neteller",
});

export const CRM_USER_DEPARTMENTS = Object.freeze({
  sales: "sales",
  support: "support",
  marketing: "marketing",
  admin: "admin",
  funding: "funding",
  dealing: "dealing",
  compliance: "compliance",
  accounting: "accounting",
  developer: "developer",
});

export const USER_KYC_STATUS = Object.freeze({
  missingDocuments: "missingDocuments",
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
});

export const USER_ALLOWED_DOCUMENTS = Object.freeze({
  id_document: "id_document",
  id_document_history: "id_document_history",
  proof_of_address: "proof_of_address",
  proof_of_address_history: "proof_of_address_history",
  compliance: "compliance",
  other: "other",
  translations: "translations",
  funding: "funding",
});

export const USER_DOCUMENTS_STATUSES = Object.freeze({
  pending: "pending",
  pendingChanges: "pendingChanges",
  approved: "approved",
  rejected: "rejected",
  not_applicable: "na",
});

export const USER_TRANSACTION_TYPES = Object.freeze({
  deposit: "deposit",
  withdrawal: "withdrawal",
  balance_operation_deposit: "balance_operation_deposit",
  balance_operation_withdrawal: "balance_operation_withdrawal",
  credit_operation_deposit: "credit_operation_deposit",
  credit_operation_withdrawal: "credit_operation_withdrawal",
  transfer_between_accounts: "transfer_between_accounts",
});

export const USER_REQUEST_TYPES = Object.freeze({
  deleteAccount: "deleteAccount",
  withdrawFromAccount: "withdrawFromAccount",
  depositCryptoToAccount: "depositCryptoToAccount",
  transferFundsBetweenAccounts: "transferFundsBetweenAccounts",
  changeAccountLeverage: "changeAccountLeverage",
});

export const USER_REQUEST_TYPES_READABLE = Object.freeze({
  deleteAccount: "Delete account",
  withdrawFromAccount: "Withdraw from account",
  depositCryptoToAccount: "Deposit to crypto account",
  transferFundsBetweenAccounts: "Transfer funds between accounts",
  changeAccountLeverage: "Change account leverage",
});

export const USER_REQUEST_ACTIONS = Object.freeze({
  deleteAccount: { approve: "approve", reject: "reject" },
  withdrawFromAccount: {
    approve: "approve",
    reject: "reject",
    delayed: "delayed",
    processed: "processed",
  },
  depositCryptoToAccount: {
    processed: "processed",
    reject: "reject",
  },
  transferFundsBetweenAccounts: { approve: "approve", reject: "reject" },
  changeAccountLeverage: { approve: "approve", reject: "reject" },
});

export const USER_LOGS_ACTION_TYPES = Object.freeze({
  registered: "registered",
  loggedIn: "loggedIn",
  createAccount: "createAccount",
  deleteAccountRequest: "deleteAccountRequest",
  changePassword: "changePassword",
  changeEmail: "changeEmail",
  uploadKYCDocument: "uploadKYCDocument",
  approveKYCDocument: "approveKYCDocument",
  rejectKYCDocument: "rejectKYCDocument",
  userRequestAction: "userRequestAction",
  depositTransaction: "depositTransaction",
  withdrawTransaction: "withdrawTransaction",
  withdrawalRequest: "withdrawalRequest",
  withdrawalApproved: "withdrawalApproved",
  withdrawalRejected: "withdrawalRejected",
  depositCryptoRequest: "depositCryptoRequest",
  depositCryptoRequestApproved: "depositCryptoRequestApproved",
  depositCryptoRequestRejected: "depositCryptoRequestRejected",
  depositCrypto: "depositCrypto",
  balanceOperationDeposit: "balanceOperationDeposit",
  balanceOperationWithdrawal: "balanceOperationWithdrawal",
  requestTransferBetweenAccounts: "requestTransferBetweenAccounts",
  requestTransferBetweenAccountsApproved:
    "requestTransferBetweenAccountsApproved",
  requestTransferBetweenAccountsRejected:
    "requestTransferBetweenAccountsRejected",
  transferFundsBetweenAccounts: "transferFundsBetweenAccounts",
  changeAccountLeverage: "changeAccountLeverage",
  changeAccountLeverageApproved: "changeAccountLeverageApproved",
  changeAccountLeverageRejected: "changeAccountLeverageRejected",
});

// prettier-ignore
export const LANGUAGE_CODES = Object.freeze({
  ar: "ar", cz: "cz", de: "de", en: "en", es: "es", fr: "fr", hi: "hi", id: "id", it: "it", hu: "hu", ms: "ms", 
  pl: "pl", pt: "pt", th: "th", vi: "vi", cn: "cn", tw: "tw", tr: "tr",ru:"ru"
});

// prettier-ignore
export const TWILLIO_MAPPED_LOCALES = Object.freeze({
  ar: "ar", cz: "cs", de: "de", en: "en", es: "es", fr: "fr", hi: "hi", id: "id", it: "it", hu: "hu", ms: "ms", 
  pl: "pl", pt: "pt", th: "th", vi: "vi", "zh-hans": "zh-HK", "zh-tw": "zh-HK", nl: "nl", tr: "tr",
});

// prettier-ignore
export const PRAXIS_MAPPED_LOCALES = Object.freeze({
  ar: "ar-SA", cz: "cs-CZ", de: "de-DE", en: "en-GB", es: "es-ES", fr: "fr-FR", hi: "hi-IN", id: "id-ID", 
  it: "it-IT", hu: "hu-HU", ms: "ms-MY", pl: "pl-PL", pt: "pt-PT", th: "th-TH", vi: "vi-VN", "zh-hans": "zh-CN", 
  "zh-tw": "zh-TW", nl: "nl-NL", tr: "tr-TR",
});

// prettier-ignore
export const CURRENCY_CODES = Object.freeze({
  USD: "USD", CAD: "CAD", EUR: "EUR", AED: "AED", AFN: "AFN", ALL: "ALL", AMD: "AMD", ARS: "ARS", AUD: "AUD",
  AZN: "AZN", BAM: "BAM", BDT: "BDT", BGN: "BGN", BHD: "BHD", BIF: "BIF", BND: "BND", BOB: "BOB", BRL: "BRL", 
  BWP: "BWP", BYN: "BYN", BZD: "BZD", CDF: "CDF", CHF: "CHF", CLP: "CLP", CNY: "CNY", COP: "COP", CRC: "CRC", 
  CVE: "CVE", CZK: "CZK", DJF: "DJF", DKK: "DKK", DOP: "DOP", DZD: "DZD", EEK: "EEK", EGP: "EGP", ERN: "ERN", 
  ETB: "ETB", GBP: "GBP", GEL: "GEL", GHS: "GHS", GNF: "GNF", GTQ: "GTQ", HKD: "HKD", HNL: "HNL", HRK: "HRK", 
  HUF: "HUF", IDR: "IDR", ILS: "ILS", INR: "INR", IQD: "IQD", IRR: "IRR", ISK: "ISK", JMD: "JMD", JOD: "JOD", 
  JPY: "JPY", KES: "KES", KHR: "KHR", KMF: "KMF", KRW: "KRW", KWD: "KWD", KZT: "KZT", LBP: "LBP", LKR: "LKR", 
  LTL: "LTL", LVL: "LVL", LYD: "LYD", MAD: "MAD", MDL: "MDL", MGA: "MGA", MKD: "MKD", MMK: "MMK", MOP: "MOP", 
  MUR: "MUR", MXN: "MXN", MYR: "MYR", MZN: "MZN", NAD: "NAD", NGN: "NGN", NIO: "NIO", NOK: "NOK", NPR: "NPR", 
  NZD: "NZD", OMR: "OMR", PAB: "PAB", PEN: "PEN", PHP: "PHP", PKR: "PKR", PLN: "PLN", PYG: "PYG", QAR: "QAR", 
  RON: "RON", RSD: "RSD", RUB: "RUB", RWF: "RWF", SAR: "SAR", SDG: "SDG", SEK: "SEK", SGD: "SGD", SOS: "SOS", 
  SYP: "SYP", THB: "THB", TND: "TND", TOP: "TOP", TRY: "TRY", TTD: "TTD", TWD: "TWD", TZS: "TZS", UAH: "UAH", 
  UGX: "UGX", UYU: "UYU", UZS: "UZS", VEF: "VEF", VND: "VND", XAF: "XAF", XOF: "XOF", YER: "YER", ZAR: "ZAR", 
  ZMK: "ZMK", ZWL: "ZWL",
});

export const PRAXIS_SESSION_INTENTS = Object.freeze({
  authorization: "authorization",
  payment: "payment",
  withdrawal: "withdrawal",
});

export const PRAXIS_SESSION_STATUS = Object.freeze({
  open: "open",
  action_required: "action required",
  succesful: "successful",
  failed: "failed",
  exprired: "expired",
});

export const PRAXIS_TRANSACTION_TYPE = Object.freeze({
  authorization: "authorization",
  sale: "sale",
  payout: "payout",
  refund: "refund",
});

export const PRAXIS_TRANSACTION_STATUS = Object.freeze({
  payment_initialized: "initialized",
  payment_pending: "pending",
  payment_authorized: "authorized",
  payment_approved: "approved",
  payment_rejected: "rejected",
  payment_cancelled: "cancelled",
  payment_error: "error",
  payment_partial_refund: "partial_refund",
  payment_refund: "refund",
  payment_chargeback: "chargeback",
  payment_duplicated: "duplicated",
  withdrawal_initialized: "initialized",
  withdrawal_pending: "pending",
  withdrawal_approved: "approved",
  withdrawal_rejected: "rejected",
  withdrawal_error: "error",
});

export const CALENDAR_EVENT_TYPES = Object.freeze({
  follow_up: "follow_up",
});
