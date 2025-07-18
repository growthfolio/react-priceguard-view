import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { sessionService } from '../../services/sessionService';

interface HealthCheck {
  status: string;
  version?: string;
  timestamp?: string;
  database?: string;
  redis?: string;
}

const BackendTestPage: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [healthData, setHealthData] = useState<HealthCheck | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing backend connection...');
      console.log('API URL:', process.env.REACT_APP_API_URL);
      
      // Test basic connectivity
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHealthData(data);
        setIsConnected(true);
        console.log('Backend connection successful:', data);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err: any) {
      console.error('Backend connection failed:', err);
      setError(err.message || 'Erro desconhecido');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const testApiEndpoints = async () => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      
      // Test different endpoints based on the actual backend routes
      const publicEndpoints = [
        '/health',
        '/health/live', 
        '/health/ready',
        '/test/binance/ping',
        '/test/binance/symbols',
        '/test/crypto/live-prices',
        '/test/crypto/collection-status'
      ];

      const protectedEndpoints = [
        '/api/user/profile',
        '/api/crypto/data',
        '/api/alerts',
        '/api/notifications'
      ];

      console.log('🧪 Testing public endpoints...');
      
      // Test public endpoints
      for (const endpoint of publicEndpoints) {
        try {
          const response = await fetch(`${baseUrl}${endpoint}`);
          const data = response.ok ? await response.json() : { error: `HTTP ${response.status}` };
          console.log(`✅ ${endpoint}:`, { status: response.status, data });
        } catch (err) {
          console.log(`❌ ${endpoint}:`, err);
        }
      }

      console.log('🔒 Testing protected endpoints (expect 401 without auth)...');
      
      // Test protected endpoints (should return 401 without auth)
      for (const endpoint of protectedEndpoints) {
        try {
          const response = await fetch(`${baseUrl}${endpoint}`);
          const data = response.ok ? await response.json() : { error: `HTTP ${response.status}` };
          console.log(`${response.status === 401 ? '�' : '❌'} ${endpoint}:`, { status: response.status, data });
        } catch (err) {
          console.log(`❌ ${endpoint}:`, err);
        }
      }

    } catch (err: any) {
      console.error('API endpoints test failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testWebSocket = () => {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const wsUrl = baseUrl.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws';
    console.log('🔌 Testing WebSocket connection to:', wsUrl);
    
    try {
      const ws = new WebSocket(wsUrl);
      
      const timeout = setTimeout(() => {
        console.log('⏰ WebSocket connection timeout - closing');
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      }, 5000);
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        clearTimeout(timeout);
        // Send a test message
        ws.send(JSON.stringify({ type: 'ping', message: 'test connection', timestamp: new Date().toISOString() }));
        setTimeout(() => ws.close(), 2000);
      };
      
      ws.onmessage = (event) => {
        console.log('📨 WebSocket message received:', event.data);
      };
      
      ws.onerror = (error) => {
        console.error('❌ WebSocket connection failed:', error);
        clearTimeout(timeout);
      };
      
      ws.onclose = (event) => {
        console.log('🔌 WebSocket closed:', { code: event.code, reason: event.reason });
        clearTimeout(timeout);
      };
      
    } catch (error) {
      console.error('❌ WebSocket test failed:', error);
    }
  };

  const testBinanceIntegration = async () => {
    setLoading(true);
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    
    console.log('🪙 Testing Binance integration endpoints...');
    
    try {
      // Test Binance ping
      const pingResponse = await fetch(`${baseUrl}/test/binance/ping`);
      const pingData = await pingResponse.json();
      console.log('📡 Binance Ping:', pingData);
      
      // Test live prices
      const pricesResponse = await fetch(`${baseUrl}/test/crypto/live-prices`);
      const pricesData = await pricesResponse.json();
      console.log('💰 Live Prices:', pricesData);
      
      // Test collection status
      const statusResponse = await fetch(`${baseUrl}/test/crypto/collection-status`);
      const statusData = await statusResponse.json();
      console.log('📊 Collection Status:', statusData);
      
    } catch (err: any) {
      console.error('❌ Binance integration test failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startDataCollection = async () => {
    setLoading(true);
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    
    try {
      const response = await fetch(`${baseUrl}/test/crypto/start-collection`);
      const data = await response.json();
      console.log('🚀 Start Data Collection:', data);
    } catch (err: any) {
      console.error('❌ Failed to start data collection:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testAuthenticatedEndpoints = async () => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const token = sessionService.getToken();
      
      console.log('🔐 Testing authenticated endpoints...');
      console.log('Authentication Status:', { isAuthenticated, hasToken: !!token, user: user?.name });
      
      if (!token) {
        console.log('❌ No authentication token found');
        setError('Usuário não autenticado. Faça login primeiro.');
        return;
      }

      const authenticatedEndpoints = [
        '/api/user/profile',
        '/api/user/settings',
        '/api/crypto/data',
        '/api/alerts',
        '/api/notifications'
      ];

      // Test authenticated endpoints
      for (const endpoint of authenticatedEndpoints) {
        try {
          const response = await fetch(`${baseUrl}${endpoint}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const data = response.ok ? await response.json() : { error: `HTTP ${response.status}` };
          console.log(`${response.ok ? '✅' : '❌'} ${endpoint}:`, { status: response.status, data });
        } catch (err) {
          console.log(`❌ ${endpoint}:`, err);
        }
      }

    } catch (err: any) {
      console.error('Authenticated endpoints test failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const runAllTests = async () => {
    console.clear();
    console.log('🚀 ===== INICIANDO TESTES COMPLETOS DE CONECTIVIDADE =====');
    console.log('🕐 Timestamp:', new Date().toISOString());
    console.log('');
    
    setLoading(true);
    
    try {
      // Test 1: Basic connection
      console.log('📊 1. Testando conexão básica...');
      await testConnection();
      
      // Test 2: API endpoints
      console.log('🌐 2. Testando endpoints da API...');
      await testApiEndpoints();
      
      // Test 3: Binance integration
      console.log('🪙 3. Testando integração Binance...');
      await testBinanceIntegration();
      
      // Test 4: WebSocket
      console.log('🔌 4. Testando WebSocket...');
      testWebSocket();
      
      console.log('');
      console.log('✅ ===== TESTES CONCLUÍDOS =====');
      console.log('📋 Verifique os resultados acima para cada teste individual.');
      
    } catch (error) {
      console.error('❌ Erro durante os testes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Teste de Conectividade Backend
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Verificar conexão com o backend e APIs
          </p>
        </div>
      </div>

      {/* Configurações */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Configurações</h2>
          <Button onClick={runAllTests} disabled={loading} variant="success">
            {loading ? 'Executando...' : '🚀 Executar Todos os Testes'}
          </Button>
        </div>
        <div className="space-y-2 text-sm">
          <p><strong>API URL:</strong> {process.env.REACT_APP_API_URL || 'http://localhost:8080'}</p>
          <p><strong>WebSocket URL:</strong> {process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws'}</p>
          <p><strong>Skip Auth:</strong> {process.env.REACT_APP_SKIP_AUTH === 'true' ? 'Sim' : 'Não'}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>Autenticado:</strong> {isAuthenticated ? `Sim (${user?.name})` : 'Não'}</p>
        </div>
      </Card>

      {/* Status da Conexão */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Status da Conexão</h2>
          <Button onClick={testConnection} disabled={loading}>
            {loading ? 'Testando...' : 'Testar Novamente'}
          </Button>
        </div>

        <div className="space-y-4">
          {isConnected === null && !error && (
            <div className="text-gray-500">Verificando conexão...</div>
          )}

          {isConnected === true && (
            <div className="text-green-600">
              ✅ Backend conectado com sucesso!
            </div>
          )}

          {isConnected === false && (
            <div className="text-red-600">
              ❌ Falha na conexão com o backend
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 font-medium">Erro:</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {healthData && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800 font-medium">Dados de Saúde do Backend:</p>
              <pre className="text-green-600 text-sm mt-2">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </Card>

      {/* Testes de API */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Teste de Endpoints</h2>
          <Button onClick={testApiEndpoints} disabled={loading}>
            {loading ? 'Testando...' : 'Testar APIs'}
          </Button>
        </div>
        <p className="text-gray-600 text-sm">
          Verifica os principais endpoints da API. Resultados aparecerão no console do navegador.
        </p>
      </Card>

      {/* Teste WebSocket */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Teste WebSocket</h2>
          <Button onClick={testWebSocket}>
            Testar WebSocket
          </Button>
        </div>
        <p className="text-gray-600 text-sm">
          Testa a conexão WebSocket. Resultados aparecerão no console do navegador.
        </p>
      </Card>

      {/* Teste Integração Binance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Integração Binance</h2>
          <Button onClick={testBinanceIntegration} disabled={loading}>
            {loading ? 'Testando...' : 'Testar Binance'}
          </Button>
        </div>
        <p className="text-gray-600 text-sm">
          Testa a integração com a API da Binance e preços em tempo real.
        </p>
      </Card>

      {/* Coleção de Dados */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Coleção de Dados</h2>
          <Button onClick={startDataCollection} disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Coleta'}
          </Button>
        </div>
        <p className="text-gray-600 text-sm">
          Inicia a coleta automática de dados de criptomoedas.
        </p>
      </Card>

      {/* Endpoints Autenticados */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Endpoints Autenticados</h2>
          <Button 
            onClick={testAuthenticatedEndpoints} 
            disabled={loading || !isAuthenticated}
            variant={isAuthenticated ? "primary" : "ghost"}
          >
            {loading ? 'Testando...' : 'Testar Autenticado'}
          </Button>
        </div>
        <p className="text-gray-600 text-sm">
          {isAuthenticated 
            ? 'Testa endpoints que requerem autenticação JWT.' 
            : 'Faça login primeiro para testar endpoints autenticados.'}
        </p>
        {!isAuthenticated && (
          <div className="mt-3 space-x-2">
            <Button 
              onClick={() => window.location.href = '/login'} 
              variant="outline" 
              size="sm"
            >
              Login Real
            </Button>
            <Button 
              onClick={() => window.location.href = '/test-login'} 
              variant="primary" 
              size="sm"
            >
              Login de Teste
            </Button>
          </div>
        )}
      </Card>

      {/* Console */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Console do Navegador</h2>
        <p className="text-gray-600 text-sm">
          Abra o console do navegador (F12) para ver os logs detalhados dos testes.
        </p>
      </Card>
    </div>
  );
};

export default BackendTestPage;
