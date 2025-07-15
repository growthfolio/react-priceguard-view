import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ToastNotification } from '../components/notifications/NotificationToast';
import { BannerNotification } from '../components/notifications/NotificationBanner';
import { useWebSocket } from './WebSocketContext';
import { Notification } from '../models/Notification';
import { audioService } from '../services/audioService';

interface NotificationContextType {
  // Toast notifications
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Banner notifications
  banners: BannerNotification[];
  addBanner: (banner: Omit<BannerNotification, 'id'>) => string;
  removeBanner: (id: string) => void;
  clearBanners: () => void;
  
  // Notification badge count
  unreadCount: number;
  
  // Settings
  settings: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  
  // Helper methods
  showSuccess: (title: string, message: string, options?: Partial<ToastNotification>) => string;
  showError: (title: string, message: string, options?: Partial<ToastNotification>) => string;
  showWarning: (title: string, message: string, options?: Partial<ToastNotification>) => string;
  showInfo: (title: string, message: string, options?: Partial<ToastNotification>) => string;
}

interface NotificationSettings {
  enableSound: boolean;
  enableVibration: boolean;
  enableToasts: boolean;
  enableBanners: boolean;
  toastDuration: number;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts: number;
}

const defaultSettings: NotificationSettings = {
  enableSound: true,
  enableVibration: true,
  enableToasts: true,
  enableBanners: true,
  toastDuration: 5000,
  position: 'top-right',
  maxToasts: 5
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [banners, setBanners] = useState<BannerNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const webSocket = useWebSocket();

  // Generate unique ID
  const generateId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }, []);

  // Play notification sound
  // Play notification sound and vibration
  const playNotificationEffects = useCallback(async (type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    if (settings.enableSound) {
      await audioService.playNotificationSound(type);
    }
    
    if (settings.enableVibration) {
      audioService.vibrate([100, 50, 100]);
    }
  }, [settings.enableSound, settings.enableVibration]);

  // Toast management
  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    if (!settings.enableToasts) return '';
    
    const id = generateId();
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration ?? settings.toastDuration
    };

    setToasts(prev => {
      const updated = [...prev, newToast];
      // Limit number of toasts
      if (updated.length > settings.maxToasts) {
        return updated.slice(-settings.maxToasts);
      }
      return updated;
    });

    // Play sound and vibration for important notifications (async, but don't wait)
    if (toast.type === 'error' || toast.type === 'warning') {
      playNotificationEffects(toast.type);
    }

    return id;
  }, [settings, generateId, playNotificationEffects]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Banner management
  const addBanner = useCallback((banner: Omit<BannerNotification, 'id'>) => {
    if (!settings.enableBanners) return '';
    
    const id = generateId();
    const newBanner: BannerNotification = {
      ...banner,
      id
    };

    setBanners(prev => [...prev, newBanner]);
    return id;
  }, [settings.enableBanners, generateId]);

  const removeBanner = useCallback((id: string) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
  }, []);

  const clearBanners = useCallback(() => {
    setBanners([]);
  }, []);

  // Settings management
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    // Save to localStorage
    const updatedSettings = { ...settings, ...newSettings };
    localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
  }, [settings]);

  // Helper methods
  const showSuccess = useCallback((title: string, message: string, options?: Partial<ToastNotification>) => {
    return addToast({ type: 'success', title, message, ...options });
  }, [addToast]);

  const showError = useCallback((title: string, message: string, options?: Partial<ToastNotification>) => {
    return addToast({ type: 'error', title, message, ...options });
  }, [addToast]);

  const showWarning = useCallback((title: string, message: string, options?: Partial<ToastNotification>) => {
    return addToast({ type: 'warning', title, message, ...options });
  }, [addToast]);

  const showInfo = useCallback((title: string, message: string, options?: Partial<ToastNotification>) => {
    return addToast({ type: 'info', title, message, ...options });
  }, [addToast]);

  // Load settings from localStorage and initialize audio service on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Could not parse saved notification settings:', error);
      }
    }

    // Initialize audio service
    audioService.initialize().catch(error => {
      console.warn('Failed to initialize audio service:', error);
    });
  }, []);

  // Listen to WebSocket notifications
  useEffect(() => {
    if (!webSocket.notifications.length) return;

    const latestNotification = webSocket.notifications[webSocket.notifications.length - 1];
    
    // Convert WebSocket notification to toast
    const toastType = (() => {
      switch (latestNotification.priority) {
        case 'high': return 'error';
        case 'medium': return 'warning';
        case 'low': return 'info';
        default: return 'info';
      }
    })();

    addToast({
      type: toastType,
      title: 'Nova Notificação',
      message: latestNotification.message,
      action: {
        label: 'Ver',
        onClick: () => {
          // Navigate to notifications page
          window.location.href = '/notifications';
        }
      }
    });

    // Update unread count
    setUnreadCount(webSocket.notifications.filter(n => !n.is_read).length);
  }, [webSocket.notifications, addToast]);

  const contextValue: NotificationContextType = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    banners,
    addBanner,
    removeBanner,
    clearBanners,
    unreadCount,
    settings,
    updateSettings,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
