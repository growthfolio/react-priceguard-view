export interface Notification {
  id: string;
  user_id: string;
  alert_id?: string;
  title: string;
  message: string;
  notification_type: "alert_triggered" | "system" | "security" | "price_update" | "info";
  read_at?: string | null;
  created_at: string;
}

export interface CreateNotificationPayload {
  type: Notification["notification_type"];
  title: string;
  message: string;
  data?: Record<string, any>;
  alert_id?: string;
  symbol?: string;
  price?: number;
}

export interface NotificationsParams {
  page?: number;
  limit?: number;
  type?: Notification["notification_type"];
  is_read?: boolean;
  symbol?: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    unread_count: number;
  };
}

export interface MarkAsReadPayload {
  notification_ids: string[];
}

export interface NotificationSettings {
  email_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  alert_notifications: boolean;
  system_notifications: boolean;
  price_notifications: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

export interface NotificationPreferences {
  success: boolean;
  data: NotificationSettings;
}

// Para notificações em tempo real via WebSocket
export interface RealtimeNotification {
  type: "new_notification";
  data: Notification;
}
