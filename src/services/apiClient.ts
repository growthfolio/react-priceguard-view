import { toast } from "react-toastify";
import { toastAlert, ToastType, MESSAGES } from "../utils/toastAlert";
import { sessionService } from "./sessionService";

const BASE_URL = "http://localhost:8080";

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = sessionService.getToken();
  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, { ...options, headers });

    if (!response.ok) {
      if (response.status === 401) {
        sessionService.clearSession();
        if (!toast.isActive("session-expired")) {
          toastAlert(MESSAGES.AUTH.SESSION_EXPIRED, ToastType.ERROR, "session-expired");
        }
        throw new Error("Não autorizado.");
      }

      if (response.status >= 500) {
        if (!toast.isActive("server-error")) {
          toastAlert(MESSAGES.GENERAL.UNKNOWN_ERROR, ToastType.ERROR, "server-error");
        }
        throw new Error("Erro no servidor.");
      }
    }

    return response.json();
  } catch (error: any) {
    if (error.name === "TypeError") {
      if (!toast.isActive("network-error")) {
        toastAlert(MESSAGES.GENERAL.NETWORK_ERROR, ToastType.ERROR, "network-error");
      }
    }
    throw error;
  }
};
