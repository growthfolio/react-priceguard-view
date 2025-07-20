export interface HealthStatus {
  status: string;
  uptime?: number;
  version?: string;
}

export interface Metrics {
  [key: string]: number | string;
}

export interface ReadyStatus {
  ready: boolean;
  details?: string;
}
