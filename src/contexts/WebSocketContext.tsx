import React, { createContext, useEffect, useState, ReactNode } from "react";
import { isEqual } from "lodash";
import { CryptoRow } from "../models";
import { webSocketService } from "../services/websocketService";

interface WebSocketContextProps {
  cryptoData: CryptoRow[];
  sendMessage: (message: string) => void;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketContext = createContext<WebSocketContextProps | null>(null);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [cryptoData, setCryptoData] = useState<CryptoRow[]>([]);

  const updateCryptoData = (newData: CryptoRow[]) => {
    setCryptoData((prevData) => {
      const updatedData = newData.map((newRow) => {
        const existingRow = prevData.find((row) => row.id === newRow.id);
        if (existingRow && isEqual(existingRow, newRow)) {
          return existingRow;
        }
        return newRow;
      });
      return updatedData;
    });
  };

  useEffect(() => {
    webSocketService.setOnDataReceived((data) => {
      console.log("Data received from WebSocket (CryptoRow):", data);
      updateCryptoData(data);
    });

    webSocketService.connect();

    return () => webSocketService.close();
  }, []);

  const sendMessage = (message: string) => {
    webSocketService.sendMessage(message);
  };

  return (
    <WebSocketContext.Provider value={{ cryptoData, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
