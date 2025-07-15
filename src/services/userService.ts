import { apiClient } from "./apiClient";
import { User, UserSettings } from "../models/User";

export const userService = {
  /**
   * Busca informações do usuário atual
   */
  getCurrentUser: async (): Promise<{ success: boolean; data: User }> => {
    try {
      const response = await apiClient("api/user/profile");
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar perfil do usuário");
      }
      
      return response;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      throw error;
    }
  },

  /**
   * Atualiza informações do usuário
   */
  updateUser: async (userData: Partial<User>): Promise<{ success: boolean; data: User }> => {
    try {
      const response = await apiClient("api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao atualizar perfil do usuário");
      }

      return response;
    } catch (error) {
      console.error("Erro ao atualizar perfil do usuário:", error);
      throw error;
    }
  },

  /**
   * Busca configurações do usuário
   */
  getUserSettings: async (): Promise<{ success: boolean; data: UserSettings }> => {
    try {
      const response = await apiClient("api/user/settings");
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar configurações do usuário");
      }
      
      return response;
    } catch (error) {
      console.error("Erro ao buscar configurações do usuário:", error);
      throw error;
    }
  },

  /**
   * Atualiza configurações do usuário
   */
  updateUserSettings: async (
    settings: Partial<UserSettings>
  ): Promise<{ success: boolean; data: UserSettings }> => {
    try {
      const response = await apiClient("api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao atualizar configurações do usuário");
      }

      return response;
    } catch (error) {
      console.error("Erro ao atualizar configurações do usuário:", error);
      throw error;
    }
  },

  /**
   * Atualiza apenas o tema do usuário
   */
  updateTheme: async (theme: "dark" | "light"): Promise<{ success: boolean; data: UserSettings }> => {
    return await userService.updateUserSettings({ theme });
  },

  /**
   * Atualiza símbolos favoritos do usuário
   */
  updateFavoriteSymbols: async (
    favorite_symbols: string[]
  ): Promise<{ success: boolean; data: UserSettings }> => {
    return await userService.updateUserSettings({ favorite_symbols });
  },

  /**
   * Adiciona um símbolo aos favoritos
   */
  addFavoriteSymbol: async (symbol: string): Promise<{ success: boolean; data: UserSettings }> => {
    try {
      const currentSettings = await userService.getUserSettings();
      const currentFavorites = currentSettings.data.favorite_symbols || [];
      
      if (!currentFavorites.includes(symbol)) {
        const updatedFavorites = [...currentFavorites, symbol];
        return await userService.updateFavoriteSymbols(updatedFavorites);
      }
      
      return currentSettings;
    } catch (error) {
      console.error("Erro ao adicionar símbolo aos favoritos:", error);
      throw error;
    }
  },

  /**
   * Remove um símbolo dos favoritos
   */
  removeFavoriteSymbol: async (symbol: string): Promise<{ success: boolean; data: UserSettings }> => {
    try {
      const currentSettings = await userService.getUserSettings();
      const currentFavorites = currentSettings.data.favorite_symbols || [];
      
      const updatedFavorites = currentFavorites.filter(fav => fav !== symbol);
      return await userService.updateFavoriteSymbols(updatedFavorites);
    } catch (error) {
      console.error("Erro ao remover símbolo dos favoritos:", error);
      throw error;
    }
  },

  /**
   * Exclui conta do usuário
   */
  deleteAccount: async (): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient("api/user/account", {
        method: "DELETE",
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao excluir conta do usuário");
      }

      return response;
    } catch (error) {
      console.error("Erro ao excluir conta do usuário:", error);
      throw error;
    }
  },

  /**
   * Busca estatísticas de atividade do usuário
   */
  getUserStats: async (): Promise<{
    success: boolean;
    data: {
      total_alerts: number;
      active_alerts: number;
      notifications_count: number;
      favorite_symbols_count: number;
      account_created: string;
      last_login: string;
    };
  }> => {
    try {
      const response = await apiClient("api/user/stats");
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar estatísticas do usuário");
      }
      
      return response;
    } catch (error) {
      console.error("Erro ao buscar estatísticas do usuário:", error);
      throw error;
    }
  },
};
