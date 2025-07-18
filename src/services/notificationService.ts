import { apiClient } from "./apiClient";
import { 
  Notification, 
  NotificationsResponse, 
  NotificationsParams,
  MarkAsReadPayload,
  NotificationPreferences,
  NotificationSettings
} from "../models/Notification";

export const notificationService = {
  getNotifications: async (params?: NotificationsParams): Promise<NotificationsResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.is_read !== undefined) queryParams.append('is_read', params.is_read.toString());
      if (params?.type) queryParams.append('type', params.type);
      if (params?.priority) queryParams.append('priority', params.priority);
      if (params?.symbol) queryParams.append('symbol', params.symbol);

      const response = await apiClient(`api/notifications?${queryParams.toString()}`);
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar notificações");
      }
      
      return response;
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      throw error;
    }
  },

  markAsRead: async (notificationIds: string[]): Promise<{ success: boolean; updated_count: number }> => {
    try {
      const response = await apiClient.get("api/notifications/mark-read", {
        method: "POST",
        body: JSON.stringify({ notification_ids: notificationIds }),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao marcar notificações como lidas");
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
      throw error;
    }
  },

  markAllAsRead: async (): Promise<{ success: boolean; updated_count: number }> => {
    try {
      const response = await apiClient.get("api/notifications/mark-all-read", {
        method: "POST",
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao marcar todas as notificações como lidas");
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao marcar todas as notificações como lidas:", error);
      throw error;
    }
  },

  deleteNotification: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient(`api/notifications/${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao excluir notificação");
      }

      return { success: true };
    } catch (error) {
      console.error("Erro ao excluir notificação:", error);
      throw error;
    }
  },

  deleteNotifications: async (notificationIds: string[]): Promise<{ success: boolean; deleted_count: number }> => {
    try {
      const response = await apiClient.get("api/notifications/bulk-delete", {
        method: "POST",
        body: JSON.stringify({ notification_ids: notificationIds }),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao excluir notificações");
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao excluir notificações:", error);
      throw error;
    }
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get("api/notifications/unread-count");
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar contagem de não lidas");
      }
      
      return response.data.count;
    } catch (error) {
      console.error("Erro ao buscar contagem de notificações não lidas:", error);
      return 0;
    }
  }
};
