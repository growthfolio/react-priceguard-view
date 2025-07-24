import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Card } from '../../components/ui';
import { 
  MagnifyingGlass, 
  ChartLine, 
  TrendUp, 
  TrendDown, 
  Star, 
  Globe
} from '@phosphor-icons/react';
import AdvancedDataDashboard from '../../components/marketTable/advancedDashboard/AdvancedDataDashboard';
import { generateColumns, mockMarketData, ResizableSortableTable } from '../../components/marketTable';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { CryptoRow, LatestPriceData } from '../../models';
import TradingViewModal from '../../modal/TradingViewModal';
import { cryptoService } from '../../services/cryptoService';
import { Link } from 'react-router-dom';

const MarketsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'advanced'>('overview');
  const [dataSource, setDataSource] = useState<CryptoRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalSymbol, setModalSymbol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'gainers' | 'losers' | 'favorites'>('all');
  const webSocket = useWebSocket();

  // Controle centralizado de dados mockados ou reais
  const useMockData = false; // Changed to false to use real data

  const handleOpenModal = (symbol: string) => {
    console.log('Opening modal for symbol:', symbol);
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
        // Busca dados reais da API
        const response = await cryptoService.getMarketData({ page, limit, search: searchTerm });
        // Adapta os dados recebidos para o formato CryptoRow
        // Corrigido: acessar response.data.cryptos
        const realData: CryptoRow[] = (response.data.cryptos ?? []).map((item: LatestPriceData, idx: number) => ({
          id: idx,
          symbol: item.symbol,
          rawSymbol: item.symbol,
          marketType: null,
          imgurl: null,
          active: true,
          priceChange_1m: '',
          priceChange_5m: '',
          priceChange_15m: '',
          priceChange_1h: '',
          priceChange_1d: `${item.change_percent_24h?.toFixed(2) || 0}%`,
          pullbackEntry_5m: null,
          pullbackEntry_15m: null,
          pullbackEntry_1h: null,
          pullbackEntry_4h: null,
          pullbackEntry_1d: null,
          superTrend4h_5m: null,
          superTrend4h_15m: null,
          superTrend4h_1h: null,
          trueRange_1m: '',
          trueRange_5m: '',
          trueRange_15m: '',
          trueRange_1h: '',
          rsi_5m: 0,
          rsi_15m: 0,
          rsi_1h: 0,
          rsi_4h: 0,
          rsi_1d: 0,
          ematrend_15m: '',
          ematrend_1h: '',
          ematrend_4h: '',
          ematrend_1d: '',
          bot: null,
          market: null,
        }));
        setDataSource(realData);
        // Subscribe to real-time price updates for visible symbols
        const symbols = realData.slice(0, 20).map(row => row.rawSymbol).filter(Boolean) as string[];
        webSocket.subscribeToPriceUpdates(symbols);
      } catch (error) {
        console.error('Failed to load crypto data:', error);
        setDataSource([]);
      } finally {
        setLoading(false);
      }
    };
    loadCryptoData();
  }, [page, limit, searchTerm, useMockData]); // Removed webSocket dependency

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
            // TODO: Update more fields when CryptoRow interface is aligned with API
          };
        }
        return row;
      })
    );
  }, [priceUpdatesSize]); // Use stable reference

  // Filtrar dados baseado no termo de busca
  const filteredData = dataSource.filter(item => 
    item.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rawSymbol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Top gainers e losers para overview
  const topGainers = filteredData
    .filter(item => {
      const change = parseFloat(item.priceChange_1d.replace('%', ''));
      return !isNaN(change) && change > 0;
    })
    .sort((a, b) => {
      const changeA = parseFloat(a.priceChange_1d.replace('%', ''));
      const changeB = parseFloat(b.priceChange_1d.replace('%', ''));
      return changeB - changeA;
    })
    .slice(0, 5);

  const topLosers = dataSource
    .filter(item => parseFloat(item.priceChange_1d.replace('%', '')) < 0)
    .sort((a, b) => parseFloat(a.priceChange_1d.replace('%', '')) - parseFloat(b.priceChange_1d.replace('%', '')))
    .slice(0, 5);

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: ChartLine },
    { id: 'table', label: 'Tabela Completa', icon: MagnifyingGlass },
    { id: 'advanced', label: 'Dashboard Avançado', icon: TrendUp }
  ];

  const formatChange = (change: string) => {
    const value = parseFloat(change.replace('%', ''));
    return {
      value: Math.abs(value),
      isPositive: value >= 0,
      formatted: `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
    };
  };

  const MarketOverview = () => (
    <div className="space-y-8">
      {/* Market Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm">Total de Moedas</p>
                <p className="text-2xl font-bold">{loading ? "..." : filteredData.length}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ChartLine size={24} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="bg-gradient-to-r from-success to-green-600 text-white border-0">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Em Alta (24h)</p>
                <p className="text-2xl font-bold">{topGainers.length}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendUp size={24} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="bg-gradient-to-r from-error to-red-600 text-white border-0">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Em Baixa (24h)</p>
                <p className="text-2xl font-bold">{topLosers.length}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendDown size={24} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white border-0">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-100 text-sm">Ativos</p>
                <p className="text-2xl font-bold">{dataSource.filter(item => item.active).length}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Star size={24} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Top Gainers and Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Gainers */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <TrendUp size={20} className="text-success" />
              <h3 className="text-lg font-semibold">Maiores Altas (24h)</h3>
            </div>
          </Card.Header>
          <Card.Body className="space-y-4">
            {topGainers.map((item, index) => {
              const change = formatChange(item.priceChange_1d);
              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-neutral-500">#{index + 1}</span>
                    <div>
                      <p className="font-semibold text-neutral-900">{item.rawSymbol}</p>
                      <p className="text-sm text-neutral-500">{item.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-success font-semibold">+{change.value.toFixed(2)}%</p>
                  </div>
                </div>
              );
            })}
          </Card.Body>
        </Card>

        {/* Top Losers */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <TrendDown size={20} className="text-error" />
              <h3 className="text-lg font-semibold">Maiores Baixas (24h)</h3>
            </div>
          </Card.Header>
          <Card.Body className="space-y-4">
            {topLosers.map((item, index) => {
              const change = formatChange(item.priceChange_1d);
              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-neutral-500">#{index + 1}</span>
                    <div>
                      <p className="font-semibold text-neutral-900">{item.rawSymbol}</p>
                      <p className="text-sm text-neutral-500">{item.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-error font-semibold">{change.formatted}</p>
                  </div>
                </div>
              );
            })}
          </Card.Body>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                Mercado de <span className="gradient-text">Criptomoedas</span>
              </h1>
              <p className="text-neutral-600 text-lg">
                Acompanhe os preços e tendências do mercado em tempo real
              </p>
            </div>
            
            {/* Search */}
            <div className="relative mt-4 lg:mt-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlass size={20} className="text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar criptomoeda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 pr-4 py-3 w-full lg:w-80"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-neutral-200 p-1 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-primary-600 shadow-soft'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && <MarketOverview />}
          
          {activeTab === 'table' && (
            <div className="space-y-4">
              <Card>
                <Card.Body className="p-0">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : (
                    <ResizableSortableTable columns={columns} data={paginatedData} />
                  )}
                </Card.Body>
              </Card>
              
              {/* Pagination */}
              {filteredData.length > limit && (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="btn btn-outline disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  
                  <span className="text-sm text-gray-600">
                    Página {page} de {Math.ceil(filteredData.length / limit)}
                  </span>
                  
                  <button
                    onClick={() => setPage(Math.min(Math.ceil(filteredData.length / limit), page + 1))}
                    disabled={page >= Math.ceil(filteredData.length / limit)}
                    className="btn btn-outline disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'advanced' && (
            <AdvancedDataDashboard useMockData={useMockData} />
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
    </div>
  );
};

export default MarketsPage;
