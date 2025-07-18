import { apiClient } from "./apiClient";
import { User, UserSettings } from "../models/User";
import { sessionService } from "./sessionService";

export const userSettingsService = {
  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get("api/user/profile");
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar perfil do usuário");
      }
      
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      throw error;
    }
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    try {
      const response = await apiClient.get("api/user/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao atualizar perfil");
      }

      // Update local storage with new user data
      const currentUser = sessionService.getUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...response.data };
        // Use sessionService to save user data consistently
        const currentTokens = {
          access_token: sessionService.getToken() || '',
          refresh_token: sessionService.getRefreshToken() || '',
          expires_in: parseInt(localStorage.getItem("priceGuard_token_expires_in") || '0'),
          token_type: "Bearer" as const
        };
        sessionService.saveSession(updatedUser, currentTokens);
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  },

  getSettings: async (): Promise<UserSettings> => {
    try {
      const response = await apiClient.get("api/user/settings");
      
      if (!response.success) {
        throw new Error(response.error || "Falha ao buscar configurações do usuário");
      }
      
      // Save settings to local storage for offline access
      sessionService.saveUserSettings(response.data);
      
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar configurações do usuário:", error);
      throw error;
    }
  },

  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    try {
      const response = await apiClient.get("api/user/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });

      if (!response.success) {
        throw new Error(response.error || "Falha ao atualizar configurações");
      }

      // Update local storage with new settings
      sessionService.saveUserSettings(response.data);

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      throw error;
    }
  },

  // Theme management
  updateTheme: async (theme: "dark" | "light"): Promise<UserSettings> => {
    return userSettingsService.updateSettings({ theme });
  },

  // Notification preferences
  updateNotificationSettings: async (
    notifications: {
      notifications_email?: boolean;
      notifications_push?: boolean;
      notifications_sms?: boolean;
    }
  ): Promise<UserSettings> => {
    return userSettingsService.updateSettings(notifications);
  },

  // Favorite symbols management
  addFavoriteSymbol: async (symbol: string): Promise<UserSettings> => {
    try {
      const currentSettings = sessionService.getUserSettings();
      if (!currentSettings) {
        throw new Error("Configurações do usuário não encontradas");
      }

      const favoriteSymbols = [...(currentSettings.favorite_symbols || [])];
      if (!favoriteSymbols.includes(symbol)) {
        favoriteSymbols.push(symbol);
        return userSettingsService.updateSettings({ favorite_symbols: favoriteSymbols });
      }

      return currentSettings;
    } catch (error) {
      console.error("Erro ao adicionar símbolo favorito:", error);
      throw error;
    }
  },

  removeFavoriteSymbol: async (symbol: string): Promise<UserSettings> => {
    try {
      const currentSettings = sessionService.getUserSettings();
      if (!currentSettings) {
        throw new Error("Configurações do usuário não encontradas");
      }

      const favoriteSymbols = (currentSettings.favorite_symbols || []).filter(s => s !== symbol);
      return userSettingsService.updateSettings({ favorite_symbols: favoriteSymbols });
    } catch (error) {
      console.error("Erro ao remover símbolo favorito:", error);
      throw error;
    }
  },

  // Default preferences
  updateDefaultTimeframe: async (timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d"): Promise<UserSettings> => {
    return userSettingsService.updateSettings({ default_timeframe: timeframe });
  },

  updateDefaultView: async (view: "overview" | "detailed" | "compact"): Promise<UserSettings> => {
    return userSettingsService.updateSettings({ default_view: view });
  },

  updateRiskProfile: async (riskProfile: "conservative" | "moderate" | "aggressive"): Promise<UserSettings> => {
    return userSettingsService.updateSettings({ risk_profile: riskProfile });
  }
};
