import { CryptoRow } from "../models/crypto";
import { normalizeCryptoData, transformToCryptoRow } from "../models/crypto/normalizeCryptoRow";

export class WebSocketService {
  private socket: WebSocket | null = null;
  private onDataReceived: ((data: CryptoRow[]) => void) | null = null;
  private reconnectTimeout: number | null = null;

  private readonly url: string = process.env.REACT_APP_WS_URL || "ws://localhost:8080/ws/dashboard";

  connect(onMessage?: (message: MessageEvent) => void) {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected, attempting to reconnect...");
      this.reconnect(onMessage);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onmessage = (message) => {
      try {
        const rawData: any[] = JSON.parse(message.data);
        console.log("Raw WebSocket data received:", rawData);

        const cryptoData = rawData.map((item) => normalizeCryptoData(item));
        console.log("Normalized to CryptoData:", cryptoData);

        const cryptoRows = cryptoData.map((data) => transformToCryptoRow(data));
        console.log("Transformed to CryptoRow:", cryptoRows);

        if (this.onDataReceived) {
          this.onDataReceived(cryptoRows);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  }

  sendMessage(message: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error("WebSocket is not open");
    }
  }

  setOnDataReceived(callback: (data: CryptoRow[]) => void) {
    this.onDataReceived = callback;
  }

  close() {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.onmessage = null;
      this.socket.close();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  getReadyState(): number | null {
    return this.socket?.readyState || null;
  }

  private reconnect(onMessage?: (message: MessageEvent) => void) {
    console.log("Attempting to reconnect...");
    this.reconnectTimeout = window.setTimeout(() => {
      this.connect(onMessage);
    }, 5000);
  }
}

export const webSocketService = new WebSocketService();
