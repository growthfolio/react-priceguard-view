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
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
      if (params?.symbol) queryParams.append('symbol', params.symbol);
      if (params?.alert_type) queryParams.append('alert_type', params.alert_type);
      if (params?.triggered !== undefined) queryParams.append('triggered', params.triggered.toString());

      const response = await apiClient(`api/alerts?${queryParams.toString()}`);
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar alertas");
      }
      
      return response;
    } catch (error) {
      console.error("Erro ao buscar alertas:", error);
      throw error;
    }
  },

  createAlert: async (alert: CreateAlertPayload): Promise<Alert> => {
    try {
      const response = await apiClient("api/alerts", {
        method: "POST",
        body: JSON.stringify(alert),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao criar alerta");
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao criar alerta:", error);
      throw error;
    }
  },

  updateAlert: async (id: string, alert: UpdateAlertPayload): Promise<Alert> => {
    try {
      const response = await apiClient(`api/alerts/${id}`, {
        method: "PUT",
        body: JSON.stringify(alert),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao atualizar alerta");
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar alerta:", error);
      throw error;
    }
  },

  deleteAlert: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient(`api/alerts/${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao excluir alerta");
      }

      return { success: true };
    } catch (error) {
      console.error("Erro ao excluir alerta:", error);
      throw error;
    }
  },

  getAlertStats: async (): Promise<AlertStatistics> => {
    try {
      const response = await apiClient("api/alerts/stats");

      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar estatísticas de alertas");
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estatísticas de alertas:", error);
      throw error;
    }
  },

  // Bulk operations
  enableAlerts: async (alertIds: string[]): Promise<{ success: boolean; updated_count: number }> => {
    try {
      const response = await apiClient("api/alerts/bulk-enable", {
        method: "POST",
        body: JSON.stringify({ alert_ids: alertIds }),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao habilitar alertas");
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao habilitar alertas:", error);
      throw error;
    }
  },

  disableAlerts: async (alertIds: string[]): Promise<{ success: boolean; updated_count: number }> => {
    try {
      const response = await apiClient("api/alerts/bulk-disable", {
        method: "POST",
        body: JSON.stringify({ alert_ids: alertIds }),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao desabilitar alertas");
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao desabilitar alertas:", error);
      throw error;
    }
  },

  deleteAlerts: async (alertIds: string[]): Promise<{ success: boolean; deleted_count: number }> => {
    try {
      const response = await apiClient("api/alerts/bulk-delete", {
        method: "POST",
        body: JSON.stringify({ alert_ids: alertIds }),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao excluir alertas");
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao excluir alertas:", error);
      throw error;
    }
  }
};
