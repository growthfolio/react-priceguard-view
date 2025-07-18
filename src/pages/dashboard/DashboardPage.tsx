import React, { useState, useEffect } from "react";
import { Button, Card } from "../../components/ui";
import { Loading } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Bell, TrendingUp, AlertTriangle, Settings, Activity } from "lucide-react";

interface DashboardStats {
  totalAlerts: number;
  activeAlerts: number;
  triggeredToday: number;
  unreadNotifications: number;
  favoriteSymbolsCount: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalAlerts: 0,
    activeAlerts: 0,
    triggeredToday: 0,
    unreadNotifications: 0,
    favoriteSymbolsCount: 0,
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Mock data for now
        setStats({
          totalAlerts: 5,
          activeAlerts: 3,
          triggeredToday: 1,
          unreadNotifications: 2,
          favoriteSymbolsCount: 6,
        });
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <Loading message="Carregando dashboard..." />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bem-vindo, {user?.name || "Usuário"}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Alertas
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalAlerts}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Alertas Ativos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeAlerts}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Disparados Hoje
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.triggeredToday}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Notificações
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.unreadNotifications}
              </p>
            </div>
            <Bell className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/alerts">
            <Button className="w-full" variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Gerenciar Alertas
            </Button>
          </Link>
          
          <Link to="/notifications">
            <Button className="w-full" variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </Button>
          </Link>
          
          <Link to="/profile">
            <Button className="w-full" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
