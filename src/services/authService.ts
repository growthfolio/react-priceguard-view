import { apiClient } from "./apiClient";
import { sessionService } from "./sessionService";
import { LoginResponse, RefreshResponse, AuthTokens, User } from "../models";

export const authService = {
    loginWithGoogle: async (id_token: string): Promise<void> => {
        try {
            console.log('🔄 Tentando login com backend real...');
            const response = await apiClient.post<LoginResponse>("/api/auth/login", { id_token });
            console.log('[LOGIN] Resposta recebida:', response);
            // Corrige acesso conforme tipagem LoginResponse
            if (!response.success || !response.data) {
                console.error("❌ Login falhou ou token inválido:", response);
                throw new Error("Login failed ou token inválido");
            }
            const { user, tokens } = response.data as unknown as { user: User; tokens: AuthTokens };
            if (!user || !tokens || !tokens.access_token) {
                throw new Error("Login failed ou token inválido");
            }
            sessionService.saveSession(user, tokens);
            console.log('✅ Login bem-sucedido com backend real, token salvo:', tokens.access_token);
        } catch (error) {
            console.error("❌ Erro no backend real:", error);
            // Não salva token do Google em nenhum caso
            throw error;
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
