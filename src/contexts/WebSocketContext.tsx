import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { webSocketService, WebSocketMessageType } from "../services/websocketService";
import { RealtimePriceUpdate, LatestPriceData } from "../models/PriceHistory";
import { RealtimeNotification, Notification } from "../models/Notification";
import { AlertTriggerEvent, Alert } from "../models/Alert";
import { useAuth } from "./AuthContext";

interface WebSocketState {
  connected: boolean;
  authenticated: boolean;
  subscriptions: string[];
  error?: string;
}

interface WebSocketContextProps {
  // Estado da conexão
  connectionState: WebSocketState;
  
  // Dados em tempo real
  priceUpdates: Map<string, LatestPriceData>;
  notifications: Notification[];
  triggeredAlerts: Alert[];
  
  // Métodos de subscrição
  subscribeToPriceUpdates: (symbols: string[]) => void;
  unsubscribeFromPriceUpdates: (symbols: string[]) => void;
  subscribeToNotifications: () => void;
  subscribeToAlerts: () => void;
  
  // Métodos de conexão
  connect: () => Promise<void>;
  disconnect: () => void;
  
  // Métodos para handlers customizados
  onPriceUpdate: (handler: (data: RealtimePriceUpdate["data"]) => void) => void;
  onNotification: (handler: (data: Notification) => void) => void;
  onAlertTriggered: (handler: (data: AlertTriggerEvent) => void) => void;
  
  // Limpeza de dados
  clearNotifications: () => void;
  clearTriggeredAlerts: () => void;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

const WebSocketContext = createContext<WebSocketContextProps | null>(null);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Estado da conexão
  const [connectionState, setConnectionState] = useState<WebSocketState>({
    connected: false,
    authenticated: false,
    subscriptions: [],
  });
  
  // Dados em tempo real
  const [priceUpdates, setPriceUpdates] = useState<Map<string, LatestPriceData>>(new Map());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<Alert[]>([]);

  // Atualiza estado da conexão
  const updateConnectionState = useCallback(() => {
    const status = webSocketService.getConnectionStatus();
    setConnectionState({
      connected: status.connected,
      authenticated: status.authenticated,
      subscriptions: status.subscriptions,
    });
  }, []);

  // Handlers para diferentes tipos de mensagem
  const handlePriceUpdate = useCallback((data: RealtimePriceUpdate["data"]) => {
    setPriceUpdates(prev => {
      const newMap = new Map(prev);
      newMap.set(data.symbol, {
        symbol: data.symbol,
        price: data.price,
        change_24h: data.change,
        change_percent_24h: data.change_percent,
        volume_24h: data.volume,
        last_updated: data.timestamp,
      });
      return newMap;
    });
  }, []);

  const handleNotification = useCallback((data: Notification) => {
    setNotifications(prev => [data, ...prev].slice(0, 50)); // Manter apenas as 50 mais recentes
  }, []);

  const handleAlertTriggered = useCallback((data: AlertTriggerEvent) => {
    // Converter AlertTriggerEvent para Alert para manter compatibilidade
    const alertData: Alert = {
      id: data.alert_id,
      user_id: "", // Será preenchido pelo backend
      symbol: data.symbol,
      alert_type: data.alert_type,
      condition_value: data.condition_value,
      condition_operator: ">", // Valor padrão
      is_active: false, // Alert foi acionado
      triggered_at: data.triggered_at,
      created_at: "",
      updated_at: "",
      message: data.message,
    };
    
    setTriggeredAlerts(prev => [alertData, ...prev].slice(0, 20)); // Manter apenas os 20 mais recentes
  }, []);

  // Configurar handlers no WebSocket
  useEffect(() => {
    webSocketService.on("price_update", handlePriceUpdate);
    webSocketService.on("new_notification", handleNotification);
    webSocketService.on("alert_triggered", handleAlertTriggered);
    
    // Handler para erros de conexão
    webSocketService.on("error", (error) => {
      setConnectionState(prev => ({ ...prev, error: error.message }));
    });

    // Handler para confirmação de subscrição
    webSocketService.on("subscription_confirmed", (data) => {
      console.log("Subscrição confirmada:", data);
      updateConnectionState();
    });

    return () => {
      webSocketService.off("price_update", handlePriceUpdate);
      webSocketService.off("new_notification", handleNotification);
      webSocketService.off("alert_triggered", handleAlertTriggered);
    };
  }, [handlePriceUpdate, handleNotification, handleAlertTriggered, updateConnectionState]);

  // Conectar automaticamente quando autenticado
  useEffect(() => {
    if (isAuthenticated && !connectionState.connected) {
      connect();
    } else if (!isAuthenticated && connectionState.connected) {
      disconnect();
    }
  }, [isAuthenticated, connectionState.connected]);

  // Métodos públicos
  const connect = useCallback(async (): Promise<void> => {
    try {
      await webSocketService.connect();
      updateConnectionState();
    } catch (error) {
      console.error("Erro ao conectar WebSocket:", error);
      setConnectionState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : "Erro de conexão" 
      }));
    }
  }, [updateConnectionState]);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    setConnectionState({
      connected: false,
      authenticated: false,
      subscriptions: [],
    });
    
    // Limpar dados
    setPriceUpdates(new Map());
    setNotifications([]);
    setTriggeredAlerts([]);
  }, []);

  const subscribeToPriceUpdates = useCallback((symbols: string[]) => {
    webSocketService.subscribeToPriceUpdates(symbols);
    updateConnectionState();
  }, [updateConnectionState]);

  const unsubscribeFromPriceUpdates = useCallback((symbols: string[]) => {
    symbols.forEach(symbol => {
      webSocketService.unsubscribe("price_updates", symbol);
    });
    updateConnectionState();
  }, [updateConnectionState]);

  const subscribeToNotifications = useCallback(() => {
    webSocketService.subscribeToNotifications();
    updateConnectionState();
  }, [updateConnectionState]);

  const subscribeToAlerts = useCallback(() => {
    webSocketService.subscribeToAlerts();
    updateConnectionState();
  }, [updateConnectionState]);

  // Métodos para adicionar handlers customizados
  const onPriceUpdate = useCallback((handler: (data: RealtimePriceUpdate["data"]) => void) => {
    webSocketService.on("price_update", handler);
  }, []);

  const onNotification = useCallback((handler: (data: Notification) => void) => {
    webSocketService.on("new_notification", handler);
  }, []);

  const onAlertTriggered = useCallback((handler: (data: AlertTriggerEvent) => void) => {
    webSocketService.on("alert_triggered", handler);
  }, []);

  // Métodos de limpeza
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearTriggeredAlerts = useCallback(() => {
    setTriggeredAlerts([]);
  }, []);

  const contextValue: WebSocketContextProps = {
    connectionState,
    priceUpdates,
    notifications,
    triggeredAlerts,
    subscribeToPriceUpdates,
    unsubscribeFromPriceUpdates,
    subscribeToNotifications,
    subscribeToAlerts,
    connect,
    disconnect,
    onPriceUpdate,
    onNotification,
    onAlertTriggered,
    clearNotifications,
    clearTriggeredAlerts,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook customizado para usar o WebSocket
export const useWebSocket = (): WebSocketContextProps => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket deve ser usado dentro de um WebSocketProvider");
  }
  return context;
};
