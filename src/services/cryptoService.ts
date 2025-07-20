import { apiClient } from "./apiClient";
import {
  LatestPricesResponse,
  PriceHistoryResponse,
  MultiSymbolPriceHistoryResponse,
  PriceHistoryParams,
  PriceStatisticsResponse,
  LatestPriceData,
} from "../models/PriceHistory";
import {
  IndicatorsResponse,
  IndicatorSignalsResponse,
  IndicatorParams,
} from "../models/TechnicalIndicator";

export interface CryptoMarketParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "rank" | "price" | "volume" | "change_24h" | "name";
  sort_direction?: "asc" | "desc";
  favorites_only?: boolean;
}

export interface CryptoMarketResponse {
  success: boolean;
  data: {
    cryptos: LatestPriceData[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export const cryptoService = {
  /**
   * Busca dados de mercado de criptomoedas
   */
  getMarketData: async (params?: CryptoMarketParams): Promise<CryptoMarketResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params?.sort_direction) queryParams.append("sort_direction", params.sort_direction);
      if (params?.favorites_only) queryParams.append("favorites_only", params.favorites_only.toString());
      const response = await apiClient.get(`/api/crypto/market?${queryParams.toString()}`);
      if (!response.success || !response.data) throw new Error(response.error || "Falha ao buscar dados de mercado");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados de mercado:", error);
      throw error;
    }
  },

  /**
   * Busca preços mais recentes de símbolos específicos
   */
  getLatestPrices: async (symbols: string[]): Promise<LatestPricesResponse> => {
    try {
      const response = await apiClient.post("/api/crypto/prices", { symbols });
      if (!response.success || !response.data) throw new Error(response.error || "Falha ao buscar preços atuais");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar preços atuais:", error);
      throw error;
    }
  },

