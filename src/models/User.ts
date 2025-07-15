export interface User {
  id: string;
  google_id: string;
  email: string;
  name: string;
  picture?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  settings?: UserSettings;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: "dark" | "light" | "system";
  default_timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
  default_view: "overview" | "detailed" | "compact";
  notifications_email: boolean;
  notifications_push: boolean;
  notifications_sms: boolean;
  risk_profile: "conservative" | "moderate" | "aggressive";
  favorite_symbols: string[];
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: "Bearer";
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface RefreshResponse {
  success: boolean;
  data: AuthTokens;
}
