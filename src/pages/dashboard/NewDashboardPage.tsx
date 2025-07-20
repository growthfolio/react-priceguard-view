import React, { useState, useEffect } from 'react';
import { ModernDashboardStats, HeroMetric, ModernCard } from '../../components/modern/ModernDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Bell, 
  Target,
  ChartLine,
  Zap,
  Clock,
  DollarSign
} from 'lucide-react';

interface NewDashboardStats {
  totalAlerts: number;
  activeAlerts: number;
  triggeredToday: number;
  unreadNotifications: number;
  portfolioValue: number;
  dailyPnL: number;
}

const NewDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<NewDashboardStats>({
    totalAlerts: 0,
    activeAlerts: 0,
    triggeredToday: 0,
    unreadNotifications: 0,
    portfolioValue: 0,
    dailyPnL: 0,
  });

  const [recentActivity] = useState([
    { id: 1, action: "BTC Alert Triggered", time: "2 min ago", type: "success" },
    { id: 2, action: "New ETH Position", time: "5 min ago", type: "info" },
    { id: 3, action: "Stop Loss Hit", time: "10 min ago", type: "warning" },
    { id: 4, action: "Portfolio Rebalanced", time: "1 hour ago", type: "success" },
  ]);

  const mockChartData = [65, 78, 72, 88, 95, 84, 92, 98, 105, 112, 108, 125];

  // Load dashboard data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStats({
          totalAlerts: 24,
          activeAlerts: 18,
          triggeredToday: 6,
          unreadNotifications: 3,
          portfolioValue: 125340,
          dailyPnL: 12.7,
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const ActivityCard: React.FC = () => (
    <ModernCard variant="minimal" className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Atividade Recente</h3>
        <Activity size={24} className="text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {recentActivity.map((activity, index) => (
          <div 
            key={activity.id}
            className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`
              w-3 h-3 rounded-full flex-shrink-0
              ${activity.type === 'success' ? 'bg-emerald-400' : ''}
              ${activity.type === 'info' ? 'bg-blue-400' : ''}
              ${activity.type === 'warning' ? 'bg-amber-400' : ''}
              group-hover:scale-125 transition-transform
            `} />
            
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                {activity.action}
              </p>
              <p className="text-xs text-gray-500 flex items-center space-x-1">
                <Clock size={12} />
                <span>{activity.time}</span>
              </p>
            </div>
            
            <ChartLine size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          Ver Todas as Atividades
        </button>
      </div>
    </ModernCard>
  );

  const QuickActionsCard: React.FC = () => (
    <ModernCard variant="neon" className="h-full">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Ações Rápidas</h3>
        <p className="text-gray-300 text-sm">Acesso rápido às principais funcionalidades</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Novo Alerta", icon: Target, color: "from-blue-500 to-blue-600" },
          { label: "Portfolio", icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
          { label: "Análise", icon: ChartLine, color: "from-purple-500 to-purple-600" },
          { label: "Alertas", icon: Bell, color: "from-amber-500 to-amber-600" },
        ].map((action, index) => (
          <button
            key={action.label}
            className={`
              p-4 rounded-xl bg-gradient-to-br ${action.color}
              hover:scale-105 transition-all duration-200
              flex flex-col items-center space-y-2
              shadow-lg hover:shadow-xl
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <action.icon size={24} className="text-white" />
            <span className="text-white text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </ModernCard>
  );

  const MarketOverviewCard: React.FC = () => (
    <ModernCard variant="glass" className="col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Visão Geral do Mercado</h3>
          <p className="text-gray-600 text-sm">Principais criptomoedas em tempo real</p>
        </div>
        <TrendingUp size={24} className="text-emerald-500" />
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {[
          { symbol: "BTC", price: "$67,543", change: 5.2, color: "text-orange-500" },
          { symbol: "ETH", price: "$3,821", change: -2.1, color: "text-blue-500" },
          { symbol: "ADA", price: "$0.45", change: 8.7, color: "text-purple-500" },
        ].map((crypto, index) => (
          <div 
            key={crypto.symbol}
            className="text-center p-4 rounded-xl bg-white/50 hover:bg-white/70 transition-colors"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className={`text-2xl font-bold ${crypto.color} mb-1`}>
              {crypto.symbol}
            </div>
            <div className="text-lg font-semibold text-gray-900 mb-2">
              {crypto.price}
            </div>
            <div className={`
              flex items-center justify-center space-x-1 text-sm font-medium
              ${crypto.change >= 0 ? 'text-emerald-600' : 'text-red-600'}
            `}>
              {crypto.change >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span>{crypto.change >= 0 ? '+' : ''}{crypto.change}%</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <ChartLine size={32} className="text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Gráfico de mercado será exibido aqui</p>
        </div>
      </div>
    </ModernCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Dashboard Moderno
            </h1>
            <p className="text-gray-600 text-lg mt-1">
              Bem-vindo de volta, {user?.name || "Trader"}! 
              <span className="ml-2 text-emerald-600 font-medium">Market is bullish today</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Data</span>
          </div>
        </div>

        {/* Hero Metric */}
        <HeroMetric
          title="Portfolio Performance"
          value={loading ? "$0" : `$${stats.portfolioValue.toLocaleString()}`}
          subtitle="Total portfolio value across all exchanges"
          change={stats.dailyPnL}
          chartData={mockChartData}
        />

        {/* Stats Cards */}
        <ModernDashboardStats stats={stats} loading={loading} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Market Overview - Takes 2 columns */}
          <MarketOverviewCard />
          
          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityCard />
          </div>
          
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActionsCard />
          </div>
        </div>

        {/* Additional Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <ModernCard variant="minimal">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Alertas Ativos</h4>
              <Target size={20} className="text-blue-500" />
            </div>
            <div className="space-y-3">
              {[
                { coin: "BTC", condition: "> $70,000", status: "active" },
                { coin: "ETH", condition: "< $3,500", status: "pending" },
                { coin: "SOL", condition: "> $150", status: "triggered" },
              ].map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{alert.coin}</span>
                    <span className="text-gray-600 text-sm ml-2">{alert.condition}</span>
                  </div>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${alert.status === 'active' ? 'bg-emerald-100 text-emerald-800' : ''}
                    ${alert.status === 'pending' ? 'bg-amber-100 text-amber-800' : ''}
                    ${alert.status === 'triggered' ? 'bg-blue-100 text-blue-800' : ''}
                  `}>
                    {alert.status}
                  </span>
                </div>
              ))}
            </div>
          </ModernCard>

          <ModernCard variant="glass">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Performance Hoje</h4>
              <Zap size={20} className="text-purple-500" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ganhos realizados</span>
                <span className="text-emerald-600 font-semibold">+$2,341</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trades executados</span>
                <span className="text-gray-900 font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxa de sucesso</span>
                <span className="text-blue-600 font-semibold">75%</span>
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="minimal">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Próximos Eventos</h4>
              <Clock size={20} className="text-amber-500" />
            </div>
            <div className="space-y-3">
              {[
                { event: "Fed Meeting", time: "2h", impact: "high" },
                { event: "BTC Halving", time: "24d", impact: "very-high" },
                { event: "ETH Upgrade", time: "7d", impact: "medium" },
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{event.event}</span>
                    <span className="text-gray-600 text-sm block">em {event.time}</span>
                  </div>
                  <div className={`
                    w-3 h-3 rounded-full
                    ${event.impact === 'very-high' ? 'bg-red-500' : ''}
                    ${event.impact === 'high' ? 'bg-orange-500' : ''}
                    ${event.impact === 'medium' ? 'bg-yellow-500' : ''}
                  `} />
                </div>
              ))}
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default NewDashboardPage;
