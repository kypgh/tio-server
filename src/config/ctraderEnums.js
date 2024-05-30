export const CTRADER_ORDER_ACTIONS = Object.freeze({
  ORDER_ACCEPTED: "ORDER_ACCEPTED",
  ORDER_FILLED: "ORDER_FILLED",
  ORDER_REPLACED: "ORDER_REPLACED",
  ORDER_CANCELLED: "ORDER_CANCELLED",
  ORDER_EXPIRED: "ORDER_EXPIRED",
  ORDER_REJECTED: "ORDER_REJECTED",
  ORDER_CANCEL_REJECTED: "ORDER_CANCEL_REJECTED",
  ORDER_PARTIAL_FILL: "ORDER_PARTIAL_FILL",
});

/**
 * ProtoOrderType
 */
export const CTRADER_ORDER_TYPES = Object.freeze({
  MARKET: "MARKET",
  LIMIT: "LIMIT",
  STOP: "STOP",
  STOP_LOSS_TAKE_PROFIT: "STOP_LOSS_TAKE_PROFIT",
  MARKET_RANGE: "MARKET_RANGE",
  STOP_LIMIT: "STOP_LIMIT",
});

/**
 * ProtoOrderStatus
 */
export const CTRADER_ORDER_STATUS = Object.freeze({
  ORDER_STATUS_ACCEPTED: "ORDER_STATUS_ACCEPTED",
  ORDER_STATUS_FILLED: "ORDER_STATUS_FILLED",
  ORDER_STATUS_REJECTED: "ORDER_STATUS_REJECTED",
  ORDER_STATUS_EXPIRED: "ORDER_STATUS_EXPIRED",
  ORDER_STATUS_CANCELLED: "ORDER_STATUS_CANCELLED",
  ORDER_STATUS_RESERVED: "ORDER_STATUS_RESERVED",
});

/**
 * ProtoBookType
 */
export const CTRADER_BOOK_TYPE = Object.freeze({
  BOOK_A: "BOOK_A",
  BOOK_B: "BOOK_B",
});

/**
 * ProtoTimeInForce
 */
export const CTRADER_TIME_IN_FORCE = Object.freeze({
  GOOD_TILL_DATE: "GOOD_TILL_DATE",
  GOOD_TILL_CANCEL: "GOOD_TILL_CANCEL",
  IMMEDIATE_OR_CANCEL: "IMMEDIATE_OR_CANCEL",
  FILL_OR_KILL: "FILL_OR_KILL",
  MARKET_ON_OPEN: "MARKET_ON_OPEN",
});

/**
 * ProtoOrderTriggerMethod
 */
export const CTRADER_ORDER_TRIGGER_METHOD = Object.freeze({
  TRADE: "TRADE",
  OPPOSITE: "OPPOSITE",
  DOUBLE_TRADE: "DOUBLE_TRADE",
  DOUBLE_OPPOSITE: "DOUBLE_OPPOSITE",
});

/**
 * ProtoTradeSide
 */
export const CTRADER_TRADE_SIDE = Object.freeze({
  BUY: "BUY",
  SELL: "SELL",
});

/**
 * ProtoDealStatus
 */
export const CTRADER_DEAL_STATUS = Object.freeze({
  FILLED: "FILLED",
  PARTIALLY_FILLED: "PARTIALLY_FILLED",
  REJECTED: "REJECTED",
  INTERNALLY_REJECTED: "INTERNALLY_REJECTED",
  ERROR: "ERROR",
  MISSED: "MISSED",
});

/**
 * ProtoDealType
 */
export const CTRADER_DEAL_TYPE = Object.freeze({
  MARKET_DEAL: "MARKET_DEAL",
  LIMIT_DEAL: "LIMIT_DEAL",
});

/**
 * ProtoPositionStatus
 */
export const CTRADER_POSITION_STATUS = Object.freeze({
  POSITION_STATUS_OPEN: "POSITION_STATUS_OPEN",
  POSITION_STATUS_CLOSED: "POSITION_STATUS_CLOSED",
  POSITION_STATUS_CREATED: "POSITION_STATUS_CREATED",
  POSITION_STATUS_ERROR: "POSITION_STATUS_ERROR",
});

