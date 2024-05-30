export interface MT5Order {
  activationFlags: EnTradeActivationFlags;
  activationMode: EnOrderActivation;
  activationPrice: number;
  activationTime: number;
  comment: string;
  contractSize: number;
  dealer: number;
  digits: number;
  digitsCurrency: number;
  expertId: number;
  externalId: string;
  login: number;
  modificationFlags: EnTradeModifyFlags;
  orderId: number;
  positionById: number;
  positionId: number;
  priceCurrent: number;
  priceOrder: number;
  priceSL: number;
  priceTP: number;
  priceTrigger: number;
  print: string;
  rateMargin: number;
  reason: EnOrderReason;
  state: EnOrderState;
  symbol: string;
  timeDone: number;
  timeDoneMsc: number;
  timeExpiration: number;
  timeSetup: number;
  timeSetupMsc: number;
  type: EnOrderType;
  typeFill: EnOrderFilling;
  typeTime: EnOrderTime;
  volumeCurrent: number;
  volumeCurrentExt: number;
  volumeInitial: number;
  volumeInitialExt: number;
}

export interface MT5Position {
  action: EnPositionAction;
  activationFlags: EnTradeActivationFlags;
  activationMode: EnActivation;
  activationPrice: number;
  activationTime: number;
  comment: string;
  contractSize: number;
  dealer: number;
  digits: number;
  digitsCurrency: number;
  expertID: number;
  expertPositionID: number;
  externalID: string;
  login: number;
  modificationFlags: EnTradeModifyFlags;
  obsoleteValue: number;
  positionId: number;
  priceCurrent: number;
  priceOpen: number;
  priceSL: number;
  priceTP: number;
  profit: number;
  rateMargin: number;
  rateProfit: number;
  reason: EnPositionReason;
  storage: number;
  symbol: string;
  timeCreate: number;
  timeCreateMsc: number;
  timeUpdate: number;
  timeUpdateMsc: number;
  volume: number;
  volumeExt: number;
}

export interface MT5Deal {
  action: EnDealAction;
  comment: string;
  commission: number;
  contractSize: number;
  dealId: number;
  dealer: number;
  digits: number;
  digitsCurrency: number;
  entry: EnEntryFlag;
  expertId: number;
  externalId: string;
  fee: number;
  flags: number;
  gateway: string;
  login: number;
  marketAsk: number;
  marketBid: number;
  marketLast: number;
  modificationFlags: EnTradeModifyFlags;
  obsoleteValue: number;
  orderId: number;
  positionId: number;
  price: number;
  priceGateway: number;
  pricePosition: number;
  priceSL: number;
  priceTP: number;
  print: string;
  profit: number;
  profitRaw: number;
  rateMargin: number;
  rateProfit: number;
  reason: EnDealReason;
  storage: number;
  symbol: string;
  tickSize: number;
  tickValue: number;
  time: number;
  timeMsc: number;
  value: number;
  volume: number;
  volumeClosed: number;
  volumeClosedExt: number;
  volumeExt: number;
}

declare enum EnDealAction {
  DEAL_BUY = 0,
  DEAL_FIRST = 0,
  DEAL_SELL = 1,
  DEAL_BALANCE = 2,
  DEAL_CREDIT = 3,
  DEAL_CHARGE = 4,
  DEAL_CORRECTION = 5,
  DEAL_BONUS = 6,
  DEAL_COMMISSION = 7,
  DEAL_COMMISSION_DAILY = 8,
  DEAL_COMMISSION_MONTHLY = 9,
  DEAL_AGENT_DAILY = 10,
  DEAL_AGENT_MONTHLY = 11,
  DEAL_INTERESTRATE = 12,
  DEAL_BUY_CANCELED = 13,
  DEAL_SELL_CANCELED = 14,
  DEAL_DIVIDEND = 15,
  DEAL_DIVIDEND_FRANKED = 16,
  DEAL_TAX = 17,
  DEAL_AGENT = 18,
  DEAL_SO_COMPENSATION = 19,
  DEAL_SO_COMPENSATION_CREDIT = 20,
  DEAL_LAST = 20,
}
declare enum EnEntryFlag {
  ENTRY_IN = 0,
  ENTRY_FIRST = 0,
  ENTRY_OUT = 1,
  ENTRY_INOUT = 2,
  ENTRY_OUT_BY = 3,
  ENTRY_LAST = 3,
}
declare enum EnTradeModifyFlags {
  MODIFY_FLAGS_NONE = 0,
  MODIFY_FLAGS_ADMIN = 1,
  MODIFY_FLAGS_MANAGER = 2,
  MODIFY_FLAGS_POSITION = 4,
  MODIFY_FLAGS_RESTORE = 8,
  MODIFY_FLAGS_API_ADMIN = 16,
  MODIFY_FLAGS_API_MANAGER = 32,
  MODIFY_FLAGS_API_SERVER = 64,
  MODIFY_FLAGS_API_GATEWAY = 128,
  MODIFY_FLAGS_ALL = 255,
}
declare enum EnDealReason {
  DEAL_REASON_CLIENT = 0,
  DEAL_REASON_FIRST = 0,
  DEAL_REASON_EXPERT = 1,
  DEAL_REASON_DEALER = 2,
  DEAL_REASON_SL = 3,
  DEAL_REASON_TP = 4,
  DEAL_REASON_SO = 5,
  DEAL_REASON_ROLLOVER = 6,
  DEAL_REASON_EXTERNAL_CLIENT = 7,
  DEAL_REASON_VMARGIN = 8,
  DEAL_REASON_GATEWAY = 9,
  DEAL_REASON_SIGNAL = 10,
  DEAL_REASON_SETTLEMENT = 11,
  DEAL_REASON_TRANSFER = 12,
  DEAL_REASON_SYNC = 13,
  DEAL_REASON_EXTERNAL_SERVICE = 14,
  DEAL_REASON_MIGRATION = 15,
  DEAL_REASON_MOBILE = 16,
  DEAL_REASON_WEB = 17,
  DEAL_REASON_SPLIT = 18,
  DEAL_REASON_LAST = 18,
}

