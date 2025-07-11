import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import HomePage from "../pages/home/HomePage";
import ProfilePage from "../pages/profile/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import MarketsPage from "../pages/market/MarketsPage";
import { PageLoading } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { WebSocketProvider } from "../contexts/WebSocketContext";

const AppRoutes: React.FC = () => {
  const { loading } = useAuth();
  
  // Verifica se deve pular autenticação para ambiente de teste
  const skipAuth = process.env.REACT_APP_SKIP_AUTH === 'true';

  if (loading) {
    return <PageLoading message="Carregando aplicação..." />; // Exibe o loader global
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={skipAuth ? "/home" : "/login"} />} />

      {/* Rotas públicas */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas protegidas */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/market"
        element={
          <WebSocketProvider>
          <ProtectedRoute>
            <MarketsPage />
          </ProtectedRoute>
          </WebSocketProvider>

        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div>Bem-vindo ao Dashboard</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
