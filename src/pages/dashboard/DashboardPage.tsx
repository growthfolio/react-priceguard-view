import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { Button, Card } from "../../components/ui";
import { Loading } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import { useWebSocket } from "../../contexts/WebSocketContext";
import { alertService } from "../../services/alertService";
import { notificationService } from "../../services/notificationService";
import { cryptoService } from "../../services/cryptoService";
import { userService } from "../../services/userService";
import { AlertStatistics } from "../../models/Alert";
import { LatestPriceData } from "../../models/PriceHistory";
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
  const { connectionState, subscribeToPriceUpdates, priceUpdates, notifications } = useWebSocket();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalAlerts: 0,
    activeAlerts: 0,
    triggeredToday: 0,
    unreadNotifications: 0,
    favoriteSymbolsCount: 0,
  });
  const [recentPrices, setRecentPrices] = useState<LatestPriceData[]>([]);
  const [favoriteSymbols, setFavoriteSymbols] = useState<string[]>([]);

  // Carrega dados iniciais do dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Carrega estatísticas em paralelo
        const [alertStats, userStats, unreadCount] = await Promise.all([
          alertService.getAlertStats().catch(() => null),
          userService.getUserStats().catch(() => null),
          notificationService.getUnreadCount().catch(() => ({ data: { count: 0 } })),
        ]);

        // Carrega configurações do usuário para obter favoritos
        const userSettings = await userService.getUserSettings().catch(() => null);
        const favorites = userSettings?.data.favorite_symbols || ["BTC", "ETH", "ADA"];
        setFavoriteSymbols(favorites);

        // Carrega preços dos favoritos
        if (favorites.length > 0) {
          try {
            const pricesResponse = await cryptoService.getLatestPrices(favorites);
            setRecentPrices(pricesResponse.data.prices.slice(0, 6)); // Mostra apenas os 6 primeiros
            
            // Subscreve a atualizações de preço
            subscribeToPriceUpdates(favorites);
          } catch (error) {
            console.error("Erro ao carregar preços dos favoritos:", error);
          }
        }

        // Atualiza estatísticas
        setStats({
          totalAlerts: alertStats?.data.total_alerts || 0,
          activeAlerts: alertStats?.data.active_alerts || 0,
          triggeredToday: alertStats?.data.triggered_today || 0,
          unreadNotifications: typeof unreadCount === 'number' ? unreadCount : unreadCount.data.count,
          favoriteSymbolsCount: userStats?.data.favorite_symbols_count || favorites.length,
        });

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [subscribeToPriceUpdates]);

  // Atualiza preços quando há atualizações do WebSocket
  useEffect(() => {
    const updatedPrices = recentPrices.map(price => {
      const update = priceUpdates.get(price.symbol);
      return update ? { ...price, ...update } : price;
    });
    
    if (JSON.stringify(updatedPrices) !== JSON.stringify(recentPrices)) {
      setRecentPrices(updatedPrices);
    }
  }, [priceUpdates, recentPrices]);

  // Atualiza contagem de notificações quando há novas
  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.is_read).length;
    setStats(prev => ({ ...prev, unreadNotifications: unreadCount }));
  }, [notifications]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bem-vindo de volta, {user?.name}
            </p>
          </div>
          
          {/* Status da conexão WebSocket */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionState.connected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {connectionState.connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <AlertTriangle className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <span className="text-xs text-gray-500">
                {stats.totalAlerts} total
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Acionados Hoje
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.triggeredToday}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
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
              <Bell className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <Link 
                to="/notifications" 
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Ver todas
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Favoritos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.favoriteSymbolsCount}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Preços em Tempo Real */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Seus Favoritos
              </h2>
              <Link 
                to="/markets" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Ver mercado
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentPrices.length > 0 ? (
                recentPrices.map((crypto) => (
                  <div key={crypto.symbol} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {crypto.symbol}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatPrice(crypto.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        crypto.change_percent_24h >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {formatChange(crypto.change_percent_24h)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  Nenhum favorito configurado
                </p>
              )}
            </div>
          </Card>

          {/* Notificações Recentes */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notificações Recentes
              </h2>
              <Link 
                to="/notifications" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Ver todas
              </Link>
            </div>
            
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                  )}
                </div>
              ))}
              
              {notifications.length === 0 && (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  Nenhuma notificação recente
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ações Rápidas
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/alerts/new">
              <Button className="w-full" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Criar Alerta
              </Button>
            </Link>
            
            <Link to="/markets">
              <Button className="w-full" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Ver Mercados
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
    </Layout>
  );
};

export default DashboardPage;
