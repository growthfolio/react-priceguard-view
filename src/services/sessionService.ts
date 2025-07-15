import { User, AuthTokens, UserSettings } from "../models/User";

const sessionService = {
  getUser: (): User | null => {
    const userString = localStorage.getItem("user");
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
    return localStorage.getItem("access_token") || null;
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("refresh_token") || null;
  },

  saveSession: (user: User, tokens: AuthTokens): void => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    localStorage.setItem("token_expires_in", tokens.expires_in.toString());
    localStorage.setItem("token_type", tokens.token_type);
  },

  updateTokens: (tokens: AuthTokens): void => {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    localStorage.setItem("token_expires_in", tokens.expires_in.toString());
    localStorage.setItem("token_type", tokens.token_type);
  },

  getUserSettings: (): UserSettings | null => {
    const settingsString = localStorage.getItem("user_settings");
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
    localStorage.setItem("user_settings", JSON.stringify(settings));
  },

  isTokenExpired: (): boolean => {
    const expiresIn = localStorage.getItem("token_expires_in");
    if (!expiresIn) return true;
    
    const expirationTime = parseInt(expiresIn) * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  },

  clearSession: (): void => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires_in");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user_settings");
  },
};

export { sessionService };
