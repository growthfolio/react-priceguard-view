// Application Constants
export const APP_NAME = 'PriceGuard';
export const APP_VERSION = process.env.REACT_APP_VERSION || '0.1.0';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
export const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    GOOGLE_LOGIN: '/auth/google',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
  },
  // User Management
  USER: {
    PROFILE: '/api/user/profile',
    SETTINGS: '/api/user/settings',
    PREFERENCES: '/api/user/preferences',
  },
  // Alerts
  ALERTS: {
    LIST: '/api/alerts',
    CREATE: '/api/alerts',
    UPDATE: (id: string) => `/api/alerts/${id}`,
    DELETE: (id: string) => `/api/alerts/${id}`,
    TOGGLE: (id: string) => `/api/alerts/${id}/toggle`,
  },
  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: '/api/notifications/read-all',
    DELETE: (id: string) => `/api/notifications/${id}`,
  },
  // Crypto Data
  CRYPTO: {
    LIST: '/api/crypto',
    DETAILS: (symbol: string) => `/api/crypto/${symbol}`,
    HISTORY: (symbol: string) => `/api/crypto/${symbol}/history`,
    INDICATORS: (symbol: string) => `/api/crypto/${symbol}/indicators`,
  },
  // Dashboard
  DASHBOARD: {
    OVERVIEW: '/api/dashboard/overview',
    STATS: '/api/dashboard/stats',
    RECENT_ACTIVITY: '/api/dashboard/activity',
  },
} as const;

// Authentication
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
export const SKIP_AUTH = process.env.REACT_APP_SKIP_AUTH === 'true';

// Storage Keys
export const STORAGE_KEYS = {
  // Authentication
  TOKEN: 'priceGuard_auth_token',
  REFRESH_TOKEN: 'priceGuard_refresh_token',
  USER: 'priceGuard_user_data',
  
  // User Preferences
  PREFERENCES: 'priceGuard_user_preferences',
  THEME: 'priceGuard_app_theme',
  LANGUAGE: 'priceGuard_language',
  
  // Settings
  NOTIFICATION_SETTINGS: 'priceGuard_notification_settings',
  AUDIO_CONFIG: 'priceGuard_audioConfig',
  DASHBOARD_CONFIG: 'priceGuard_dashboard_config',
  
  // Cache
  CRYPTO_CACHE: 'priceGuard_crypto_cache',
  ALERTS_CACHE: 'priceGuard_alerts_cache',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ALERTS: '/alerts',
  NOTIFICATIONS: '/notifications',
  TRADING: '/trading',
  MARKET: '/market',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// WebSocket Events
export const WS_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // Data Updates
  CRYPTO_DATA_UPDATE: 'crypto_data_update',
  PRICE_UPDATE: 'price_update',
  MARKET_DATA: 'market_data',
  
  // Alerts & Notifications
  ALERT_TRIGGERED: 'alert_triggered',
  NOTIFICATION_NEW: 'notification_new',
  
  // User Events
  USER_SETTINGS_UPDATED: 'user_settings_updated',
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

// Default User Settings
export const DEFAULT_USER_SETTINGS = {
  theme: 'dark' as const,
  language: 'pt-BR' as const,
  default_timeframe: '1h' as const,
  currency_preference: 'USD' as const,
  notifications_enabled: true,
  email_notifications: true,
  push_notifications: true,
  sound_enabled: true,
  vibration_enabled: true,
} as const;

// Theme Configuration
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Supported Languages
export const LANGUAGES = {
  'pt-BR': 'Português (Brasil)',
  'en-US': 'English (US)',
  'es-ES': 'Español',
} as const;

// Alert Priorities
export const ALERT_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  ALERT: 'alert',
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  CRYPTO_DATA_TTL: 30 * 1000, // 30 seconds
  ALERTS_TTL: 5 * 60 * 1000, // 5 minutes
  USER_DATA_TTL: 15 * 60 * 1000, // 15 minutes
  MAX_CACHE_SIZE: 100, // Maximum number of cached items
} as const;
