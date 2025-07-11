import { apiClient } from "./apiClient";
import { sessionService } from "./sessionService";

export const authService = {
    loginWithGoogle: async (credential: string): Promise<void> => {
        try {
            const response = await apiClient("auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: credential }),
            });

            const { token } = response;
            const user = response.user;

            if (!token) {
                throw new Error("Token JWT não recebido na resposta do servidor.");
            }

            sessionService.saveSession(user, token);
        } catch (error) {
            console.error("Erro durante o login com Google:", error);
            // A mensagem de erro será exibida pelo apiClient
            throw error;
        }
    },

    logout: async (): Promise<void> => {
        try {
            const token = sessionService.getToken();
    
            if (!token) {
                console.warn("Nenhum token encontrado para enviar ao servidor.");
                throw new Error("Token não encontrado.");
            }
    
            // Envia o idToken para encerrar a sessão no servidor
            await apiClient("auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: token }),
            });
        } catch (error) {
            console.error("Erro ao fazer logout no servidor:", error);
        } finally {
            // Limpa a sessão local independentemente do resultado
            sessionService.clearSession();
        }
    },
    
};
