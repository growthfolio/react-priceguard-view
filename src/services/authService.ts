import { apiClient } from "./apiClient";
import { sessionService } from "./sessionService";
import { LoginResponse, RefreshResponse, AuthTokens, User } from "../models";
import { mockGoogleLogin } from "../utils/mockAuth";

export const authService = {
    loginWithGoogle: async (id_token: string): Promise<void> => {
        try {
            console.log('🔄 Tentando login com backend real...');
            
            // Primeira tentativa: backend real
            const response = await apiClient.post<{ user: User; tokens: AuthTokens }>("/api/auth/google", { id_token });

            if (!response.success) {
                throw new Error("Login failed");
            }

            const { user, tokens } = response.data!;

            if (!tokens.access_token) {
                throw new Error("Token JWT não recebido na resposta do servidor.");
            }

            console.log('✅ Login bem-sucedido com backend real');
            sessionService.saveSession(user, tokens);
        } catch (error) {
            console.error("❌ Erro no backend real:", error);
            
            // Fallback: usar mock para desenvolvimento
            console.log('🔄 Tentando fallback com mock...');
            try {
                const mockResponse = await mockGoogleLogin(id_token);
                console.log('✅ Login bem-sucedido com mock');
                sessionService.saveSession(mockResponse.user, mockResponse.tokens);
            } catch (mockError) {
                console.error("❌ Erro no mock também:", mockError);
                throw new Error("Falha tanto no backend real quanto no mock");
            }
        }
    },

    refreshToken: async (): Promise<AuthTokens> => {
        try {
            const refreshToken = sessionService.getRefreshToken();
            
            if (!refreshToken) {
                throw new Error("Refresh token não encontrado.");
            }

            const response = await apiClient.post<AuthTokens>("/api/auth/refresh", { refresh_token: refreshToken });            if (!response.success) {
                throw new Error("Falha ao renovar token");
            }

            const tokens = response.data!;
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
            const response = await apiClient.get<{ valid: boolean; user?: User }>("/api/auth/verify");

            if (!response.success) {
                return { valid: false };
            }

            return response.data!;
        } catch (error) {
            console.error("Erro ao verificar token:", error);
            return { valid: false };
        }
    },

    logout: async (): Promise<void> => {
        try {
            const refreshToken = sessionService.getRefreshToken();
    
            if (refreshToken) {
                await apiClient.post("/api/auth/logout", { refresh_token: refreshToken });
            }
        } catch (error) {
            console.error("Erro ao fazer logout no servidor:", error);
        } finally {
            sessionService.clearSession();
        }
    },
};