  /**
   * Busca histórico de preços para um símbolo
   */
  getPriceHistory: async (
    symbol: string,
    params: Omit<PriceHistoryParams, "symbols">
  ): Promise<PriceHistoryResponse> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("timeframe", params.timeframe);
      if (params.start_date) queryParams.append("start_date", params.start_date);
      if (params.end_date) queryParams.append("end_date", params.end_date);
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.include_volume) queryParams.append("include_volume", params.include_volume.toString());
      if (params.include_indicators) queryParams.append("include_indicators", params.include_indicators.toString());
      const response = await apiClient.get(`/api/crypto/history/${symbol}?${queryParams.toString()}`);
      if (!response.success || !response.data) throw new Error(response.error || "Falha ao buscar histórico de preços");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar histórico de preços:", error);
      throw error;
    }
  },

  /**
   * Busca histórico de preços para múltiplos símbolos
   */
  getMultiSymbolHistory: async (params: PriceHistoryParams): Promise<MultiSymbolPriceHistoryResponse> => {
    try {
      const response = await apiClient.post("/api/crypto/history/batch", params);
      if (!response.success || !response.data) throw new Error(response.error || "Falha ao buscar histórico de múltiplos símbolos");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar histórico de múltiplos símbolos:", error);
      throw error;
    }
  },

  /**
   * Busca indicadores técnicos
   */
  getTechnicalIndicators: async (params: IndicatorParams): Promise<IndicatorsResponse> => {
    try {
      const response = await apiClient.post("/api/crypto/indicators", params);
      if (!response.success || !response.data) throw new Error(response.error || "Falha ao buscar indicadores técnicos");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar indicadores técnicos:", error);
      throw error;
    }
  },

  /**
   * Busca sinais de indicadores técnicos
   */
  getIndicatorSignals: async (
    symbols: string[],
    timeframes?: string[]
  ): Promise<IndicatorSignalsResponse> => {
    try {
      const response = await apiClient.post("/api/crypto/signals", { symbols, timeframes });
      if (!response.success || !response.data) throw new Error(response.error || "Falha ao buscar sinais técnicos");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar sinais técnicos:", error);
      throw error;
    }
  },

  /**
   * Busca estatísticas de preços
   */
  getPriceStatistics: async (
    symbols: string[],
    period: "24h" | "7d" | "30d" | "1y" = "24h"
  ): Promise<PriceStatisticsResponse> => {
    try {
      const response = await apiClient.post("/api/crypto/statistics", { symbols, period });
      if (!response.success || !response.data) throw new Error(response.error || "Falha ao buscar estatísticas de preços");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estatísticas de preços:", error);
      throw error;
    }
  },

  /**
   * Busca informações detalhadas de um símbolo específico
   */
  getSymbolDetails: async (symbol: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/crypto/symbol/${symbol}/details`);
      if (!response.success || !response.data) throw new Error(response.error || "Falha ao buscar detalhes do símbolo");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar detalhes do símbolo:", error);
      throw error;
    }
  },

  /**
   * Busca lista de todos os símbolos disponíveis
   */
  getAvailableSymbols: async (): Promise<{ success: boolean; data: { symbols: string[]; count: number } }> => {
    try {
      const response = await apiClient.get("/api/crypto/symbols");
      if (!response.success || !response.data) throw new Error(response.error || "Falha ao buscar símbolos disponíveis");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar símbolos disponíveis:", error);
      throw error;
    }
  },

  /**
   * Busca dados de criptomoedas (API: /api/crypto/data)
   */
  getCryptoData: async (limit = 10, offset = 0): Promise<CryptoMarketResponse> => {
    try {
      const response = await apiClient.get(`/api/crypto/data?limit=${limit}&offset=${offset}`);
      if (!response.success) throw new Error(response.error || "Falha ao buscar dados de criptomoedas");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados de criptomoedas:", error);
      throw error;
    }
  },

  /**
   * Busca detalhes de uma criptomoeda (API: /api/crypto/detail/{symbol})
   */
  getCryptoDetail: async (symbol: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/crypto/detail/${symbol}`);
      if (!response.success) throw new Error(response.error || "Falha ao buscar detalhes da criptomoeda");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar detalhes da criptomoeda:", error);
      throw error;
    }
  },

  /**
   * Busca histórico de preços (API: /api/crypto/history/{symbol})
   */
  getPriceHistoryV2: async (symbol: string, timeframe = "1h", limit = 100): Promise<PriceHistoryResponse> => {
    try {
      const response = await apiClient.get(`/api/crypto/history/${symbol}?timeframe=${timeframe}&limit=${limit}`);
      if (!response.success) throw new Error(response.error || "Falha ao buscar histórico de preços");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar histórico de preços:", error);
      throw error;
    }
  },

  /**
   * Busca indicadores técnicos (API: /api/crypto/indicators/{symbol})
   */
  getTechnicalIndicatorsV2: async (symbol: string, timeframe = "1h"): Promise<IndicatorsResponse> => {
    try {
      const response = await apiClient.get(`/api/crypto/indicators/${symbol}?timeframe=${timeframe}`);
      if (!response.success) throw new Error(response.error || "Falha ao buscar indicadores técnicos");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar indicadores técnicos:", error);
      throw error;
    }
  },

  /**
   * Calcula RSI (API: /api/indicators/{symbol}/rsi)
   */
  calculateRSI: async (symbol: string, timeframe = "1h", period = 14): Promise<any> => {
    try {
      const response = await apiClient.post(`/api/indicators/${symbol}/rsi`, { timeframe, period });
      if (!response.success) throw new Error(response.error || "Falha ao calcular RSI");
      return response.data;
    } catch (error) {
      console.error("Erro ao calcular RSI:", error);
      throw error;
    }
  },

  /**
   * Calcula EMA (API: /api/indicators/{symbol}/ema)
   */
  calculateEMA: async (symbol: string, timeframe = "1h", period = 21): Promise<any> => {
    try {
      const response = await apiClient.post(`/api/indicators/${symbol}/ema`, { timeframe, period });
      if (!response.success) throw new Error(response.error || "Falha ao calcular EMA");
      return response.data;
    } catch (error) {
      console.error("Erro ao calcular EMA:", error);
      throw error;
    }
  },

  /**
   * Busca últimos indicadores (API: /api/indicators/{symbol}/latest)
   */
  getLatestIndicators: async (symbol: string, timeframe = "1h"): Promise<any> => {
    try {
      const response = await apiClient.get(`/api/indicators/${symbol}/latest?timeframe=${timeframe}`);
      if (!response.success) throw new Error(response.error || "Falha ao buscar últimos indicadores");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar últimos indicadores:", error);
      throw error;
    }
  },
};

// Manter dados mockados como fallback durante desenvolvimento
export interface CryptoTableData {
  id: number;
  moeda: string;
  rank: number;
  preco: string;
  variacao: string;
  volume: string;
  max: string;
  min: string;
  curtoPrazo: string;
  variacaoPositiva: boolean;
}

export const fetchCryptoData = async (): Promise<CryptoTableData[]> => {
  console.warn("fetchCryptoData está sendo usado como fallback. Migre para cryptoService.getMarketData()");
  
  return Promise.resolve([
    {
      id: 1,
      moeda: "Bitcoin BTC",
      rank: 1,
      preco: "$94,929.60",
      variacao: "-2.89%",
      volume: "$9,794,309,719.51",
      max: "$98,731.50",
      min: "$94,828.22",
      curtoPrazo: "Alta Forte",
      variacaoPositiva: false,
    },
    {
      id: 2,
      moeda: "Ethereum ETH",
      rank: 2,
      preco: "$3,432.29",
      variacao: "2.22%",
      volume: "$8,953,349,513.11",
      max: "$3,546.47",
      min: "$3,282.41",
      curtoPrazo: "Alta Forte",
      variacaoPositiva: true,
    },
  ]);
};
