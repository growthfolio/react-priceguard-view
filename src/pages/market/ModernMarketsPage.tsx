import React, { useEffect, useState, useMemo } from 'react';
import { 
  Card, 
  StatCard, 
  GlassCard, 
  FilterChip, 
  QuickActionCard 
} from '../../components/ui';
import { 
  MagnifyingGlass, 
  ChartLine, 
  TrendUp, 
  TrendDown, 
  Star,
  Lightning,
  ArrowRight,
  Sparkle,
  Globe
} from '@phosphor-icons/react';
import AdvancedDataDashboard from '../../components/marketTable/advancedDashboard/AdvancedDataDashboard';
import { generateColumns, mockMarketData, ResizableSortableTable } from '../../components/marketTable';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { CryptoRow } from '../../models';
import TradingViewModal from '../../modal/TradingViewModal';
import '../../styles/markets-modern.css';

const ModernMarketsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'advanced'>('overview');
  const [dataSource, setDataSource] = useState<CryptoRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalSymbol, setModalSymbol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('market_cap');
  const webSocket = useWebSocket();

  const useMockData = false;

  const handleOpenModal = (symbol: string) => {
    setModalSymbol(symbol);
  };

  const handleCloseModal = () => {
    setModalSymbol(null);
  };

  const columns = generateColumns(handleOpenModal);

  // Load initial crypto data and setup real-time updates
  useEffect(() => {
    const loadCryptoData = async () => {
      if (useMockData) {
        setDataSource(mockMarketData);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setDataSource(mockMarketData);
        const symbols = mockMarketData.slice(0, 20).map(row => row.rawSymbol).filter(Boolean) as string[];
        webSocket.subscribeToPriceUpdates(symbols);
      } catch (error) {
        console.error('Failed to load crypto data:', error);
        setDataSource(mockMarketData);
      } finally {
        setLoading(false);
      }
    };

    loadCryptoData();
  }, [page, limit, searchTerm, useMockData]);

  // Update data when WebSocket price updates arrive
  const priceUpdatesSize = useMemo(() => webSocket.priceUpdates.size, [webSocket.priceUpdates]);
  
  useEffect(() => {
    if (priceUpdatesSize === 0) return;

    setDataSource(prevData => 
      prevData.map(row => {
        if (!row.rawSymbol) return row;
        
        const priceData = webSocket.priceUpdates.get(row.rawSymbol);
        if (priceData) {
          return {
            ...row,
            priceChange_1d: `${priceData.change_percent_24h?.toFixed(2) || 0}%`,
          };
        }
        return row;
      })
    );
  }, [priceUpdatesSize]);

  // Enhanced filtering
  const filteredData = dataSource.filter(item => {
    const matchesSearch = item.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.rawSymbol?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const change = parseFloat(item.priceChange_1d.replace('%', ''));
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'top10' && item.id && item.id <= 10) ||
                           (selectedCategory === 'gainers' && change > 0) ||
                           (selectedCategory === 'losers' && change < 0);
    
    // Note: Price filtering would need actual price data from the model
    const matchesPriceRange = priceRange === 'all';
    
    return matchesSearch && matchesCategory && matchesPriceRange;
  });

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Calculate market stats
  const marketStats = useMemo(() => {
    const totalCoins = dataSource.length;
    const gainers = dataSource.filter(item => parseFloat(item.priceChange_1d.replace('%', '')) > 0).length;
    const losers = dataSource.filter(item => parseFloat(item.priceChange_1d.replace('%', '')) < 0).length;
    const activeAssets = dataSource.filter(item => item.active).length;
    
    return { totalCoins, gainers, losers, activeAssets };
  }, [dataSource]);

  const topGainers = useMemo(() => 
    filteredData
      .filter(item => {
        const change = parseFloat(item.priceChange_1d.replace('%', ''));
        return !isNaN(change) && change > 0;
      })
      .sort((a, b) => {
        const changeA = parseFloat(a.priceChange_1d.replace('%', ''));
        const changeB = parseFloat(b.priceChange_1d.replace('%', ''));
        return changeB - changeA;
      })
      .slice(0, 5),
    [filteredData]
  );

  const topLosers = useMemo(() => 
    dataSource
      .filter(item => parseFloat(item.priceChange_1d.replace('%', '')) < 0)
      .sort((a, b) => parseFloat(a.priceChange_1d.replace('%', '')) - parseFloat(b.priceChange_1d.replace('%', '')))
      .slice(0, 5),
    [dataSource]
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'table', label: 'Tabela Completa', icon: '📋' },
    { id: 'advanced', label: 'Dashboard Avançado', icon: '🚀' }
  ];

  const formatChange = (change: string) => {
    const value = parseFloat(change.replace('%', ''));
    return {
      value: Math.abs(value),
      isPositive: value >= 0,
      formatted: `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
    };
  };

  // Modern Market Overview Component
  const MarketOverview = () => (
    <div className="modern-markets-container">
      {/* Header Stats with Modern StatCards */}
      <div className="market-stats-grid">
        <StatCard
          icon={<ChartLine size={24} />}
          value={marketStats.totalCoins.toString()}
          label="Total de Moedas"
          iconColor="blue"
        />
        <StatCard
          icon={<TrendUp size={24} />}
          value={marketStats.gainers.toString()}
          label="Em Alta (24h)"
          change={{
            value: `+${((marketStats.gainers / marketStats.totalCoins) * 100).toFixed(1)}%`,
            isPositive: true
          }}
          iconColor="green"
        />
        <StatCard
          icon={<TrendDown size={24} />}
          value={marketStats.losers.toString()}
          label="Em Baixa (24h)"
          change={{
            value: `-${((marketStats.losers / marketStats.totalCoins) * 100).toFixed(1)}%`,
            isPositive: false
          }}
          iconColor="orange"
        />
        <StatCard
          icon={<Star size={24} />}
          value={marketStats.activeAssets.toString()}
          label="Ativos Favoritos"
          iconColor="purple"
        />
      </div>

      {/* Smart Filters */}
      <GlassCard padding="lg" rounded="xl" className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <span>🔍</span>
          <span>Filtros Inteligentes</span>
        </h3>
        <div className="filter-chips mb-4">
          <FilterChip
            label="Todos"
            icon="🌟"
            isActive={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
            variant="info"
          />
          <FilterChip
            label="Top 10"
            icon="🏆"
            isActive={selectedCategory === 'top10'}
            onClick={() => setSelectedCategory('top10')}
            variant="warning"
          />
          <FilterChip
            label="Maiores Altas"
            icon="📈"
            isActive={selectedCategory === 'gainers'}
            onClick={() => setSelectedCategory('gainers')}
            variant="success"
          />
          <FilterChip
            label="Maiores Baixas"
            icon="📉"
            isActive={selectedCategory === 'losers'}
            onClick={() => setSelectedCategory('losers')}
            variant="primary"
          />
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar criptomoedas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
          />
        </div>
      </GlassCard>

      {/* Quick Actions Panel */}
      <GlassCard padding="lg" rounded="xl" className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <span>⚡</span>
          <span>Ações Rápidas</span>
        </h3>
        <div className="quick-actions-grid">
          <QuickActionCard
            icon={<ChartLine size={20} />}
            label="Dashboard"
            onClick={() => setActiveTab('advanced')}
            variant="primary"
          />
          <QuickActionCard
            icon="🔔"
            label="Criar Alerta"
            onClick={() => console.log('Create alert')}
            variant="warning"
          />
          <QuickActionCard
            icon={<Star size={20} />}
            label="Favoritos"
            onClick={() => console.log('View favorites')}
            variant="success"
          />
          <QuickActionCard
            icon="📱"
            label="App Mobile"
            onClick={() => console.log('Mobile app')}
            variant="default"
          />
        </div>
      </GlassCard>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Gainers */}
        <GlassCard padding="lg" rounded="xl">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendUp size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Maiores Altas (24h)</h3>
          </div>
          <div className="space-y-4">
            {topGainers.map((item, index) => {
              const change = formatChange(item.priceChange_1d);
              return (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors cursor-pointer"
                  onClick={() => handleOpenModal(item.rawSymbol || '')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {item.rawSymbol?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.rawSymbol}</p>
                      <p className="text-sm text-gray-500">{item.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <TrendUp className="text-green-500" size={16} />
                      <span className="text-green-600 font-semibold">+{change.value.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Top Losers */}
        <GlassCard padding="lg" rounded="xl">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendDown size={20} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Maiores Baixas (24h)</h3>
          </div>
          <div className="space-y-4">
            {topLosers.map((item, index) => {
              const change = formatChange(item.priceChange_1d);
              return (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
                  onClick={() => handleOpenModal(item.rawSymbol || '')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {item.rawSymbol?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.rawSymbol}</p>
                      <p className="text-sm text-gray-500">{item.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <TrendDown className="text-red-500" size={16} />
                      <span className="text-red-600 font-semibold">-{change.value.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );

  return (
    <div className="markets-container">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header */}
        <div className="market-header">
          <div className="market-header-content">
            <h1 className="market-title">
              🚀 Mercado de Criptomoedas
            </h1>
            <p className="market-subtitle">
              Acompanhe os preços e tendências do mercado em tempo real com nossa interface moderna
            </p>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div className="modern-tabs flex justify-center gap-2 my-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'table' | 'advanced')}
              className={`modern-tab px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-md border-2 border-transparent
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-400 scale-105 shadow-lg'
                  : 'bg-white/60 text-gray-700 hover:bg-blue-100 hover:border-blue-300'}
              `}
              style={{ minWidth: 140 }}
            >
              <span className={`tab-icon text-lg ${activeTab === tab.id ? 'scale-125 drop-shadow' : 'text-blue-500'}`}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Based on Active Tab */}
        <div className="tab-content">
          {activeTab === 'overview' && <MarketOverview />}
          
          {activeTab === 'table' && (
            <GlassCard padding="lg" rounded="xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">📋 Tabela Completa de Mercado</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Mostrando {startIndex + 1}-{Math.min(endIndex, filteredData.length)} de {filteredData.length} resultados
                  </span>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Carregando dados do mercado...</p>
                </div>
              ) : (
                <ResizableSortableTable
                  columns={columns}
                  data={paginatedData}
                />
              )}
            </GlassCard>
          )}

          {activeTab === 'advanced' && (
            <GlassCard padding="lg" rounded="xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">🚀 Dashboard Avançado</h2>
                <div className="flex items-center space-x-2">
                  <Sparkle size={20} className="text-purple-500" />
                  <span className="text-sm text-gray-600">Interface Avançada</span>
                </div>
              </div>
              <AdvancedDataDashboard useMockData={useMockData} />
            </GlassCard>
          )}
        </div>

        {/* Pagination */}
        {activeTab === 'table' && filteredData.length > limit && (
          <div className="pagination-container">
            <div className="pagination">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                ← Anterior
              </button>
              
              <span className="pagination-info">
                Página {page} de {Math.ceil(filteredData.length / limit)}
              </span>
              
              <button
                onClick={() => setPage(Math.min(Math.ceil(filteredData.length / limit), page + 1))}
                disabled={page >= Math.ceil(filteredData.length / limit)}
                className="pagination-btn"
              >
                Próxima →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TradingView Modal */}
      {modalSymbol && (
        <TradingViewModal
          symbol={modalSymbol}
          isOpen={!!modalSymbol}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ModernMarketsPage;
