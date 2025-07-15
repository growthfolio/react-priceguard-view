import React, { useState, useEffect, useMemo, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import { Button, Card } from "../../components/ui";
import { Loading } from "../../components/ui";
import { alertService } from "../../services/alertService";
import { Alert, AlertsParams } from "../../models/Alert";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Eye, EyeOff, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useApiCache, useDebounce } from "../../hooks/usePerformance";

export const AlertsPage: React.FC = () => {
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<AlertsParams>({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Memoize filters with search term
  const finalFilters = useMemo(() => ({
    ...filters,
    symbol: debouncedSearchTerm || undefined,
  }), [filters, debouncedSearchTerm]);

  // Use cached API calls for better performance
  const { data: alertsResponse, loading: alertsLoading, refresh: refreshAlerts } = useApiCache(
    `alerts-${JSON.stringify(finalFilters)}`,
    () => alertService.getAlerts(finalFilters),
    { ttl: 30000 } // Cache for 30 seconds
  );

  const { data: statsResponse, loading: statsLoading } = useApiCache(
    'alerts-stats',
    () => alertService.getAlertStats(),
    { ttl: 60000, refreshInterval: 30000 } // Cache for 1 minute, refresh every 30 seconds
  );

  const alerts = alertsResponse?.data?.alerts || [];
  const stats = {
    total: statsResponse?.data?.total_alerts || 0,
    active: statsResponse?.data?.active_alerts || 0,
    triggered_today: statsResponse?.data?.triggered_today || 0,
  };
  const loading = alertsLoading || statsLoading;

  // Toggle alerta ativo/inativo
  const toggleAlert = async (id: string, isActive: boolean) => {
    try {
      await alertService.updateAlert(id, { is_active: isActive });
      refreshAlerts(); // Refresh the cache
    } catch (error) {
      console.error("Erro ao atualizar alerta:", error);
    }
  };

  // Excluir alerta
  const deleteAlert = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este alerta?")) {
      return;
    }

    try {
      await alertService.deleteAlert(id);
      refreshAlerts(); // Refresh the cache
    } catch (error) {
      console.error("Erro ao excluir alerta:", error);
    }
  };

  // Operações em lote
  const handleBulkToggle = async (isActive: boolean) => {
    if (selectedAlerts.size === 0) return;

    try {
      if (isActive) {
        await alertService.enableAlerts(Array.from(selectedAlerts));
      } else {
        await alertService.disableAlerts(Array.from(selectedAlerts));
      }
      setSelectedAlerts(new Set());
      refreshAlerts();
    } catch (error) {
      console.error("Erro na operação em lote:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAlerts.size === 0) return;
    
    if (!window.confirm(`Tem certeza que deseja excluir ${selectedAlerts.size} alertas?`)) {
      return;
    }

    try {
      await alertService.deleteAlerts(Array.from(selectedAlerts));
      setSelectedAlerts(new Set());
      refreshAlerts();
    } catch (error) {
      console.error("Erro na exclusão em lote:", error);
    }
  };

  // Toggle seleção de alerta
  const toggleSelection = (alertId: string) => {
    const newSelection = new Set(selectedAlerts);
    if (newSelection.has(alertId)) {
      newSelection.delete(alertId);
    } else {
      newSelection.add(alertId);
    }
    setSelectedAlerts(newSelection);
  };

  // Selecionar todos
  const toggleSelectAll = () => {
    if (selectedAlerts.size === alerts.length) {
      setSelectedAlerts(new Set());
    } else {
      setSelectedAlerts(new Set(alerts.map(alert => alert.id)));
    }
  };

  const formatCondition = (alert: Alert) => {
    const operator = alert.condition_operator;
    const value = alert.condition_value;
    
    switch (alert.alert_type) {
      case "price_above":
        return `Preço > $${value}`;
      case "price_below":
        return `Preço < $${value}`;
      case "price_change":
        return `Mudança ${operator} ${value}%`;
      case "volume_spike":
        return `Volume > ${value}`;
      case "technical_indicator":
        return `${alert.indicator_type} ${operator} ${value}`;
      default:
        return `${operator} ${value}`;
    }
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
              Alertas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie seus alertas de preço e indicadores
            </p>
          </div>
          
          <Link to="/alerts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Alerta
            </Button>
          </Link>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Alertas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
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
                  {stats.active}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Acionados Hoje
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.triggered_today}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por símbolo..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.alert_type || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, alert_type: e.target.value as any }))}
            >
              <option value="">Todos os tipos</option>
              <option value="price_above">Preço acima</option>
              <option value="price_below">Preço abaixo</option>
              <option value="price_change">Mudança de preço</option>
              <option value="volume_spike">Pico de volume</option>
              <option value="technical_indicator">Indicador técnico</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.is_active?.toString() || ""}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                is_active: e.target.value === "" ? undefined : e.target.value === "true"
              }))}
            >
              <option value="">Todos os status</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>
          </div>
        </Card>

        {/* Ações em Lote */}
        {selectedAlerts.size > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedAlerts.size} alertas selecionados
              </span>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkToggle(true)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ativar
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkToggle(false)}
                >
                  <EyeOff className="h-4 w-4 mr-1" />
                  Desativar
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Alertas */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedAlerts.size === alerts.length && alerts.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
                    Símbolo
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
                    Tipo
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
                    Condição
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
                    Criado
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">
                    Ações
                  </th>
                </tr>
              </thead>
              
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedAlerts.has(alert.id)}
                        onChange={() => toggleSelection(alert.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    
                    <td className="p-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {alert.symbol}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {alert.alert_type.replace("_", " ")}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCondition(alert)}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {alert.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(alert.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleAlert(alert.id, !alert.is_active)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title={alert.is_active ? "Desativar" : "Ativar"}
                        >
                          {alert.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        
                        <Link
                          to={`/alerts/${alert.id}/edit`}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {alerts.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum alerta encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Comece criando seu primeiro alerta de preço
                </p>
                <Link to="/alerts/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Alerta
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AlertsPage;
