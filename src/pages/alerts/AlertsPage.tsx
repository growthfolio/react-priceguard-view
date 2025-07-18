import React from 'react';

const AlertsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Alertas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie seus alertas de preços
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-blue-800">
          📋 Página de alertas em desenvolvimento
        </p>
      </div>
    </div>
  );
};

export default AlertsPage;