// Remova a linha abaixo se não está usando apiClient
// import { apiClient } from "./apiClient";

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

// Dados mockados (modo offline)
export const fetchCryptoData = async (): Promise<CryptoTableData[]> => {
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
    // Outros dados simulados...
  ]);
};
