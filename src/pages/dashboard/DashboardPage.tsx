import React, { useState, useEffect } from "react";
import { Button, Card } from "../../components/ui";
import { Loading } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import "../../styles/dashboard-modern.css";
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Settings, 
  Activity, 
  DollarSign,
  Eye,
  BarChart3,
  Zap,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calendar,
  Users
} from "lucide-react";
import { indicatorService } from '../../services/indicatorService';
import { healthService } from '../../services/healthService';

interface DashboardStats {
  totalAlerts: number;
  activeAlerts: number;
  triggeredToday: number;
  unreadNotifications: number;
  favoriteSymbolsCount: number;
  portfolioValue: number;
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
  totalUsers: number;
  activeTrades: number;
}

interface CryptoWidget {
  symbol: string;
  price: string;
  change: number;
  icon: string;
}

interface RecentActivity {
  id: string;
  type: 'alert' | 'trade' | 'notification';
  message: string;
  time: string;
  icon: any;
  color: string;
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
    portfolioValue: 0,
    dailyPnL: 0,
    weeklyPnL: 0,
    monthlyPnL: 0,
    totalUsers: 0,
    activeTrades: 0,
  });

  const [cryptoWidgets] = useState<CryptoWidget[]>([
    { symbol: "BTC", price: "$67,234", change: 2.4, icon: "🟠" },
    { symbol: "ETH", price: "$3,421", change: -1.2, icon: "🔷" },
    { symbol: "ADA", price: "$0.52", change: 4.8, icon: "🔵" },
    { symbol: "SOL", price: "$142", change: 3.1, icon: "🟣" },
  ]);

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "alert",
      message: "BTC Alert triggered at $67,000",
      time: "2 min ago",
      icon: Target,
      color: "text-green-600"
    },
    {
      id: "2", 
      type: "trade",
      message: "ETH trade executed successfully",
      time: "15 min ago",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      id: "3",
      type: "notification",
      message: "New market analysis available",
      time: "1 hour ago",
      icon: BarChart3,
      color: "text-purple-600"
    }
  ]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Busca estatísticas de alertas
        const alertStats = await import('../../services/alertService').then(m => m.alertService.getAlertStats());
        // Busca notificações
        const notificationsResp = await import('../../services/notificationService').then(m => m.notificationService.getNotifications({ is_read: false }));

        setStats({
          totalAlerts: alertStats?.data?.total_alerts ?? 0,
          activeAlerts: alertStats?.data?.active_alerts ?? 0,
          triggeredToday: alertStats?.data?.triggered_today ?? 0,
          unreadNotifications: notificationsResp?.data?.unread_count ?? 0,
          favoriteSymbolsCount: user?.settings?.favorite_symbols?.length ?? 0,
          portfolioValue: 0, // Não disponível
          dailyPnL: 0, // Não disponível
          weeklyPnL: 0, // Não disponível
          monthlyPnL: 0, // Não disponível
          totalUsers: 0, // Não disponível
          activeTrades: 0, // Não disponível
        });
      } catch (error) {
        // Fallback para dados mock
        setStats({
          totalAlerts: 12,
          activeAlerts: 8,
          triggeredToday: 3,
          unreadNotifications: 5,
          favoriteSymbolsCount: 15,
          portfolioValue: 125847,
          dailyPnL: 2.34,
          weeklyPnL: 8.67,
          monthlyPnL: 23.12,
          totalUsers: 1247,
          activeTrades: 34,
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Fetch indicators and health status
  useEffect(() => {
    const fetchIndicatorsAndStatus = async () => {
      try {
        // Exemplo: Buscar RSI e EMA para BTCUSDT
        const rsi = await indicatorService.calculateRSI('BTCUSDT', '1h', 14);
        const ema = await indicatorService.calculateEMA('BTCUSDT', '1h', 21);
        // Exemplo: Buscar status do backend
        const health = await healthService.getHealth();
        // Atualize o estado ou widgets do dashboard com esses dados
        // setStats(prev => ({ ...prev, rsi: rsi.value, ema: ema.value, backendStatus: health.status }));
      } catch (error) {
        // Trate erros de integração
        console.error('Erro ao buscar indicadores ou status:', error);
      }
    };
    fetchIndicatorsAndStatus();
  }, []);

  if (loading) {
    return <Loading message="Carregando dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              PriceGuard Dashboard
            </h1>
            <p className="text-gray-600 text-lg mt-1">
              Bem-vindo de volta, {user?.name || "Trader"}! 
              <span className="ml-2 text-emerald-600 font-medium">Markets are active</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Data</span>
          </div>
        </div>

        {/* Hero Portfolio Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-8 text-white">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h3 className="text-lg font-medium text-white/80 mb-2">Portfolio Total</h3>
              <div className="text-5xl font-bold mb-2 tracking-tight">
                ${stats.portfolioValue.toLocaleString()}
              </div>
              <p className="text-white/70 text-lg">Across all exchanges and wallets</p>
              
              <div className="flex items-center justify-center lg:justify-start space-x-2 mt-4">
                <div className="flex items-center space-x-1 bg-green-500/20 px-3 py-1 rounded-full">
                  <TrendingUp size={16} className="text-green-300" />
                  <span className="text-green-300 font-semibold">+{stats.dailyPnL}% today</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              {["📈", "💎", "🚀"].map((emoji, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl transform hover:scale-110 transition-all duration-300 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Alertas Ativos",
              value: stats.activeAlerts,
              total: stats.totalAlerts,
              icon: Target,
              color: "from-emerald-500 to-emerald-600",
              change: "+12%",
              trend: "up"
            },
            {
              title: "Disparados Hoje",
              value: stats.triggeredToday,
              icon: Zap,
              color: "from-amber-500 to-orange-500",
              change: "+3",
              trend: "up"
            },
            {
              title: "Performance 7d",
              value: `${stats.weeklyPnL}%`,
              icon: TrendingUp,
              color: "from-blue-500 to-blue-600",
              change: "+5.2%",
              trend: "up"
            },
            {
              title: "Trades Ativos",
              value: stats.activeTrades,
              icon: Activity,
              color: "from-purple-500 to-purple-600",
              change: "Live",
              trend: "neutral"
            }
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                    {stat.total && <span className="text-lg text-gray-500">/{stat.total}</span>}
                  </p>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.trend === 'up' && <ArrowUpRight size={14} />}
                    {stat.trend === 'down' && <ArrowDownRight size={14} />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Crypto Quick View */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Market Overview</h3>
                <Link 
                  to="/market" 
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cryptoWidgets.map((crypto, index) => (
                  <div
                    key={crypto.symbol}
                    className="group p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:shadow-lg cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg">{crypto.icon}</span>
                      <span className="font-bold text-gray-900">{crypto.symbol}</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                      {crypto.price}
                    </div>
                    <div className={`flex items-center space-x-1 text-sm font-medium ${
                      crypto.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {crypto.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span>{crypto.change >= 0 ? '+' : ''}{crypto.change}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Activity Feed */}
          <div>
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-xl h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <Clock size={20} className="text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <activity.icon size={16} className={activity.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link 
                  to="/notifications" 
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center space-x-1"
                >
                  <span>View All Activity</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-8 bg-white/60 backdrop-blur-sm border-0 shadow-xl">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles size={24} className="text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "New Alert", to: "/alerts", icon: Target, color: "from-emerald-500 to-emerald-600" },
              { label: "Market View", to: "/market", icon: BarChart3, color: "from-blue-500 to-blue-600" },
              { label: "Portfolio", to: "/portfolio", icon: DollarSign, color: "from-purple-500 to-purple-600" },
              { label: "Notifications", to: "/notifications", icon: Bell, color: "from-amber-500 to-amber-600" },
              { label: "Settings", to: "/profile", icon: Settings, color: "from-gray-500 to-gray-600" },
            ].map((action, index) => (
              <Link key={action.label} to={action.to}>
                <button
                  className={`w-full p-4 rounded-xl bg-gradient-to-br ${action.color} hover:scale-105 transition-all duration-200 flex flex-col items-center space-y-2 shadow-lg hover:shadow-xl group`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <action.icon size={24} className="text-white group-hover:scale-110 transition-transform" />
                  <span className="text-white text-sm font-medium">{action.label}</span>
                </button>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
