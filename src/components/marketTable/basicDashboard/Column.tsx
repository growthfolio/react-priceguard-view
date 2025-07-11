import { Box } from "@mui/material";
import { Column, CryptoRow } from "../../../models";
import { ChartLine } from "@phosphor-icons/react";

export const generateColumns = (
  onChartClick: (symbol: string) => void
): Column<CryptoRow>[] => [
  {
    key: "symbol",
    label: "Nome",
    isVisible: true,
    customRender: (row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
         src={row.imgurl || "https://via.placeholder.com/20"}
         alt={row.symbol || "Symbol"}
         onError={(e) => console.log("Erro ao carregar imagem:", e.currentTarget.src)}
        style={{
          width: "",
          height: "",
          borderRadius: "50%",
        }}
      />

        <span>{row.symbol || "N/A"}</span>
      </Box>
    ),
  },
  {
    key: "priceChange_1m",
    label: "Alteração de preço (1m)",
    isVisible: true,
  },
  {
    key: "rsi_4h",
    label: "RSI (4h)",
    isVisible: true,
  },
  {
    key: "ematrend_1d",
    label: "Tendencia EMA (1d)",
    isVisible: true,
  },
  {
    key: "chart",
    label: "TradingView",
    isVisible: true,
    customRender: (row) => (
      <Box
        
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => onChartClick(row.symbol || "")}
        title="View Chart"
      >
        <div className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 
        cursor-pointer
        justify-start
        items-center
        " >
        <ChartLine size={18} />
        </div>
      </Box>
    ),
  },
];
