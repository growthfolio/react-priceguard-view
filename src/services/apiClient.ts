import { toast } from "react-toastify";
import { toastAlert, ToastType, MESSAGES } from "../utils/toastAlert";
import { sessionService } from "./sessionService";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ApiClient {
  get<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>>;
  post<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>>;
  put<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>>;
  delete<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>>;
  request<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>>;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

export const makeApiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = sessionService.getToken();
  const origin = window.location.origin;
  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
    Origin: origin,
    "X-CSRF-Token": "priceguard-csrf", // valor arbitrário
  };

  try {
    // Corrige endpoint para evitar barra dupla
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    const response = await fetch(`${BASE_URL}/${normalizedEndpoint}`, { ...options, headers });
    console.log('[API] Resposta bruta do servidor:', response);

    // Handle 401 Unauthorized - Try to refresh token
    if (response.status === 401 && token) {
      if (isRefreshing) {
        // If already refreshing, wait for it to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // Retry original request with new token
          const newToken = sessionService.getToken();
          return makeApiRequest(endpoint, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: newToken ? `Bearer ${newToken}` : "",
              "Content-Type": "application/json",
            }
          });
        });
      }

      // Try to refresh token
      isRefreshing = true;
      
      try {
        const { authService } = await import("./authService");
        await authService.refreshToken();
        processQueue(null);
        
        // Retry original request with new token
        const newToken = sessionService.getToken();
        return makeApiRequest(endpoint, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: newToken ? `Bearer ${newToken}` : "",
            "Content-Type": "application/json",
          }
        });
      } catch (refreshError) {
        processQueue(refreshError);
        sessionService.clearSession();
        if (!toast.isActive("session-expired")) {
          toastAlert(MESSAGES.AUTH.SESSION_EXPIRED, ToastType.ERROR, "session-expired");
        }
        throw new Error("Session expired");
      } finally {
        isRefreshing = false;
      }
    }

    if (!response.ok) {
      if (response.status >= 500) {
        if (!toast.isActive("server-error")) {
          toastAlert(MESSAGES.GENERAL.UNKNOWN_ERROR, ToastType.ERROR, "server-error");
        }
        throw new Error("Erro no servidor.");
      }
      
      // Try to get error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      } catch {
        throw new Error(`HTTP ${response.status}`);
      }
    }

    // Parse response as structured format
    const data = await response.json();
    console.log('[API] Corpo da resposta JSON:', data);

    // Handle both structured and legacy formats
    if (typeof data === 'object' && 'success' in data) {
      if (!data.success && data.error) {
        throw new Error(data.error);
      }
      return data;
    }
    
    // Legacy format - wrap in success structure
    return {
      success: true,
      data: data
    };

  } catch (error: any) {
    if (error.name === "TypeError") {
      if (!toast.isActive("network-error")) {
        toastAlert(MESSAGES.GENERAL.NETWORK_ERROR, ToastType.ERROR, "network-error");
      }
    }
    throw error;
  }
};

// HTTP method helpers
const apiClient: ApiClient = {
  async get<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return await makeApiRequest(endpoint, { ...options, method: 'GET' });
  },

  async post<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return await makeApiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async put<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return await makeApiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async delete<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return await makeApiRequest(endpoint, { ...options, method: 'DELETE' });
  },

  async request<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return await makeApiRequest(endpoint, options);
  },
};

export { apiClient };
export default apiClient;