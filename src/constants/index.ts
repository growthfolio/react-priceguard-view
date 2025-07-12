// Application Constants
export const APP_NAME = 'PriceGuard';
export const APP_VERSION = process.env.REACT_APP_VERSION || '0.1.0';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
export const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws/dashboard';

// Authentication
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
export const SKIP_AUTH = process.env.REACT_APP_SKIP_AUTH === 'true';

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  PREFERENCES: 'user_preferences',
  THEME: 'app_theme',
} as const;

// Routes
export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  PROFILE: '/profile',
  MARKET: '/market',
  DASHBOARD: '/dashboard',
} as const;

// WebSocket Events
export const WS_EVENTS = {
  CRYPTO_DATA_UPDATE: 'crypto_data_update',
  ALERT_TRIGGERED: 'alert_triggered',
  CONNECTION_STATUS: 'connection_status',
} as const;

// Timeframes
export const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d'] as const;

// Market Types
export const MARKET_TYPES = {
  SPOT: 'spot',
  FUTURES: 'futures',
  OPTIONS: 'options',
} as const;

// Toast Configuration
export const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;
