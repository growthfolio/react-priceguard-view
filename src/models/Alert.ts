export interface Alert {
  id: string;
  user_id: string;
  symbol: string;
  alert_type: "price_above" | "price_below" | "volume_spike" | "price_change" | "technical_indicator";
  condition_value: number;
  condition_operator: ">" | "<" | ">=" | "<=" | "=";
  message?: string;
  is_active: boolean;
  triggered_at?: string;
  created_at: string;
  updated_at: string;
  
  // Campos opcionais para diferentes tipos de alerta
  timeframe?: "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
  indicator_type?: "RSI" | "MACD" | "SMA" | "EMA" | "BB" | "STOCH";
  indicator_period?: number;
  percentage_change?: number;
}

export interface CreateAlertPayload {
  symbol: string;
  alert_type: Alert["alert_type"];
  condition_value: number;
  condition_operator: Alert["condition_operator"];
  message?: string;
  timeframe?: Alert["timeframe"];
  indicator_type?: Alert["indicator_type"];
  indicator_period?: number;
  percentage_change?: number;
}

export interface UpdateAlertPayload extends Partial<CreateAlertPayload> {
  is_active?: boolean;
}

export interface AlertsParams {
  page?: number;
  limit?: number;
  symbol?: string;
  alert_type?: Alert["alert_type"];
  is_active?: boolean;
  triggered?: boolean;
}

export interface AlertsResponse {
  success: boolean;
  data: {
    alerts: Alert[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface AlertStatistics {
  success: boolean;
  data: {
    total_alerts: number;
    active_alerts: number;
    triggered_today: number;
    by_type: {
      [key in Alert["alert_type"]]: number;
    };
    by_symbol: {
      symbol: string;
      count: number;
    }[];
  };
}

export interface AlertTriggerEvent {
  alert_id: string;
  symbol: string;
  alert_type: Alert["alert_type"];
  condition_value: number;
  current_value: number;
  message: string;
  triggered_at: string;
}
