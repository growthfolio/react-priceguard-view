import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { sessionService } from "../services/sessionService";
import { User } from "../models/User";
import { toastAlert, ToastType, MESSAGES } from "../utils/toastAlert";
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

  useEffect(() => {
    const initializeAuth = () => {
      // Se SKIP_AUTH está habilitado, simula usuário autenticado
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
        setLoading(false);
        return;
      }

      const storedToken = sessionService.getToken();
      const storedUser = sessionService.getUser();

      if (storedToken && storedToken !== "null" && storedUser) {
        if (isTokenValid(storedToken)) {
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          if (!toast.isActive("session-expired")) {
            toastAlert(MESSAGES.AUTH.SESSION_EXPIRED, ToastType.ERROR, "session-expired");
          }
          sessionService.clearSession();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [skipAuth, isTokenValid, decodeJWT]);

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

  const logout = () => {
    // Se está no modo de teste, apenas limpa o estado local
    if (skipAuth) {
      setUser(null);
      setIsAuthenticated(false);
      if (!toast.isActive("logout-success")) {
        toastAlert(MESSAGES.AUTH.LOGOUT_SUCCESS, ToastType.INFO, "logout-success");
      }
      navigate("/login");
      return;
    }

    authService.logout();
    sessionService.clearSession();
    setUser(null);
    setIsAuthenticated(false);

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
