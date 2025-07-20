import { apiClient } from "./apiClient";

export const indicatorService = {
  /**
   * Calcula RSI para um símbolo
   */
  calculateRSI: async (symbol: string, timeframe = "1h", period = 14): Promise<any> => {
    try {
      const response = await apiClient.post(`/api/indicators/${symbol}/rsi`, { timeframe, period });
      if (!response.success || !response.data) throw new Error(response.error || "Falha ao calcular RSI");
      return response.data;
    } catch (error) {
      console.error("Erro ao calcular RSI:", error);
      throw error;
    }
  },

  /**
   * Calcula EMA para um símbolo
   */
  calculateEMA: async (symbol: string, timeframe = "1h", period = 21): Promise<any> => {
    try {
      const response = await apiClient.post(`/api/indicators/${symbol}/ema`, { timeframe, period });
      if (!response.success || !response.data) throw new Error(response.error || "Falha ao calcular EMA");
      return response.data;
    } catch (error) {
      console.error("Erro ao calcular EMA:", error);
      throw error;
    }
  },

  /**
   * Busca últimos indicadores calculados
   */
  getLatestIndicators: async (symbol: string, timeframe = "1h"): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/indicators/${symbol}/latest?timeframe=${timeframe}`);
      if (!response.success || !response.data) throw new Error(response.error || "Falha ao buscar últimos indicadores");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar últimos indicadores:", error);
      throw error;
    }
  },
};
