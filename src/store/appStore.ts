/**
 * Global Application Store
 * Uses Zustand for lightweight state management
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Alert } from '../models/Alert';
import { Notification } from '../models/Notification';
import { CryptoData } from '../models/crypto/CryptoData';

// Application State Interface
interface AppState {
  // UI State
  sidebarOpen: boolean;
  loading: boolean;
  error: string | null;
  
  // Data State
  alerts: Alert[];
  notifications: Notification[];
  cryptoData: CryptoData[];
  
  // Cache State
  lastDataFetch: Record<string, number>;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Data Actions
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  removeAlert: (id: string) => void;
  
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  removeNotification: (id: string) => void;
  
  setCryptoData: (data: CryptoData[]) => void;
  updateCryptoPrice: (symbol: string, price: number) => void;
  
  // Cache Actions
  setLastDataFetch: (key: string, timestamp: number) => void;
  getLastDataFetch: (key: string) => number;
  
  // Reset Actions
  reset: () => void;
}

// Initial State
const initialState = {
  sidebarOpen: false,
  loading: false,
  error: null,
  alerts: [],
  notifications: [],
  cryptoData: [],
  lastDataFetch: {},
};

// Create Store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // UI Actions
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        // Alert Actions
        setAlerts: (alerts) => set({ alerts }),
        addAlert: (alert) => set((state) => ({ 
          alerts: [...state.alerts, alert] 
        })),
        updateAlert: (id, updates) => set((state) => ({
          alerts: state.alerts.map(alert => 
            alert.id === id ? { ...alert, ...updates } : alert
          )
        })),
        removeAlert: (id) => set((state) => ({
          alerts: state.alerts.filter(alert => alert.id !== id)
        })),

        // Notification Actions
        setNotifications: (notifications) => set({ notifications }),
        addNotification: (notification) => set((state) => ({ 
          notifications: [notification, ...state.notifications] 
        })),
        markNotificationRead: (id) => set((state) => ({
          notifications: state.notifications.map(notification => 
            notification.id === id 
              ? { ...notification, is_read: true } 
              : notification
          )
        })),
        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter(notification => notification.id !== id)
        })),

        // Crypto Data Actions
        setCryptoData: (data) => set({ cryptoData: data }),
        updateCryptoPrice: (symbol, price) => set((state) => ({
          cryptoData: state.cryptoData.map(crypto =>
            crypto.dashboardData.symbol === symbol 
              ? { 
                  ...crypto, 
                  current_price: price,
                  last_updated: new Date().toISOString()
                } 
              : crypto
          )
        })),

        // Cache Actions
        setLastDataFetch: (key, timestamp) => set((state) => ({
          lastDataFetch: { ...state.lastDataFetch, [key]: timestamp }
        })),
        getLastDataFetch: (key) => get().lastDataFetch[key] || 0,

        // Reset
        reset: () => set(initialState),
      }),
      {
        name: 'priceguard-app-store', // Storage key
        partialize: (state) => ({
          // Only persist certain parts of the state
          sidebarOpen: state.sidebarOpen,
          lastDataFetch: state.lastDataFetch,
        }),
      }
    ),
    {
      name: 'PriceGuard App Store', // DevTools name
    }
  )
);

// Selectors for better performance
export const useAlerts = () => useAppStore((state) => state.alerts);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useCryptoData = () => useAppStore((state) => state.cryptoData);
export const useAppLoading = () => useAppStore((state) => state.loading);
export const useAppError = () => useAppStore((state) => state.error);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);

// Computed selectors
export const useUnreadNotifications = () => 
  useAppStore((state) => state.notifications.filter(n => !n.read_at));

export const useActiveAlerts = () => 
  useAppStore((state) => state.alerts.filter(a => a.enabled));

export const useCryptoBySymbol = (symbol: string) =>
  useAppStore((state) => state.cryptoData.find(c => c.dashboardData.symbol === symbol));

export default useAppStore;
