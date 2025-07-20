import { apiClient } from "./apiClient";

export const statusService = {
  /**
   * Health check endpoint
   */
  health: async (): Promise<{ success: boolean; status: string }> => {
    try {
      const response = await apiClient.get("/health");
      return { success: response.success, status: response.data?.status || "unknown" };
    } catch (error) {
      return { success: false, status: "error" };
    }
  },

  /**
   * Metrics endpoint
   */
  metrics: async (): Promise<any> => {
    try {
      const response = await apiClient.get("/metrics");
      return response.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * Ready check endpoint
   */
  ready: async (): Promise<{ success: boolean; ready: boolean }> => {
    try {
      const response = await apiClient.get("/health/ready");
      return { success: response.success, ready: response.data?.ready || false };
    } catch (error) {
      return { success: false, ready: false };
    }
  }
};
