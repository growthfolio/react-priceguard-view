import { useEffect, useState } from "react";
import { webSocketService } from "../services/websocketService";


const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    webSocketService.connect((message) => {
      console.log("Message received:", message.data);
    });
    setSocket(webSocketService.getSocket());

    return () => {
      webSocketService.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    webSocketService.sendMessage(message);
  };

  return { socket, sendMessage };
};

export default useWebSocket;
