import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { debugAuth, clearAllData } from '../../utils/debugAuth';

const AuthDebugPage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleDebugAuth = () => {
    addLog('Executando debug da autenticação...');
    debugAuth();
    addLog('Debug concluído - verifique o console');
  };

  const handleClearAll = () => {
    addLog('Limpando todos os dados...');
    clearAllData();
    addLog('Dados limpos - recarregue a página');
  };

  const handleLogout = () => {
    addLog('Executando logout...');
    logout();
    addLog('Logout executado');
  };

  const handleCheckStorage = () => {
    const storage = {
      localStorage: Object.keys(localStorage).reduce((acc, key) => {
        acc[key] = localStorage.getItem(key);
        return acc;
      }, {} as Record<string, string | null>),
      sessionStorage: Object.keys(sessionStorage).reduce((acc, key) => {
        acc[key] = sessionStorage.getItem(key);
        return acc;
      }, {} as Record<string, string | null>)
    };
    
    addLog(`Storage atual: ${JSON.stringify(storage, null, 2)}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug da Autenticação</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Estado Atual</h2>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div><strong>Autenticado:</strong> {isAuthenticated ? '✅ Sim' : '❌ Não'}</div>
            <div><strong>Usuário:</strong> {user ? user.name : 'Nenhum'}</div>
            <div><strong>Email:</strong> {user ? user.email : 'N/A'}</div>
            <div><strong>Skip Auth:</strong> {process.env.REACT_APP_SKIP_AUTH}</div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleDebugAuth}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Debug Autenticação
            </button>
            
            <button
              onClick={handleCheckStorage}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Verificar Storage
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Executar Logout
            </button>
            
            <button
              onClick={handleClearAll}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Limpar Todos os Dados
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Logs</h2>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Nenhum log ainda...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
          
          <button
            onClick={() => setLogs([])}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Limpar Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugPage;
