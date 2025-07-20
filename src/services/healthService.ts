import { apiClient } from "./apiClient";

export const healthService = {
  /**
   * Health check
   */
  getHealth: async (): Promise<any> => {
    try {
      const response = await apiClient.get("/health");
      return response.data;
    } catch (error) {
      return { status: "error" };
    }
  },

  /**
   * Metrics
   */
  getMetrics: async (): Promise<any> => {
    try {
      const response = await apiClient.get("/metrics");
      return response.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * Ready check
   */
  getReady: async (): Promise<any> => {
    try {
      const response = await apiClient.get("/health/ready");
      return response.data;
    } catch (error) {
      return { ready: false };
    }
  },
};
