import { apiClient } from "./apiClient";
import { 
  Alert, 
  CreateAlertPayload, 
  UpdateAlertPayload, 
  AlertStatistics, 
  AlertsResponse, 
  AlertsParams 
} from "../models/Alert";

export const alertService = {
  getAlerts: async (params?: AlertsParams): Promise<AlertsResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.symbol) queryParams.append("symbol", params.symbol);
      if (params?.alert_type) queryParams.append("alert_type", params.alert_type);
      if (params?.is_active !== undefined) queryParams.append("is_active", params.is_active.toString());
      if (params?.triggered !== undefined) queryParams.append("triggered", params.triggered.toString());
      const response = await apiClient.get(`/api/alerts?${queryParams.toString()}`);
      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar alertas");
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar alertas:", error);
      throw error;
    }
  },

  createAlert: async (alertData: CreateAlertPayload): Promise<Alert> => {
    try {
      const response = await apiClient.post(`/api/alerts`, alertData);
      if (!response.success) {
        throw new Error(response.error || "Falha ao criar alerta");
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao criar alerta:", error);
      throw error;
    }
  },

  updateAlert: async (alertId: string, alertData: UpdateAlertPayload): Promise<Alert> => {
    try {
      const response = await apiClient.put(`/api/alerts/${alertId}`, alertData);
      if (!response.success) {
        throw new Error(response.error || "Falha ao atualizar alerta");
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar alerta:", error);
      throw error;
    }
  },

  deleteAlert: async (alertId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete(`/api/alerts/${alertId}`);
      if (!response.success) {
        throw new Error(response.error || "Falha ao excluir alerta");
      }
      return { success: response.success, message: response.data?.message || '' };
    } catch (error) {
      console.error("Erro ao excluir alerta:", error);
      throw error;
    }
  },

  getAlertStats: async (): Promise<AlertStatistics> => {
    try {
      const response = await apiClient.get<AlertStatistics>("/api/alerts/stats");
      
      if (!response.success || !response.data) {
        throw new Error(response.error || "Falha ao buscar estatísticas");
      }
      
      return response.data as AlertStatistics;
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw error;
    }
  },

  // Bulk operations
  enableAlerts: async (alertIds: string[]): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.post<{ success: boolean; error?: string }>("/api/alerts/bulk/enable", {
        alert_ids: alertIds
      });
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao ativar alertas");
      }
      
      return response;
    } catch (error) {
      console.error("Erro ao ativar alertas:", error);
      throw error;
    }
  },

  disableAlerts: async (alertIds: string[]): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.post<{ success: boolean; error?: string }>("/api/alerts/bulk/disable", {
        alert_ids: alertIds
      });
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao desativar alertas");
      }
      
      return response;
    } catch (error) {
      console.error("Erro ao desativar alertas:", error);
      throw error;
    }
  },

  deleteAlerts: async (alertIds: string[]): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.post<{ success: boolean; error?: string }>("/api/alerts/bulk/delete", {
        alert_ids: alertIds
      });
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao excluir alertas");
      }
      
      return response;
    } catch (error) {
      console.error("Erro ao excluir alertas:", error);
      throw error;
    }
  }
};
