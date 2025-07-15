import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { PageLoading } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { WebSocketProvider } from "../contexts/WebSocketContext";

// Lazy loading das páginas
const LoginPage = lazy(() => import("../pages/login/LoginPage"));
const HomePage = lazy(() => import("../pages/home/HomePage"));
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
const MarketsPage = lazy(() => import("../pages/market/MarketsPage"));
const AlertsPage = lazy(() => import("../pages/alerts/AlertsPage"));
const NotificationsPage = lazy(() => import("../pages/notifications/NotificationsPage"));
const TradingViewPage = lazy(() => import("../pages/trading/TradingViewPage"));

const AppRoutes: React.FC = () => {
  const { loading } = useAuth();
  
  // Verifica se deve pular autenticação para ambiente de teste
  const skipAuth = process.env.REACT_APP_SKIP_AUTH === 'true';

  if (loading) {
    return <PageLoading message="Carregando aplicação..." />; // Exibe o loader global
  }

  return (
    <Suspense fallback={<PageLoading message="Carregando página..." />}>
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
            <WebSocketProvider>
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            </WebSocketProvider>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <AlertsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trading/:symbol?"
          element={
            <WebSocketProvider>
              <ProtectedRoute>
                <TradingViewPage />
              </ProtectedRoute>
            </WebSocketProvider>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
