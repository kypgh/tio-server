import { number } from "joi";
import SymbolsModel from "../models/Symbols.model";

const symbolService = {
  getSymbol: (symbol, server) => {
    return SymbolsModel.findOne({ symbol, server });
  },
  getCtraderSymbolById: (id, server) => {
    return SymbolsModel.findOne({ id: Number(id), server });
  },
  getMultibleSymbols: (symbols, server) => {
    return SymbolsModel.find({ symbol: { $in: symbols }, server });
  },
  getMultibleCtraderSymbolsById: (ids, server) => {
    return SymbolsModel.find({ id: { $in: ids }, server });
  },
};

export default symbolService;
