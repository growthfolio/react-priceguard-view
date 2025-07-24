import { sessionService } from "./sessionService";
import { RealtimePriceUpdate } from "../models/PriceHistory";
import { RealtimeNotification } from "../models/Notification";
import { AlertTriggerEvent } from "../models/Alert";

export type WebSocketMessageType = 
  | "price_update"
  | "new_notification" 
  | "alert_triggered"
  | "system_message"
  | "error"
  | "subscription_confirmed"
  | "subscription_error";

export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: any;
  timestamp?: string;
}

export interface SubscriptionRequest {
  action: "subscribe" | "unsubscribe";
  room: string;
  symbol?: string;
}

export type WebSocketEventHandler = (data: any) => void;

export class WebSocketService {
  private socket: WebSocket | null = null;
  private eventHandlers: Map<WebSocketMessageType, WebSocketEventHandler[]> = new Map();
  private reconnectTimeout: number | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private subscriptions: Set<string> = new Set();
  private isAuthenticated: boolean = false;

  private readonly baseUrl: string = process.env.REACT_APP_WS_URL || "ws://localhost:8080";

  /**
   * Conecta ao WebSocket com autenticação
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = sessionService.getToken();
      
      if (!token) {
        reject(new Error("Token de autenticação não encontrado"));
        return;
      }

      const wsUrl = `${this.baseUrl}/ws?token=${encodeURIComponent(token)}`;
      
      try {
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
          console.log("WebSocket conectado com sucesso");
          this.isAuthenticated = true;
          this.reconnectAttempts = 0;
          
          if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
          }
          
          // Resubscrever a rooms perdidas na reconexão
          this.resubscribeToRooms();
          resolve();
        };

        this.socket.onclose = (event) => {
          console.log("WebSocket desconectado:", event.code, event.reason);
          this.isAuthenticated = false;
          this.handleReconnect();
        };

        this.socket.onerror = (error) => {
          console.error("Erro no WebSocket:", error);
          this.isAuthenticated = false;
          reject(error);
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event);
        };
        
      } catch (error) {
        console.error("Erro ao criar conexão WebSocket:", error);
        reject(error);
      }
    });
  }

  /**
   * Subscreve a uma room específica
   */
  subscribe(room: string, symbol?: string): void {
    if (!this.isConnected()) {
      console.warn("WebSocket não está conectado. Subscription será feita na reconexão.");
      this.subscriptions.add(room + (symbol ? `:${symbol}` : ""));
      return;
    }

    const subscription: SubscriptionRequest = {
      action: "subscribe",
      room,
      symbol
    };

    this.sendMessage(subscription);
    this.subscriptions.add(room + (symbol ? `:${symbol}` : ""));
    
    console.log(`Subscrito à room: ${room}${symbol ? ` (${symbol})` : ""}`);
  }

  /**
   * Cancela subscrição de uma room
   */
  unsubscribe(room: string, symbol?: string): void {
    if (!this.isConnected()) {
      console.warn("WebSocket não está conectado.");
      return;
    }

    const subscription: SubscriptionRequest = {
      action: "unsubscribe",
      room,
      symbol
    };

    this.sendMessage(subscription);
    this.subscriptions.delete(room + (symbol ? `:${symbol}` : ""));
    
    console.log(`Cancelada subscrição da room: ${room}${symbol ? ` (${symbol})` : ""}`);
  }

  /**
   * Subscrições para preços em tempo real
   */
  subscribeToPriceUpdates(symbols: string[]): void {
    symbols.forEach(symbol => {
      this.subscribe("price_updates", symbol);
    });
  }

  /**
   * Subscrição para notificações
   */
  subscribeToNotifications(): void {
    this.subscribe("notifications");
  }

  /**
   * Subscrição para alertas acionados
   */
  subscribeToAlerts(): void {
    this.subscribe("alerts");
  }

  /**
   * Adiciona handler para tipo de evento específico
   */
  on(eventType: WebSocketMessageType, handler: WebSocketEventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  /**
   * Remove handler para tipo de evento específico
   */
  off(eventType: WebSocketMessageType, handler: WebSocketEventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Envia mensagem pelo WebSocket
   */
  private sendMessage(message: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket não está conectado");
    }
  }

  /**
   * Envia mensagem bruta pelo WebSocket
   */
  public sendRaw(message: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error("WebSocket não está conectado");
    }
  }

  /**
   * Processa mensagens recebidas
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      console.log("WebSocket message received:", message);

      // Executa handlers registrados para o tipo de mensagem
      const handlers = this.eventHandlers.get(message.type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(message.data);
          } catch (error) {
            console.error(`Erro ao executar handler para ${message.type}:`, error);
          }
        });
      }

      // Log específico para diferentes tipos de mensagem
      switch (message.type) {
        case "subscription_confirmed":
          console.log("Subscrição confirmada:", message.data);
          break;
        case "subscription_error":
          console.error("Erro na subscrição:", message.data);
          break;
        case "error":
          console.error("Erro do servidor:", message.data);
          break;
      }

    } catch (error) {
      console.error("Erro ao processar mensagem WebSocket:", error);
    }
  }

  /**
   * Reconecta automaticamente
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Máximo de tentativas de reconexão atingido");
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`Tentando reconectar em ${delay}ms (tentativa ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectAttempts++;
      this.connect().catch(() => {
        // Se falhar, handleReconnect será chamado novamente via onclose
      });
    }, delay);
  }

  /**
   * Resubscreve a todas as rooms após reconexão
   */
  private resubscribeToRooms(): void {
    this.subscriptions.forEach(subscription => {
      const [room, symbol] = subscription.split(":");
      this.subscribe(room, symbol);
    });
  }

  /**
   * Verifica se está conectado
   */
  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN && this.isAuthenticated;
  }

  /**
   * Obtém status da conexão
   */
  getConnectionStatus(): {
    connected: boolean;
    authenticated: boolean;
    readyState: number | null;
    subscriptions: string[];
  } {
    return {
      connected: this.socket?.readyState === WebSocket.OPEN || false,
      authenticated: this.isAuthenticated,
      readyState: this.socket?.readyState || null,
      subscriptions: Array.from(this.subscriptions),
    };
  }

  /**
   * Fecha conexão
   */
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.onmessage = null;
      this.socket.close();
      this.socket = null;
    }

    this.isAuthenticated = false;
    this.subscriptions.clear();
    this.eventHandlers.clear();
    this.reconnectAttempts = 0;
    
    console.log("WebSocket desconectado");
  }
}

export const webSocketService = new WebSocketService();
