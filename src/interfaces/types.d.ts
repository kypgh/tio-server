// This file is unused, but is helpful for defining types (intellisense autocomplete etc..)
import { RequestHandler } from "express";

export interface IEndpointsConfig {
  middleware?: {
    all?: Array<RequestHandler>;
    get?: Array<RequestHandler>;
    post?: Array<RequestHandler>;
    put?: Array<RequestHandler>;
    delete?: Array<RequestHandler>;
  };
}

export interface UnifiedTrade {
  positionId: String;
  action: "BUY" | "SELL";
  symbol: String;
  openPrice: Number;
  closePrice: Number;
  swap: Number;
  commission: Number;
  grossProfit: Number;
  netProfit: Number;
  volume: Number;
  openTime: Number;
}
