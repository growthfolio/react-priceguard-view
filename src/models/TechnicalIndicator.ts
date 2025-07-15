export interface TechnicalIndicator {
  symbol: string;
  timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
  timestamp: string;
  
  // Indicadores de momentum
  rsi?: {
    period: number;
    value: number;
    signal: "oversold" | "overbought" | "neutral";
  };
  
  // Médias móveis
  sma?: {
    period: number;
    value: number;
  };
  
  ema?: {
    period: number;
    value: number;
  };
  
  // MACD
  macd?: {
    macd_line: number;
    signal_line: number;
    histogram: number;
    signal: "bullish" | "bearish" | "neutral";
  };
  
  // Bollinger Bands
  bollinger_bands?: {
    upper: number;
    middle: number;
    lower: number;
    position: "above_upper" | "below_lower" | "within_bands";
  };
  
  // Stochastic
  stochastic?: {
    k_percent: number;
    d_percent: number;
    signal: "oversold" | "overbought" | "neutral";
  };
  
  // Volume indicators
  volume_sma?: {
    period: number;
    value: number;
    current_volume: number;
    volume_ratio: number;
  };
  
  // Suporte e resistência
  support_resistance?: {
    support_levels: number[];
    resistance_levels: number[];
    current_price: number;
  };
}

export interface IndicatorParams {
  symbols: string[];
  timeframes?: TechnicalIndicator["timeframe"][];
  indicators?: ("rsi" | "sma" | "ema" | "macd" | "bollinger" | "stochastic" | "volume")[];
  periods?: Record<string, number>; // Ex: { "rsi": 14, "sma": 20 }
}

export interface IndicatorsResponse {
  success: boolean;
  data: {
    indicators: TechnicalIndicator[];
    calculated_at: string;
  };
}

export interface IndicatorSignal {
  symbol: string;
  indicator_type: "rsi" | "macd" | "bollinger" | "stochastic";
  signal_type: "buy" | "sell" | "neutral";
  strength: "weak" | "medium" | "strong";
  description: string;
  timestamp: string;
}

export interface IndicatorSignalsResponse {
  success: boolean;
  data: {
    signals: IndicatorSignal[];
    generated_at: string;
  };
}

// Para configurações personalizadas de indicadores
export interface IndicatorSettings {
  rsi_period: number;
  rsi_oversold: number;
  rsi_overbought: number;
  sma_periods: number[];
  ema_periods: number[];
  macd_fast: number;
  macd_slow: number;
  macd_signal: number;
  bb_period: number;
  bb_std_dev: number;
  stoch_k_period: number;
  stoch_d_period: number;
}

export interface UpdateIndicatorSettingsPayload extends Partial<IndicatorSettings> {}