declare enum EnPositionAction {
  POSITION_BUY = 0,
  POSITION_FIRST = 0,
  POSITION_SELL = 1,
  POSITION_LAST = 1,
}
declare enum EnTradeActivationFlags {
  ACTIV_FLAGS_NONE = 0,
  ACTIV_FLAGS_NO_LIMIT = 1,
  ACTIV_FLAGS_NO_STOP = 2,
  ACTIV_FLAGS_NO_SLIMIT = 4,
  ACTIV_FLAGS_NO_SL = 8,
  ACTIV_FLAGS_NO_TP = 16,
  ACTIV_FLAGS_NO_SO = 32,
  ACTIV_FLAGS_NO_EXPIRATION = 64,
  ACTIV_FLAGS_ALL = 127,
}
declare enum EnActivation {
  ACTIVATION_NONE = 0,
  ACTIVATION_FIRST = 0,
  ACTIVATION_SL = 1,
  ACTIVATION_TP = 2,
  ACTIVATION_STOPOUT = 3,
  ACTIVATION_LAST = 3,
}
declare enum EnPositionReason {
  POSITION_REASON_CLIENT = 0,
  POSITION_REASON_FIRST = 0,
  POSITION_REASON_EXPERT = 1,
  POSITION_REASON_DEALER = 2,
  POSITION_REASON_SL = 3,
  POSITION_REASON_TP = 4,
  POSITION_REASON_SO = 5,
  POSITION_REASON_ROLLOVER = 6,
  POSITION_REASON_EXTERNAL_CLIENT = 7,
  POSITION_REASON_VMARGIN = 8,
  POSITION_REASON_GATEWAY = 9,
  POSITION_REASON_SIGNAL = 10,
  POSITION_REASON_SETTLEMENT = 11,
  POSITION_REASON_TRANSFER = 12,
  POSITION_REASON_SYNC = 13,
  POSITION_REASON_EXTERNAL_SERVICE = 14,
  POSITION_REASON_MIGRATION = 15,
  POSITION_REASON_MOBILE = 16,
  POSITION_REASON_WEB = 17,
  POSITION_REASON_SPLIT = 18,
  POSITION_REASON_LAST = 18,
}

declare enum EnOrderActivation {
  ACTIVATION_NONE = 0,
  ACTIVATION_FIRST = 0,
  ACTIVATION_PENDING = 1,
  ACTIVATION_STOPLIMIT = 2,
  ACTIVATION_EXPIRATION = 3,
  ACTIVATION_STOPOUT = 4,
  ACTIVATION_LAST = 4,
}

declare enum EnOrderReason {
  ORDER_REASON_CLIENT = 0,
  ORDER_REASON_FIRST = 0,
  ORDER_REASON_EXPERT = 1,
  ORDER_REASON_DEALER = 2,
  ORDER_REASON_SL = 3,
  ORDER_REASON_TP = 4,
  ORDER_REASON_SO = 5,
  ORDER_REASON_ROLLOVER = 6,
  ORDER_REASON_EXTERNAL_CLIENT = 7,
  ORDER_REASON_VMARGIN = 8,
  ORDER_REASON_GATEWAY = 9,
  ORDER_REASON_SIGNAL = 10,
  ORDER_REASON_SETTLEMENT = 11,
  ORDER_REASON_TRANSFER = 12,
  ORDER_REASON_SYNC = 13,
  ORDER_REASON_EXTERNAL_SERVICE = 14,
  ORDER_REASON_MIGRATION = 15,
  ORDER_REASON_MOBILE = 16,
  ORDER_REASON_WEB = 17,
  ORDER_REASON_SPLIT = 18,
  ORDER_REASON_LAST = 18,
}

declare enum EnOrderState {
  ORDER_STATE_STARTED = 0,
  ORDER_STATE_FIRST = 0,
  ORDER_STATE_PLACED = 1,
  ORDER_STATE_CANCELED = 2,
  ORDER_STATE_PARTIAL = 3,
  ORDER_STATE_FILLED = 4,
  ORDER_STATE_REJECTED = 5,
  ORDER_STATE_EXPIRED = 6,
  ORDER_STATE_REQUEST_ADD = 7,
  ORDER_STATE_REQUEST_MODIFY = 8,
  ORDER_STATE_REQUEST_CANCEL = 9,
  ORDER_STATE_LAST = 9,
}

declare enum EnOrderType {
  OP_BUY = 0,
  OP_FIRST = 0,
  OP_SELL = 1,
  OP_BUY_LIMIT = 2,
  OP_SELL_LIMIT = 3,
  OP_BUY_STOP = 4,
  OP_SELL_STOP = 5,
  OP_BUY_STOP_LIMIT = 6,
  OP_SELL_STOP_LIMIT = 7,
  OP_CLOSE_BY = 8,
  OP_LAST = 8,
}

declare enum EnOrderFilling {
  ORDER_FILL_FOK = 0,
  ORDER_FILL_FIRST = 0,
  ORDER_FILL_IOC = 1,
  ORDER_FILL_RETURN = 2,
  ORDER_FILL_LAST = 2,
}

declare enum EnOrderTime {
  ORDER_TIME_GTC = 0,
  ORDER_TIME_FIRST = 0,
  ORDER_TIME_DAY = 1,
  ORDER_TIME_SPECIFIED = 2,
  ORDER_TIME_SPECIFIED_DAY = 3,
  ORDER_TIME_LAST = 3,
}
