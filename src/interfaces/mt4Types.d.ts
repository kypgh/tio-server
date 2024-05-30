export interface Mt4Trade {
  order: Number; // order ticket
  login: Number; // owner's login
  symbol: String; // security max 12 chars
  digits: Number; // security precision
  cmd: Number; // trade command
  volume: Number; // volume
  open_time: Number; // open time
  state: Number; // reserved
  open_price: Number; // open price
  sl: Number; // stop loss
  tp: Number; // take profit
  close_time: Number; // close time
  gw_volume: Number; // gateway order volume
  expiration: Number; // pending order's expiration time
  reason: String; // trade reason
  conv_rates: [Number]; // convertation rates from profit currency to group deposit currency (first element-for open time, second element-for close time)
  commission: Number; // commission
  commission_agent: Number; // agent commission
  storage: Number; // order swaps
  close_price: Number; // close price
  profit: Number; // profit
  taxes: Number; // taxes
  magic: Number; // special value used by client experts
  comment: String; // comment
  gw_order: Number; // gateway order ticket
  activation: Number; // used by MT Manager
  gw_open_price: Number; // gateway order price deviation (pips) from order open price
  gw_close_price: Number; // gateway order price deviation (pips) from order close price
  margin_rate: Number; // margin convertation rate (rate of convertation from margin currency to deposit one)
  timestamp: Number; // timestamp
}


export interface Mt4TransactionInfo {
  cmd: number;
  comment: string;
  crc: number;
  expiration: number;
  ie_deviation: number;
  order: number;
  orderby: number;
  price: number;
  sl: number;
  symbol: string;
  tp: number;
  type: number;
  volume: number;
}