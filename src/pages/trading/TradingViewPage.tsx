import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  ChartLine, 
  TrendUp, 
  TrendDown, 
  Bell, 
  Star, 
  Gear
} from '@phosphor-icons/react';
import { Card, Button } from '../../components/ui';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { cryptoService } from '../../services/cryptoService';
import { alertService } from '../../services/alertService';
import { LatestPriceData, PriceHistory } from '../../models/PriceHistory';
import { Alert } from '../../models/Alert';
import TradingViewModal from '../../modal/TradingViewModal';

const TradingViewPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [searchParams] = useSearchParams();
  const webSocket = useWebSocket();
  
  const [priceData, setPriceData] = useState<LatestPriceData | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [userAlerts, setUserAlerts] = useState<Alert[]>([]);
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d">("1h");
  const [loading, setLoading] = useState(true);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['RSI', 'MACD']);

  const cryptoSymbol = symbol || 'BTCUSDT';

  // Load price data and history
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [priceResponse, alertsResponse] = await Promise.all([
          cryptoService.getLatestPrices([cryptoSymbol]),
          alertService.getAlerts({ symbol: cryptoSymbol })
        ]);

        if (priceResponse.data.prices.length > 0) {
          setPriceData(priceResponse.data.prices[0]);
        }

        // For now, we'll skip price history as it requires a different API structure
        // TODO: Implement price history API call based on backend specification

        setUserAlerts(alertsResponse.data.alerts || []);

      } catch (error) {
        console.error('Failed to load trading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cryptoSymbol, timeframe]);

  // Subscribe to real-time price updates
  useEffect(() => {
    webSocket.subscribeToPriceUpdates([cryptoSymbol]);
    
    return () => {
      webSocket.unsubscribeFromPriceUpdates([cryptoSymbol]);
    };
  }, [cryptoSymbol, webSocket]);

  // Update price data from WebSocket
  useEffect(() => {
    const latestPrice = webSocket.priceUpdates.get(cryptoSymbol);
    if (latestPrice) {
      setPriceData(latestPrice);
    }
  }, [webSocket.priceUpdates, cryptoSymbol]);

  const handleCreateQuickAlert = async (type: 'above' | 'below') => {
    if (!priceData) return;

    const alertPrice = type === 'above' 
      ? priceData.price * 1.05 // 5% above current price
      : priceData.price * 0.95; // 5% below current price

    try {
      await alertService.createAlert({
        symbol: cryptoSymbol,
        alert_type: type === 'above' ? 'price_above' : 'price_below',
        condition_value: alertPrice,
        condition_operator: type === 'above' ? '>' : '<',
        message: `Preço do ${cryptoSymbol} ${type === 'above' ? 'subiu acima' : 'caiu abaixo'} de $${alertPrice.toFixed(2)}`
      });

      // Reload alerts
      const alertsResponse = await alertService.getAlerts({ symbol: cryptoSymbol });
      setUserAlerts(alertsResponse.data.alerts || []);
    } catch (error) {
      console.error('Failed to create alert:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return {
      value: Math.abs(change),
      isPositive,
      formatted: `${isPositive ? '+' : '-'}${Math.abs(change).toFixed(2)}%`,
      textColor: isPositive ? 'text-success' : 'text-error'
    };
  };

  const timeframes = [
    { value: '1m', label: '1m' },
    { value: '5m', label: '5m' },
    { value: '15m', label: '15m' },
    { value: '1h', label: '1h' },
    { value: '4h', label: '4h' },
    { value: '1d', label: '1d' }
  ];

  const indicators = [
    { id: 'RSI', name: 'RSI', icon: TrendUp },
    { id: 'MACD', name: 'MACD', icon: TrendDown },
    { id: 'SMA', name: 'SMA', icon: ChartLine },
    { id: 'EMA', name: 'EMA', icon: ChartLine },
    { id: 'BB', name: 'Bollinger Bands', icon: Gear }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados de análise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Análise Técnica</h1>
            <p className="text-gray-600 mt-1">
              Análise detalhada de {cryptoSymbol}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowCreateAlert(true)}
              className="btn-primary"
            >
              <Bell size={16} />
              Criar Alerta
            </Button>
          </div>
        </div>

        {/* Price Summary */}
        {priceData && (
          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{cryptoSymbol}</h2>
                  <p className="text-3xl font-bold text-primary-600 mt-1">
                    {formatPrice(priceData.price)}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">Variação 24h</p>
                  <p className={`text-lg font-semibold ${formatChange(priceData.change_percent_24h).textColor}`}>
                    {formatChange(priceData.change_percent_24h).formatted}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Volume 24h</p>
                  <p className="text-lg font-semibold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      notation: 'compact'
                    }).format(priceData.volume_24h)}
                  </p>
                </div>
                
                {priceData.market_cap && (
                  <div>
                    <p className="text-sm text-gray-600">Market Cap</p>
                    <p className="text-lg font-semibold">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        notation: 'compact'
                      }).format(priceData.market_cap)}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-600">Última Atualização</p>
                  <p className="text-lg font-semibold">
                    {new Date(priceData.last_updated).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => handleCreateQuickAlert('above')}
            className="btn-success"
          >
            <TrendUp size={16} />
            Alerta Acima
          </Button>
          
          <Button
            onClick={() => handleCreateQuickAlert('below')}
            className="btn-error"
          >
            <TrendDown size={16} />
            Alerta Abaixo
          </Button>
          
          <Button
            onClick={() => setShowCreateAlert(true)}
            className="btn-outline-primary"
          >
            <Gear size={16} />
            Alerta Personalizado
          </Button>
          
          <Button
            className="btn-outline-secondary"
          >
            <Star size={16} />
            Adicionar aos Favoritos
          </Button>
        </div>

        {/* Chart Controls */}
        <Card>
          <Card.Body>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Timeframe</h3>
                <div className="flex space-x-2">
                  {timeframes.map((tf) => (
                    <button
                      key={tf.value}
                      onClick={() => setTimeframe(tf.value as any)}
                      className={`px-3 py-1 rounded ${
                        timeframe === tf.value
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Indicadores</h3>
                <div className="flex flex-wrap gap-2">
                  {indicators.map((indicator) => {
                    const Icon = indicator.icon;
                    const isSelected = selectedIndicators.includes(indicator.id);
                    
                    return (
                      <button
                        key={indicator.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedIndicators(prev => prev.filter(id => id !== indicator.id));
                          } else {
                            setSelectedIndicators(prev => [...prev, indicator.id]);
                          }
                        }}
                        className={`flex items-center space-x-1 px-3 py-1 rounded ${
                          isSelected
                            ? 'bg-secondary-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Icon size={14} />
                        <span className="text-sm">{indicator.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* TradingView Chart Placeholder */}
        <Card>
          <Card.Body>
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartLine size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Gráfico TradingView</p>
                <p className="text-sm text-gray-500 mt-1">
                  Integração com TradingView será implementada aqui
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* User Alerts */}
        {userAlerts.length > 0 && (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Seus Alertas para {cryptoSymbol}</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {userAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.is_active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {alert.alert_type === 'price_above' ? 'Preço Acima' : 'Preço Abaixo'} de{' '}
                          {formatPrice(alert.condition_value)}
                        </p>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            alert.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {alert.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                        <Bell size={14} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* TradingView Modal for detailed chart */}
        {showCreateAlert && (
          <TradingViewModal
            symbol={cryptoSymbol}
            isOpen={showCreateAlert}
            onClose={() => setShowCreateAlert(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TradingViewPage;
