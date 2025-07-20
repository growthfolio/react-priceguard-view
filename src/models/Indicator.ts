export interface IndicatorCalculationRequest {
  timeframe: string;
  period: number;
}

export interface IndicatorCalculationResponse {
  symbol: string;
  timeframe: string;
  indicator: string;
  value: number;
  period: number;
  calculated_at: string;
}

export interface LatestIndicatorResponse {
  symbol: string;
  timeframe: string;
  indicators: Record<string, any>;
  updated_at: string;
}
