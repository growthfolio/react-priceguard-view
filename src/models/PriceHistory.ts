export interface PriceHistory {
  symbol: string;
  timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  
  // Campos calculados opcionais
  change?: number;
  change_percent?: number;
  vwap?: number; // Volume Weighted Average Price
}

export interface PriceHistoryParams {
  symbols: string[];
  timeframe: PriceHistory["timeframe"];
  start_date?: string; // ISO string
  end_date?: string;   // ISO string
  limit?: number;
  include_volume?: boolean;
  include_indicators?: boolean;
}

export interface PriceHistoryResponse {
  success: boolean;
  data: {
    symbol: string;
    timeframe: PriceHistory["timeframe"];
    candles: PriceHistory[];
    total: number;
    start_date: string;
    end_date: string;
  };
}

export interface MultiSymbolPriceHistoryResponse {
  success: boolean;
  data: {
    timeframe: PriceHistory["timeframe"];
    symbols: {
      [symbol: string]: {
        candles: PriceHistory[];
        total: number;
      };
    };
    start_date: string;
    end_date: string;
  };
}

export interface LatestPriceData {
  symbol: string;
  price: number;
  change_24h: number;
  change_percent_24h: number;
  volume_24h: number;
  market_cap?: number;
  last_updated: string;
  
  // Dados de ordem book (se disponível)
  bid?: number;
  ask?: number;
  spread?: number;
}

export interface LatestPricesResponse {
  success: boolean;
  data: {
    prices: LatestPriceData[];
    last_updated: string;
  };
}

// Para dados de preço em tempo real via WebSocket
export interface RealtimePriceUpdate {
  type: "price_update";
  data: {
    symbol: string;
    price: number;
    change: number;
    change_percent: number;
    volume: number;
    timestamp: string;
  };
}

export interface PriceStatistics {
  symbol: string;
  period: "24h" | "7d" | "30d" | "1y";
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  average_volume: number;
  volatility: number;
  correlation_btc?: number;
}

export interface PriceStatisticsResponse {
  success: boolean;
  data: {
    statistics: PriceStatistics[];
    calculated_at: string;
  };
}
