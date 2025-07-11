import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import CandleLoader from "../utils/CandleLoader";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

interface TradingViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
}

const TradingViewModal: React.FC<TradingViewModalProps> = ({ isOpen, onClose, symbol }) => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);

      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        new (window as any).TradingView.widget({
          container_id: "chart-container",
          width: "100%",
          height: 500,
          symbol: symbol,
          interval: "D",
          timezone: userTimeZone,
          theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          studies: ["RSI@tv-basicstudies"],
          onready: () => setLoading(false),
        });
      };
      document.body.appendChild(script);

      const timeoutId = setTimeout(() => setLoading(false), 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, symbol, theme]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className={`my-3 rounded-lg ${isFullScreen ? "w-full h-full" : "w-3/4 lg:w-1/2"} pt-3 px-4 relative ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-xl font-bold">Gráfico TradingView</h1>
          <div className="flex space-x-2">
            <FormControlLabel
              control={
                <Switch
                  checked={theme === "dark"}
                  onChange={() => setTheme(theme === "light" ? "dark" : "light")}
                />
              }
              label={theme === "light" ? "Tema Claro" : "Tema Escuro"}
            />
            <button onClick={() => setIsFullScreen(!isFullScreen)} className="text-gray-700 hover:text-blue-500">
              {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </button>
            <button onClick={onClose} className="text-gray-700 hover:text-red-500">
              X
            </button>
          </div>
        </div>

        <div className="relative mb-3" style={{ height: "500px" }}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
              <CandleLoader />
            </div>
          )}
          <div id="chart-container" className={loading ? "opacity-50" : "opacity-100"} style={{ height: "500px" }} />
        </div>
      </div>
    </div>
  );
};

export default TradingViewModal;
