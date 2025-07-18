import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { sessionService } from "../services/sessionService";
import { User } from "../models/User";
import { toastAlert, ToastType, MESSAGES } from "../utils/toastAlert";
import { clearAllAppData } from "../utils/clearStorage";
import { debugAuth } from "../utils/debugAuth";
import { toast } from "react-toastify";

interface AuthContextType {
  user: User | null;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verifica se deve pular autenticação para ambiente de teste
  const skipAuth = process.env.REACT_APP_SKIP_AUTH === 'true';
  
  // Debug da configuração de autenticação
  console.log('🔧 AuthContext Config:', {
    REACT_APP_SKIP_AUTH: process.env.REACT_APP_SKIP_AUTH,
    skipAuth: skipAuth,
    NODE_ENV: process.env.NODE_ENV
  });

  const decodeJWT = useCallback((token: string): Record<string, any> | null => {
    try {
      const [, payload] = token.split(".");
      if (!payload) throw new Error("Token inválido");

      return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    } catch (error) {
      console.error("Erro ao decodificar o token JWT:", error);
      return null;
    }
  }, []);

  const isTokenValid = useCallback((token: string): boolean => {
    try {
      const payload = decodeJWT(token);
      if (!payload || typeof payload.exp !== "number") {
        throw new Error("Token inválido ou sem campo exp.");
      }

      return Date.now() < payload.exp * 1000;
    } catch (error) {
      console.error("Erro ao validar o token JWT:", error);
      return false;
    }
  }, [decodeJWT]);



  const loginWithGoogle = async (credential: string) => {
    // Se está no modo de teste, simula login bem-sucedido
    if (skipAuth) {
      const mockUser: User = {
        id: "test-user",
        google_id: "test-google-id",
        name: "Felipe Macedo (Teste)",
        email: "test@example.com",
        picture: "/img/perfil-wpp.jpeg",
        avatar: "/img/perfil-wpp.jpeg",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      
      if (!toast.isActive("login-success")) {
        toastAlert(MESSAGES.AUTH.LOGIN_SUCCESS, ToastType.SUCCESS, "login-success");
      }

      // Simula um delay para mostrar loading
      setTimeout(() => {
        navigate("/home");
        setLoading(false);
      }, 500);
      return;
    }

    setLoading(true);
    try {
      await authService.loginWithGoogle(credential);

      const storedUser = sessionService.getUser();
      const token = sessionService.getToken();
      
      if (token && isTokenValid(token) && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);

        if (!toast.isActive("login-success")) {
          toastAlert(MESSAGES.AUTH.LOGIN_SUCCESS, ToastType.SUCCESS, "login-success");
        }

        setTimeout(() => {
          navigate("/home");
          setLoading(false);
        }, 2000);
      } else {
        throw new Error("Token inválido ou dados do usuário não encontrados após o login.");
      }
    } catch (error: any) {
      console.error("Erro ao autenticar:", error);
      if (!toast.isActive("login-error")) {
        toastAlert(MESSAGES.AUTH.LOGIN_ERROR, ToastType.ERROR, "login-error");
      }
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // Initialize auth state on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Inicializando autenticação...');
      debugAuth(); // Debug completo da autenticação
      
      try {
        // APENAS quando skipAuth for verdadeiro, usar usuário mock
        if (skipAuth) {
          console.log('⚠️ Modo de teste ativado - carregando usuário mock');
          const mockUser: User = {
            id: "test-user-1",
            google_id: "mock-google-id-123",
            name: "Felipe Macedo (Teste)",
            email: "test@example.com",
            picture: "/img/perfil-wpp.jpeg",
            avatar: "/img/perfil-wpp.jpeg",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(mockUser);
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        console.log('🔐 Modo de autenticação real - verificando sessão existente...');
        
        // Check if user is already logged in
        const token = sessionService.getToken();
        const storedUser = sessionService.getUser();

        console.log('📱 Dados da sessão:', {
          hasToken: !!token,
          hasUser: !!storedUser,
          tokenValid: token ? isTokenValid(token) : false,
          tokenValue: token?.substring(0, 10) + '...' || 'null',
          userData: storedUser ? `${storedUser.name} (${storedUser.email})` : 'null'
        });

        if (token && isTokenValid(token) && storedUser) {
          console.log('✅ Sessão válida encontrada - restaurando usuário');
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          console.log('❌ Sessão inválida ou inexistente - limpando dados');
          // Clear invalid session
          sessionService.clearSession();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("❗ Erro ao inicializar autenticação:", error);
        sessionService.clearSession();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        console.log('✅ Inicialização da autenticação concluída', {
          authenticated: isAuthenticated,
          hasUser: !!user
        });
      }
    };

    initializeAuth();
  }, [skipAuth, isTokenValid]);

  const logout = () => {
    console.log('🚪 Iniciando logout...');
    debugAuth(); // Debug antes do logout
    
    // Sempre limpa todos os dados da aplicação
    clearAllAppData();
    sessionService.clearSession();
    
    setUser(null);
    setIsAuthenticated(false);

    if (!skipAuth) {
      authService.logout();
    }

    console.log('✅ Logout concluído');
    debugAuth(); // Debug após o logout

    if (!toast.isActive("logout-success")) {
      toastAlert(MESSAGES.AUTH.LOGOUT_SUCCESS, ToastType.INFO, "logout-success");
    }
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
