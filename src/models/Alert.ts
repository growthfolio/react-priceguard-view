export interface Alert {
  id: string;
  user_id?: string;
  symbol: string;
  alert_type: "price";
  condition_type: "above" | "below";
  target_value: number;
  timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
  condition_value?: number;
  condition_operator?: ">" | "<" | "=" | null | ">=" | "<=";
  message?: string;
  enabled: boolean;
  notify_via: ("app" | "email" | "sms")[];
  triggered_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateAlertPayload {
  symbol: string;
  alert_type: "price";
  condition_type: "above" | "below";
  target_value: number;
  timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
  notify_via: ("app" | "email" | "sms")[];
}

export interface UpdateAlertPayload {
  enabled?: boolean;
  target_value?: number;
  condition_type?: "above" | "below";
  timeframe?: "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
  notify_via?: ("app" | "email" | "sms")[];
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
