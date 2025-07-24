import { useEffect, useState } from "react";
import { webSocketService } from "../services/websocketService";


const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    webSocketService.connect();

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const sendMessage = (message: string) => {
    webSocketService.sendRaw(message);
  };

  return { socket, sendMessage };
};

export default useWebSocket;