// prettier-ignore
export const CTRADER_SYMBOLS = Object.freeze([
  { id: 1, symbol: 'EURUSD', description: 'Euro vs US Dollar', group: 'Forex' },
  { id: 2, symbol: 'GBPUSD', description: 'British Pound vs US Dollar', group: 'Forex' },
  { id: 3, symbol: 'EURJPY', description: 'Euro vs Japanese Yen', group: 'Forex' },
  { id: 4, symbol: 'USDJPY', description: 'US Dollar vs Japanese Yen', group: 'Forex' },
  { id: 5, symbol: 'AUDUSD', description: 'Australian vs US Dollar', group: 'Forex' },
  { id: 6, symbol: 'USDCHF', description: 'US Dollar vs Swiss Franc', group: 'Forex' },
  { id: 7, symbol: 'GBPJPY', description: 'British Pound vs Japanese Yen', group: 'Forex' },
  { id: 8, symbol: 'USDCAD', description: 'US Dollar vs Canadian', group: 'Forex' },
  { id: 9, symbol: 'EURGBP', description: 'Euro vs British Pound', group: 'Forex' },
  { id: 10, symbol: 'EURCHF', description: 'Euro vs Swiss Franc', group: 'Forex' },
  { id: 11, symbol: 'AUDJPY', description: 'Australian Dollar vs Japanese Yen', group: 'Forex' },
  { id: 12, symbol: 'NZDUSD', description: 'New Zeland Dollar vs US Dollar', group: 'Forex' },
  { id: 13, symbol: 'CHFJPY', description: 'Swiss Franc vs Japanese Yen', group: 'Forex' },
  { id: 14, symbol: 'EURAUD', description: 'Euro vs Australian Dollar', group: 'Forex' },
  { id: 15, symbol: 'CADJPY', description: 'Canadian Dollar vs Japanese Yen', group: 'Forex' },
  { id: 16, symbol: 'GBPAUD', description: 'British Pound vs Australian Dollar', group: 'Forex' },
  { id: 17, symbol: 'EURCAD', description: 'Euro vs Canadian Dollar', group: 'Forex' },
  { id: 18, symbol: 'AUDCAD', description: 'Australian Dollar vs Canadian Dollar', group: 'Forex' },
  { id: 19, symbol: 'GBPCAD', description: 'British Pound vs Canadian Dollar', group: 'Forex' },
  { id: 20, symbol: 'AUDNZD', description: 'Australian vs New Zeland Dollar', group: 'Forex' },
  { id: 21, symbol: 'NZDJPY', description: 'New Zeland Dollar vs Japanese Yen', group: 'Forex' },
  { id: 22, symbol: 'USDNOK', description: 'US Dollar vs Norwegian Krone', group: 'Forex' },
  { id: 23, symbol: 'AUDCHF', description: 'Australian Dollar vs Swiss Franc', group: 'Forex' },
  { id: 24, symbol: 'USDMXN', description: 'US Dollar vs Mexican Peso', group: 'Forex' },
  { id: 25, symbol: 'GBPNZD', description: 'British Pound vs New Zeland Dollar', group: 'Forex' },
  { id: 26, symbol: 'EURNZD', description: 'Euro vs New Zeland Dollar', group: 'Forex' },
  { id: 27, symbol: 'CADCHF', description: 'Canadian Dollar vs Swiss Franc', group: 'Forex' },
  { id: 28, symbol: 'USDSGD', description: 'US Dollar vs Singapore Dollar', group: 'Forex' },
  { id: 29, symbol: 'USDSEK', description: 'US Dollar vs Swedish Krona', group: 'Forex' },
  { id: 30, symbol: 'NZDCAD', description: 'New Zeland Dollar vs Canadian Dollar', group: 'Forex' },
  { id: 31, symbol: 'EURSEK', description: 'Euro vs Swedish Krona', group: 'Forex' },
  { id: 34, symbol: 'EURHUF', description: 'Euro vs Hungarian Forint', group: 'Forex' },
  { id: 35, symbol: 'USDPLN', description: 'US Dollar vs Polish Zloty', group: 'Forex' },
  { id: 39, symbol: 'NZDCHF', description: 'New Zeland Dollar vs Swiss Franc', group: 'Forex' },
  { id: 40, symbol: 'GBPCHF', description: 'British Pound vs Swiss Franc', group: 'Forex' },
  { id: 41, symbol: 'XAUUSD', description: 'Gold vs US Dollar', group: 'Metals' },
  { id: 42, symbol: 'XAGUSD', description: 'Silver vs US Dollar', group: 'Metals' },
  { id: 43, symbol: 'USDTRY', description: 'US Dollar vs Turkish Lira', group: 'Forex' },
  { id: 44, symbol: 'EURTRY', description: 'Euro vs Turkish Lira', group: 'Forex' },
  { id: 47, symbol: 'SGDJPY', description: 'Singapore dollar vs Japanese Yen', group: 'Forex' },
  { id: 48, symbol: 'USDHKD', description: 'US Dollar vs Hong Kong dollar', group: 'Forex' },
  { id: 49, symbol: 'USDZAR', description: 'US Dollar vs South African rand', group: 'Forex' },
  { id: 50, symbol: 'EURMXN', description: 'Euro vs Mexican Peso', group: 'Forex' },
  { id: 51, symbol: 'EURPLN', description: 'Euro vs Polish Zloty', group: 'Forex' },
  { id: 54, symbol: 'USDHUF', description: 'US Dollar vs Hungarian Forint', group: 'Forex' },
  { id: 55, symbol: 'EURCZK', description: 'Euro vs Czech Koruna', group: 'Forex' },
  { id: 56, symbol: 'USDCZK', description: 'US Dollar vs Czech Koruna', group: 'Forex' },
  { id: 60, symbol: 'USDCNH', description: 'US Dollar vs China Offshore Spot', group: 'Forex' },
  { id: 61, symbol: 'GBPSEK', description: 'British Pound vs Swedish Krona', group: 'Forex' },
  { id: 87, symbol: 'NOKSEK', description: 'Norwegian Krone vs Swedish Krona', group: 'Forex' },
  { id: 95, symbol: 'XPDUSD', description: 'Palladium  vs US Dollar', group: 'Metals' },
  { id: 97, symbol: 'XPTUSD', description: 'Platinum vs US Dollar', group: 'Metals' },
  { id: 101, symbol: 'BTCUSD', description: 'Bitcoin vs US Dollar', group: 'Crypto' },
  { id: 102, symbol: 'ETHUSD', description: 'Ethereum vs US Dollar', group: 'Crypto' },
  { id: 103, symbol: 'USDTUSD', description: 'Tether vs US Dollar', group: 'Crypto' },
  { id: 205, symbol: 'DE40', description: 'dax', group: 'Indices' },
  { id: 206, symbol: 'AUS200', description: 'ASX200 Index', group: 'Indices' },
  { id: 207, symbol: 'NAS', description: 'Nasdaq', group: 'Indices' },
  { id: 208, symbol: 'S&P500', description: 'S&P 500', group: 'Indices' },
  { id: 209, symbol: 'DJ', description: 'Dow Jones Industrial Average', group: 'Indices' },
  { id: 210, symbol: 'STOXX50', description: 'STOXX50 Index', group: 'Indices' },
  { id: 211, symbol: 'HK50', description: 'Hang Seng Index', group: 'Indices' },
  { id: 212, symbol: 'ESP35', description: 'Spain 35', group: 'Indices' },
  { id: 213, symbol: 'UK100', description: 'FTSE 100 Index', group: 'Indices' },
  { id: 214, symbol: 'UKOIL.sp', description: 'BRENT', group: 'Energies' },
  { id: 215, symbol: 'USOIL.sp', description: 'WTI', group: 'Energies' },
  { id: 216, symbol: 'LTCUSD', description: 'Litecoin vs USD', group: 'Crypto' },
  { id: 217, symbol: 'JP225', description: 'Nikkei 225 Index', group: 'Indices' },
  { id: 318, symbol: 'AAL', description: 'American Airlines Group Inc', group: 'USA Shares' },
  { id: 319, symbol: 'AAPL', description: 'APPLE COMPUTER INC', group: 'USA Shares' },
  { id: 320, symbol: 'ABT', description: 'Abbott Labs', group: 'USA Shares' },
  { id: 321, symbol: 'ACN', description: 'Accenture PLC-CLA', group: 'USA Shares' },
  { id: 322, symbol: 'ADBE', description: 'Adobe', group: 'USA Shares' },
  { id: 323, symbol: 'ADP', description: 'Automatic Data Processing Inc', group: 'USA Shares' },
  { id: 324, symbol: 'ADSK', description: 'Autodesk Inc', group: 'USA Shares' },
  { id: 325, symbol: 'AIG', description: 'American International Group', group: 'USA Shares' },
  { id: 326, symbol: 'ALGN', description: 'Align Technology Inc', group: 'USA Shares' },
  { id: 327, symbol: 'AMD', description: 'AMD Advanced Micro Devices Inc', group: 'USA Shares' },
  { id: 328, symbol: 'AMGN', description: 'AMGEN INC', group: 'USA Shares' },
  { id: 329, symbol: 'AMZN', description: 'AMAZON COM INC', group: 'USA Shares' },
  { id: 330, symbol: 'ASML', description: 'ASML Holding NV', group: 'USA Shares' },
  { id: 331, symbol: 'AVGO', description: 'Broadcom Inc', group: 'USA Shares' },
  { id: 332, symbol: 'AXP', description: 'American Express', group: 'USA Shares' },
  { id: 333, symbol: 'BA', description: 'Boeing', group: 'USA Shares' },
  { id: 334, symbol: 'BAC', description: 'BANK OF AMERICA', group: 'USA Shares' },
  { id: 335, symbol: 'BAX', description: 'Baxter International Inc', group: 'USA Shares' },
  { id: 336, symbol: 'BIIB', description: 'Biogen Inc', group: 'USA Shares' },
  { id: 337, symbol: 'BK', description: 'Bank of New York Mellon', group: 'USA Shares' },
  { id: 338, symbol: 'BKR', description: 'Baker Hughes Co', group: 'USA Shares' },
  { id: 339, symbol: 'BMRN', description: 'Biomarin Pharmaceutical Inc', group: 'USA Shares' },
  { id: 340, symbol: 'BMY', description: 'Bristol-Myers Squibb Co', group: 'USA Shares' },
  { id: 341, symbol: 'BRKB', description: 'Berkshire Hathaway Inc', group: 'USA Shares' },
  { id: 342, symbol: 'C', description: 'CITIGROUP', group: 'USA Shares' },
  { id: 343, symbol: 'CAT', description: 'CATERPILLAR', group: 'USA Shares' },
  { id: 344, symbol: 'CDNS', description: 'Cadence Design Systems Inc', group: 'USA Shares' },
  { id: 345, symbol: 'CHTR', description: 'Charter Communications Inc', group: 'USA Shares' },
  { id: 346, symbol: 'CL', description: 'Colgate Palmolive Co', group: 'USA Shares' },
  { id: 347, symbol: 'CMCSA', description: 'Comcast Corp', group: 'USA Shares' },
  { id: 348, symbol: 'CME', description: 'CHICAGO MERCANTLE', group: 'USA Shares' },
  { id: 349, symbol: 'COP', description: 'CONOCO PHILLIPS', group: 'USA Shares' },
  { id: 350, symbol: 'COST', description: 'Costco Wholesale Corp', group: 'USA Shares' },
  { id: 351, symbol: 'CRM', description: 'SALESFORCE', group: 'USA Shares' },
  { id: 352, symbol: 'CSCO', description: 'Cisco Systems Inc', group: 'USA Shares' },
  { id: 353, symbol: 'CSX', description: 'CSX Corp', group: 'USA Shares' },
  { id: 354, symbol: 'CTAS', description: 'Cintas Corp', group: 'USA Shares' },
  { id: 355, symbol: 'CTSH', description: 'COGNIZANT TECHNOLOGY SOLUTION', group: 'USA Shares' },
  { id: 357, symbol: 'CVX', description: 'CHEVRON', group: 'USA Shares' },
  { id: 358, symbol: 'D', description: 'Dominion Energy Inc', group: 'USA Shares' },
  { id: 359, symbol: 'DD', description: 'Dupont Inc', group: 'USA Shares' },
  { id: 360, symbol: 'DE', description: 'Deere & Co', group: 'USA Shares' },
  { id: 361, symbol: 'DHR', description: 'Danaher Corp', group: 'USA Shares' },
  { id: 362, symbol: 'DIS', description: 'DISNEY (WALT)', group: 'USA Shares' },
  { id: 363, symbol: 'DUK', description: 'Duke Energy Corp', group: 'USA Shares' },
  { id: 364, symbol: 'DVN', description: 'Devon Energy Corp', group: 'USA Shares' },
  { id: 365, symbol: 'EBAY', description: 'EBAY INC', group: 'USA Shares' },
  { id: 366, symbol: 'EMR', description: 'Emerson Electric Co', group: 'USA Shares' },
  { id: 367, symbol: 'EOG', description: 'EOG Resources Inc', group: 'USA Shares' },
  { id: 368, symbol: 'EXC', description: 'Exelon Corp', group: 'USA Shares' },
  { id: 369, symbol: 'EXPE', description: 'Expedia Group Inc', group: 'USA Shares' },
  { id: 370, symbol: 'F', description: 'Ford Motor Co', group: 'USA Shares' },
  { id: 371, symbol: 'META', description: 'Meta Platforms Inc', group: 'USA Shares' },
  { id: 372, symbol: 'FCX', description: 'Freeport-McMoran Inc', group: 'USA Shares' },
  { id: 373, symbol: 'FDX', description: 'FEDEX CORP', group: 'USA Shares' },
  { id: 374, symbol: 'FISV', description: 'Fiserv Inc', group: 'USA Shares' },
  { id: 375, symbol: 'FOXA', description: 'Fox Corp', group: 'USA Shares' },
  { id: 376, symbol: 'GD', description: 'General Dynamics Corp', group: 'USA Shares' },
  { id: 377, symbol: 'GE', description: 'General Electric Co', group: 'USA Shares' },
  { id: 378, symbol: 'GILD', description: 'GILEAD SCIENCES INC', group: 'USA Shares' },
  { id: 379, symbol: 'GIS', description: 'General Mills Inc', group: 'USA Shares' },
  { id: 380, symbol: 'GM', description: 'General Motors Co', group: 'USA Shares' },
  { id: 381, symbol: 'GOOG', description: 'GOOGLE INC', group: 'USA Shares' },
  { id: 382, symbol: 'GS', description: 'GOLDMAN SACHS', group: 'USA Shares' },
  { id: 383, symbol: 'HAL', description: 'Halliburton Co', group: 'USA Shares' },
  { id: 384, symbol: 'HAS', description: 'Hasbro Inc', group: 'USA Shares' },
  { id: 385, symbol: 'HD', description: 'HOME DEPOT', group: 'USA Shares' },
  { id: 386, symbol: 'HON', description: 'Honeywell International Inc', group: 'USA Shares' },
  { id: 387, symbol: 'HPQ', description: 'HP Inc', group: 'USA Shares' },
  { id: 388, symbol: 'IBM', description: 'IBM', group: 'USA Shares' },
  { id: 389, symbol: 'IDXX', description: 'IDEXX Laboratories Inc', group: 'USA Shares' },
  { id: 390, symbol: 'ILMN', description: 'Illumina Inc', group: 'USA Shares' },
  { id: 391, symbol: 'INTC', description: 'INTEL', group: 'USA Shares' },
  { id: 392, symbol: 'INTU', description: 'Intuit Inc', group: 'USA Shares' },
  { id: 393, symbol: 'ISRG', description: 'Intuitive Surgical Inc', group: 'USA Shares' },
  { id: 394, symbol: 'ITW', description: 'Illinois Tool Works Inc', group: 'USA Shares' },
  { id: 395, symbol: 'JBHT', description: 'JB Hunt Transportation Services', group: 'USA Shares' },
  { id: 396, symbol: 'JD', description: 'JD.com Inc', group: 'USA Shares' },
  { id: 397, symbol: 'JNJ', description: 'JOHNSON&JOHNSON', group: 'USA Shares' },
  { id: 398, symbol: 'JPM', description: 'JP MORGAN CHASE', group: 'USA Shares' },
  { id: 399, symbol: 'KHC', description: 'The Kraft Heinz Co', group: 'USA Shares' },
  { id: 400, symbol: 'KLAC', description: 'KLA Corp', group: 'USA Shares' },
  { id: 401, symbol: 'KMB', description: 'Kimberly-Clark Corp', group: 'USA Shares' },
  { id: 402, symbol: 'KO', description: 'Coca Cola', group: 'USA Shares' },
  { id: 403, symbol: 'LBTYA', description: 'LIBERTY GLOBAL A', group: 'USA Shares' },
  { id: 404, symbol: 'LBTYK', description: 'Liberty Global PLC', group: 'USA Shares' },
  { id: 405, symbol: 'LLY', description: 'Eli Lilly and Co', group: 'USA Shares' },
  { id: 406, symbol: 'LMT', description: 'Lockheed Martin Corp', group: 'USA Shares' },
  { id: 407, symbol: 'LOW', description: 'Lowe\'s', group: 'USA Shares' },
  { id: 408, symbol: 'LRCX', description: 'LAM Research Corp', group: 'USA Shares' },
  { id: 409, symbol: 'LVS', description: 'LAS VEGAS SANDS', group: 'USA Shares' },
  { id: 410, symbol: 'LYFT', description: 'LYFT', group: 'USA Shares' },
  { id: 411, symbol: 'MA', description: 'MASTERCARD', group: 'USA Shares' },
  { id: 412, symbol: 'MAR', description: 'Marriott International Inc', group: 'USA Shares' },
  { id: 413, symbol: 'MCD', description: 'McDonald\'s Corp', group: 'USA Shares' },
  { id: 414, symbol: 'MELI', description: 'MercadoLibre Inc', group: 'USA Shares' },
  { id: 415, symbol: 'MET', description: 'METLIFE INC', group: 'USA Shares' },
  { id: 416, symbol: 'MMM', description: '3M Co', group: 'USA Shares' },
  { id: 417, symbol: 'MNST', description: 'Monster Beverage Corp', group: 'USA Shares' },
  { id: 418, symbol: 'MO', description: 'Altria Group', group: 'USA Shares' },
  { id: 419, symbol: 'MRK', description: 'Merck & Co Inc', group: 'USA Shares' },
  { id: 420, symbol: 'MS', description: 'Morgan Stanley', group: 'USA Shares' },
  { id: 421, symbol: 'MSFT', description: 'Microsoft Corp', group: 'USA Shares' },
  { id: 422, symbol: 'NFLX', description: 'NETFLIX INC', group: 'USA Shares' },
  { id: 423, symbol: 'NKE', description: 'NIKE INC CL B', group: 'USA Shares' },
  { id: 424, symbol: 'NTES', description: 'NetEase Inc', group: 'USA Shares' },
  { id: 425, symbol: 'NUS', description: 'Nu Skin Enterprises Inc', group: 'USA Shares' },
  { id: 426, symbol: 'NVDA', description: 'NVIDIA Corp', group: 'USA Shares' },
  { id: 427, symbol: 'ORLY', description: 'O Reilly Automotive Inc', group: 'USA Shares' },
  { id: 428, symbol: 'PEP', description: 'PEPSICO', group: 'USA Shares' },
  { id: 429, symbol: 'PFE', description: 'Pfizer Inc', group: 'USA Shares' },
  { id: 430, symbol: 'PG', description: 'PROCTER&GAMB', group: 'USA Shares' },
  { id: 431, symbol: 'PM', description: 'PHILIP MORRIS INTL', group: 'USA Shares' },
  { id: 432, symbol: 'PNC', description: 'PNC Financial Services Group Inc', group: 'USA Shares' },
  { id: 433, symbol: 'PRU', description: 'Prudential Financial Inc', group: 'USA Shares' },
  { id: 434, symbol: 'PYPL', description: 'PAYPAL Holdings Inc', group: 'USA Shares' },
  { id: 435, symbol: 'QCOM', description: 'QUALCOMM INC', group: 'USA Shares' },
  { id: 436, symbol: 'REGN', description: 'Regeneron Pharmaceuticals Inc.', group: 'USA Shares' },
  { id: 437, symbol: 'ROKU', description: 'ROKU Inc', group: 'USA Shares' },
  { id: 438, symbol: 'SBUX', description: 'STARBUX', group: 'USA Shares' },
  { id: 439, symbol: 'SIRI', description: 'Sirius XM Holding Inc', group: 'USA Shares' },
  { id: 440, symbol: 'SLB', description: 'SCHLUMBERGER LTD', group: 'USA Shares' },
  { id: 441, symbol: 'T', description: 'AT&T', group: 'USA Shares' },
  { id: 442, symbol: 'TGT', description: 'Target', group: 'USA Shares' },
  { id: 443, symbol: 'TMUS', description: 'T-Mobile US Inc', group: 'USA Shares' },
  { id: 444, symbol: 'TPR', description: 'TAPESTRY INC', group: 'USA Shares' },
  { id: 445, symbol: 'TRV', description: 'The Travelers Companies Inc', group: 'USA Shares' },
  { id: 446, symbol: 'TSLA', description: 'TESLA MOTORS INC', group: 'USA Shares' },
  { id: 447, symbol: 'TXN', description: 'Texas Instruments Inc', group: 'USA Shares' },
  { id: 448, symbol: 'ULTA', description: 'Ulta Beauty Inc', group: 'USA Shares' },
  { id: 449, symbol: 'UNH', description: 'United Health Group Inc', group: 'USA Shares' },
  { id: 450, symbol: 'UNP', description: 'Union Pacific Corp', group: 'USA Shares' },
  { id: 451, symbol: 'UPS', description: 'United Parcel Service Inc', group: 'USA Shares' },
  { id: 452, symbol: 'USB', description: 'US Bancorp', group: 'USA Shares' },
  { id: 453, symbol: 'V', description: 'VISA', group: 'USA Shares' },
  { id: 454, symbol: 'VOD', description: 'VODAFONE', group: 'USA Shares' },
  { id: 455, symbol: 'VRTX', description: 'Vertex Pharmaceuticals Inc', group: 'USA Shares' },
  { id: 456, symbol: 'VZ', description: 'VERIZON COMMUNICATIONS', group: 'USA Shares' },
  { id: 457, symbol: 'WBA', description: 'WALGREENS BOOTS ALLIANCE INC', group: 'USA Shares' },
  { id: 458, symbol: 'WDC', description: 'WESTERN DIGITAL', group: 'USA Shares' },
  { id: 459, symbol: 'WFC', description: 'Wells Fargo', group: 'USA Shares' },
  { id: 460, symbol: 'WMT', description: 'WAL-MART STORES', group: 'USA Shares' },
  { id: 461, symbol: 'WPM', description: 'SILVER WHEATON CORP', group: 'USA Shares' },
  { id: 462, symbol: 'SQM', description: 'Sociedad Qu�mica y Minera de Chile S.A', group: 'USA Shares' },
  { id: 463, symbol: 'WYNN', description: 'WYNN RESORTS', group: 'USA Shares' },
  { id: 464, symbol: 'XOM', description: 'EXXON MOBIL', group: 'USA Shares' },
  { id: 465, symbol: 'YUM', description: 'YUM! Brands Inc', group: 'USA Shares' },
  { id: 466, symbol: 'BABA', description: 'Alibaba Inc', group: 'USA Shares' },
  { id: 467, symbol: 'GLW', description: 'Corning Inc', group: 'USA Shares' },
  { id: 468, symbol: 'TIOUSD', description: 'TIO vs US Dollar', group: 'Crypto' },
  { id: 469, symbol: 'SHEL.UK', description: 'Shell PLC', group: 'UK Shares' },
  { id: 470, symbol: 'GBXUSD', description: 'GBP pence vs USD', group: 'Forex' }
]);

/**
 *
 * @param {string} symbol
 * @returns {string | null}
 */
export function getGroupForSymbol(symbol) {
  const symbolObj = CTRADER_SYMBOLS.find(
    (s) => s.symbol.includes(symbol) || symbol.includes(s.symbol)
  );
  return symbolObj ? symbolObj.group : null;
}
