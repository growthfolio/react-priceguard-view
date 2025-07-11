import { CryptoRow } from "../dashboards/CryptoRow";
import { CryptoData } from "./CryptoData";


interface RawCryptoData {
  dashboardData: {
    id: number;
    symbol: string;
    marketType: string;
    imgurl: string;
    active: boolean;
  };
  priceChange_1m: string;
  priceChange_5m: string;
  priceChange_15m: string;
  priceChange_1h: string;
  priceChange_1d: string;
  pullbackEntry_5m: string | null;
  pullbackEntry_15m: string | null;
  pullbackEntry_1h: string | null;
  pullbackEntry_4h: string | null;
  pullbackEntry_1d: string | null;
  superTrend4h_5m: string | null;
  superTrend4h_15m: string | null;
  superTrend4h_1h: string | null;
  trueRange_1m: string;
  trueRange_5m: string;
  trueRange_15m: string;
  trueRange_1h: string;
  rsi_5m: string;
  rsi_15m: string;
  rsi_1h: string;
  rsi_4h: string;
  rsi_1d: string;
  ematrend_15m: string;
  ematrend_1h: string;
  ematrend_4h: string;
  ematrend_1d: string;
}

export const normalizeCryptoData = (rawData: RawCryptoData): CryptoData =>{
  return {
    dashboardData: {
      id: rawData.dashboardData?.id ?? 0,
      symbol: rawData.dashboardData?.symbol || "Unknown",
      marketType: rawData.dashboardData?.marketType || "Unknown",
      imgurl: rawData.dashboardData?.imgurl || "",
      active: rawData.dashboardData?.active || false,
    },
    priceChange_1m: rawData.priceChange_1m || "0.00%",
    priceChange_5m: rawData.priceChange_5m || "0.00%",
    priceChange_15m: rawData.priceChange_15m || "0.00%",
    priceChange_1h: rawData.priceChange_1h || "0.00%",
    priceChange_1d: rawData.priceChange_1d || "0.00%",
    pullbackEntry_5m: rawData.pullbackEntry_5m || null,
    pullbackEntry_15m: rawData.pullbackEntry_15m || null,
    pullbackEntry_1h: rawData.pullbackEntry_1h || null,
    pullbackEntry_4h: rawData.pullbackEntry_4h || null,
    pullbackEntry_1d: rawData.pullbackEntry_1d || null,
    superTrend4h_5m: rawData.superTrend4h_5m || null,
    superTrend4h_15m: rawData.superTrend4h_15m || null,
    superTrend4h_1h: rawData.superTrend4h_1h || null,
    trueRange_1m: rawData.trueRange_1m || "0.00%",
    trueRange_5m: rawData.trueRange_5m || "0.00%",
    trueRange_15m: rawData.trueRange_15m || "0.00%",
    trueRange_1h: rawData.trueRange_1h || "0.00%",
    rsi_5m: rawData.rsi_5m || "0<[50]",
    rsi_15m: rawData.rsi_15m || "0<[50]",
    rsi_1h: rawData.rsi_1h || "0<[50]",
    rsi_4h: rawData.rsi_4h || "0<[50]",
    rsi_1d: rawData.rsi_1d || "0<[50]",
    ematrend_15m: rawData.ematrend_15m || "Unknown",
    ematrend_1h: rawData.ematrend_1h || "Unknown",
    ematrend_4h: rawData.ematrend_4h || "Unknown",
    ematrend_1d: rawData.ematrend_1d || "Unknown",
  };
};

export const transformToCryptoRow = (data: CryptoData): CryptoRow => {
  const extractRsiValue = (rsi: string): number => {
    const { value } = parseRsi(rsi); // Usa o parser para extrair o valor
    return value;
  }
  return {
    id: data.dashboardData.id,
    symbol: data.dashboardData.symbol,
    rawSymbol: removeUSDT(data.dashboardData.symbol),
    marketType: data.dashboardData.marketType,
    imgurl: adjustImageUrl(data.dashboardData.imgurl || ""),
    active: data.dashboardData.active,
    priceChange_1m: data.priceChange_1m,
    priceChange_5m: data.priceChange_5m,
    priceChange_15m: data.priceChange_15m,
    priceChange_1h: data.priceChange_1h,
    priceChange_1d: data.priceChange_1d,
    pullbackEntry_5m: data.pullbackEntry_5m,
    pullbackEntry_15m: data.pullbackEntry_15m,
    pullbackEntry_1h: data.pullbackEntry_1h,
    pullbackEntry_4h: data.pullbackEntry_4h,
    pullbackEntry_1d: data.pullbackEntry_1d,
    superTrend4h_5m: data.superTrend4h_5m,
    superTrend4h_15m: data.superTrend4h_15m,
    superTrend4h_1h: data.superTrend4h_1h,
    trueRange_1m: data.trueRange_1m,
    trueRange_5m: data.trueRange_5m,
    trueRange_15m: data.trueRange_15m,
    trueRange_1h: data.trueRange_1h,
    rsi_5m: extractRsiValue(data.rsi_5m),
    rsi_15m: extractRsiValue(data.rsi_15m),
    rsi_1h: extractRsiValue(data.rsi_1h),
    rsi_4h: extractRsiValue(data.rsi_4h),
    rsi_1d: extractRsiValue(data.rsi_1d),
    ematrend_15m: data.ematrend_15m,
    ematrend_1h: data.ematrend_1h,
    ematrend_4h: data.ematrend_4h,
    ematrend_1d: data.ematrend_1d,
    bot: 'yes',
    market: 'Binance',
  };
};

const removeUSDT = (symbol: string): string => {
  if (symbol.includes("USDT")) {
    return symbol.replace("USDT", "");
  }
  else if (symbol.includes("USDC")) {
    return symbol.replace("USDC", "");
  }
  else if (symbol.includes("USD")) {
    return symbol.replace("USD", "");
  }
  else return symbol;

  }

// Func Ajustment Image URL
const adjustImageUrl = (url: string): string => {
  return url.replace(/USDT(?=\.\w+$)/, '');
};

// RSI PARSERS
const parseRsi = (rsi: string): { value: number; comparison: string; threshold: number } => {
  const match = rsi.match(/^([\d.]+)([<>])\[(\d+)]$/);
  if (!match) {
    return { value: 0, comparison: "<", threshold: 50 };
  }
  const [, value, comparison, threshold] = match;
  return {
    value: parseFloat(value),
    comparison,
    threshold: parseInt(threshold, 10),
    // Saída: { value: 46.92, comparison: "<", threshold: 50 }
  };
};

