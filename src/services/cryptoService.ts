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

      const response = await apiClient(`api/crypto/market?${queryParams.toString()}`);
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar dados de mercado");
      }
      
      return response;
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
      const response = await apiClient.get("api/crypto/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbols }),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar preços atuais");
      }

      return response;
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

      const response = await apiClient(`api/crypto/history/${symbol}?${queryParams.toString()}`);
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar histórico de preços");
      }
      
      return response;
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
      const response = await apiClient.get("api/crypto/history/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar histórico de múltiplos símbolos");
      }

      return response;
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
      const response = await apiClient.get("api/crypto/indicators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar indicadores técnicos");
      }

      return response;
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
      const response = await apiClient.get("api/crypto/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbols, timeframes }),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar sinais técnicos");
      }

      return response;
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
      const response = await apiClient.get("api/crypto/statistics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbols, period }),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar estatísticas de preços");
      }

      return response;
    } catch (error) {
      console.error("Erro ao buscar estatísticas de preços:", error);
      throw error;
    }
  },

  /**
   * Busca informações detalhadas de um símbolo específico
   */
  getSymbolDetails: async (symbol: string): Promise<{
    success: boolean;
    data: {
      symbol: string;
      name: string;
      description?: string;
      website?: string;
      whitepaper?: string;
      total_supply?: number;
      circulating_supply?: number;
      max_supply?: number;
      categories: string[];
      links: {
        website?: string;
        twitter?: string;
        reddit?: string;
        github?: string;
      };
    };
  }> => {
    try {
      const response = await apiClient(`api/crypto/symbol/${symbol}/details`);
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar detalhes do símbolo");
      }
      
      return response;
    } catch (error) {
      console.error("Erro ao buscar detalhes do símbolo:", error);
      throw error;
    }
  },

  /**
   * Busca lista de todos os símbolos disponíveis
   */
  getAvailableSymbols: async (): Promise<{
    success: boolean;
    data: {
      symbols: string[];
      count: number;
    };
  }> => {
    try {
      const response = await apiClient.get("api/crypto/symbols");
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar símbolos disponíveis");
      }
      
      return response;
    } catch (error) {
      console.error("Erro ao buscar símbolos disponíveis:", error);
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
