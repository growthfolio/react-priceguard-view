import { apiClient } from "./apiClient";
import { sessionService } from "./sessionService";
import { LoginResponse, RefreshResponse, AuthTokens, User } from "../models";

export const authService = {
    loginWithGoogle: async (id_token: string): Promise<void> => {
        try {
            const response: LoginResponse = await apiClient("api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_token }),
            });

            if (!response.success) {
                throw new Error("Login failed");
            }

            const { user, tokens } = response.data;

            if (!tokens.access_token) {
                throw new Error("Token JWT não recebido na resposta do servidor.");
            }

            sessionService.saveSession(user, tokens);
        } catch (error) {
            console.error("Erro durante o login com Google:", error);
            throw error;
        }
    },

    refreshToken: async (): Promise<AuthTokens> => {
        try {
            const refreshToken = sessionService.getRefreshToken();
            
            if (!refreshToken) {
                throw new Error("Refresh token não encontrado.");
            }

            const response: RefreshResponse = await apiClient("api/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (!response.success) {
                throw new Error("Falha ao renovar token");
            }

            const tokens = response.data;
            sessionService.updateTokens(tokens);
            
            return tokens;
        } catch (error) {
            console.error("Erro ao renovar token:", error);
            sessionService.clearSession();
            throw error;
        }
    },

    verifyToken: async (): Promise<{ valid: boolean; user?: User }> => {
        try {
            const response = await apiClient("api/auth/verify", {
                method: "GET",
            });

            if (!response.success) {
                return { valid: false };
            }

            return response.data;
        } catch (error) {
            console.error("Erro ao verificar token:", error);
            return { valid: false };
        }
    },

    logout: async (): Promise<void> => {
        try {
            const refreshToken = sessionService.getRefreshToken();
    
            if (refreshToken) {
                await apiClient("api/auth/logout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });
            }
        } catch (error) {
            console.error("Erro ao fazer logout no servidor:", error);
        } finally {
            sessionService.clearSession();
        }
    },
};
