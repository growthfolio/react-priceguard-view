import { User, AuthTokens, UserSettings } from "../models/User";

const sessionService = {
  getUser: (): User | null => {
    const userString = localStorage.getItem("priceGuard_user_data");
    if (!userString) {
      console.warn("Nenhum dado de usuário encontrado no localStorage.");
      return null;
    }
    
    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error("Erro ao fazer parse dos dados do usuário:", error);
      return null;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem("priceGuard_auth_token") || null;
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("priceGuard_refresh_token") || null;
  },

  saveSession: (user: User, tokens: AuthTokens): void => {
    localStorage.setItem("priceGuard_user_data", JSON.stringify(user));
    localStorage.setItem("priceGuard_auth_token", tokens.access_token);
    localStorage.setItem("priceGuard_refresh_token", tokens.refresh_token);
    localStorage.setItem("priceGuard_token_expires_in", tokens.expires_in.toString());
    localStorage.setItem("priceGuard_token_type", tokens.token_type);
  },

  updateTokens: (tokens: AuthTokens): void => {
    localStorage.setItem("priceGuard_auth_token", tokens.access_token);
    localStorage.setItem("priceGuard_refresh_token", tokens.refresh_token);
    localStorage.setItem("priceGuard_token_expires_in", tokens.expires_in.toString());
    localStorage.setItem("priceGuard_token_type", tokens.token_type);
  },

  getUserSettings: (): UserSettings | null => {
    const settingsString = localStorage.getItem("priceGuard_user_preferences");
    if (!settingsString) {
      return null;
    }
    
    try {
      return JSON.parse(settingsString);
    } catch (error) {
      console.error("Erro ao fazer parse das configurações do usuário:", error);
      return null;
    }
  },

  saveUserSettings: (settings: UserSettings): void => {
    localStorage.setItem("priceGuard_user_preferences", JSON.stringify(settings));
  },

  isTokenExpired: (): boolean => {
    const expiresIn = localStorage.getItem("priceGuard_token_expires_in");
    if (!expiresIn) return true;
    
    const expirationTime = parseInt(expiresIn) * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  },

  clearSession: (): void => {
    localStorage.removeItem("priceGuard_user_data");
    localStorage.removeItem("priceGuard_auth_token");
    localStorage.removeItem("priceGuard_refresh_token");
    localStorage.removeItem("priceGuard_token_expires_in");
    localStorage.removeItem("priceGuard_token_type");
    localStorage.removeItem("priceGuard_user_preferences");
  },
};

export { sessionService };
