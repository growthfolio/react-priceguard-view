import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { PageLoading } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

// Lazy loading das páginas
const LoginPage = lazy(() => import("../pages/login/LoginPage"));
const HomePage = lazy(() => import("../pages/home/HomePage"));
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
const MarketsPage = lazy(() => import("../pages/market/ModernMarketsPage"));
const AlertsPage = lazy(() => import("../pages/alerts/AlertsPage"));
const NotificationsPage = lazy(() => import("../pages/notifications/NotificationsPage"));
const TradingViewPage = lazy(() => import("../pages/trading/TradingViewPage"));
const BackendTestPage = lazy(() => import("../pages/test/BackendTestPage"));
const TestLoginPage = lazy(() => import("../pages/test/TestLoginPage"));
const RealLoginDemo = lazy(() => import("../pages/login/RealLoginDemo"));
const AuthDebugPage = lazy(() => import("../pages/debug/AuthDebugPage"));

const AppRoutes: React.FC = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <PageLoading message="Carregando aplicação..." />; // Exibe o loader global
  }

  return (
    <Suspense fallback={<PageLoading message="Carregando página..." />}>
      <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />

          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/test-login" element={<TestLoginPage />} />
          <Route path="/real-login-demo" element={<RealLoginDemo />} />

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
              <ProtectedRoute>
                <MarketsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <TradingViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test"
            element={
              <ProtectedRoute>
                <BackendTestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/debug"
            element={
              <ProtectedRoute>
                <AuthDebugPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
  );
};

export default AppRoutes;
