import { apiClient } from "./apiClient";
import { sessionService } from "./sessionService";
import { User, UserSettings } from "../models/User";

export const userService = {
  /**
   * Busca dados do usuário logado
   */
  getProfile: async (): Promise<{ success: boolean; data: User }> => {
    const token = sessionService.getToken();
    if (!token) throw new Error("Token de autenticação não encontrado");
    const response = await apiClient.get("/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-CSRF-Token": "priceguard-csrf"
      }
    });
    if (!response.success || !response.data) throw new Error(response.error || "Falha ao buscar perfil do usuário");
    return { success: true, data: response.data };
  },

  /**
   * Atualiza configurações do usuário
   */
  updateSettings: async (settings: Partial<UserSettings>): Promise<{ success: boolean; data: { settings: UserSettings } }> => {
    const token = sessionService.getToken();
    if (!token) throw new Error("Token de autenticação não encontrado");
    const response = await apiClient.put("/api/user/settings", settings, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-CSRF-Token": "priceguard-csrf",
        "Content-Type": "application/json"
      }
    });
    if (!response.success || !response.data) throw new Error(response.error || "Falha ao atualizar configurações do usuário");
    return { success: true, data: response.data };
  },

  /**
   * Lista alertas do usuário
   */
  getAlerts: async (): Promise<{ success: boolean; data: any[] }> => {
    const token = sessionService.getToken();
    if (!token) throw new Error("Token de autenticação não encontrado");
    const response = await apiClient.get("/api/user/alerts", {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-CSRF-Token": "priceguard-csrf"
      }
    });
    if (!response.success || !response.data) throw new Error(response.error || "Falha ao buscar alertas do usuário");
    return { success: true, data: response.data };
  },

  /**
   * Atualiza avatar do usuário
   */
  updateAvatar: async (avatarUrl: string): Promise<{ success: boolean; data: { avatar: string } }> => {
    const token = sessionService.getToken();
    if (!token) throw new Error("Token de autenticação não encontrado");
    const response = await apiClient.post("/api/user/avatar", { avatar: avatarUrl }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-CSRF-Token": "priceguard-csrf",
        "Content-Type": "application/json"
      }
    });
    if (!response.success || !response.data) throw new Error(response.error || "Falha ao atualizar avatar do usuário");
    return { success: true, data: response.data };
  },

  /**
   * Busca apenas as configurações do usuário logado
   */
  getUserSettings: async (): Promise<{ success: boolean; data: UserSettings }> => {
    const profile = await userService.getProfile();
    if (!profile.success || !profile.data.settings) throw new Error("Configurações do usuário não encontradas");
    return { success: true, data: profile.data.settings };
  }
};
