import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { Button, Card } from "../../components/ui";
import { Loading } from "../../components/ui";
import { notificationService } from "../../services/notificationService";
import { Notification, NotificationsParams } from "../../models/Notification";
import { useWebSocket } from "../../contexts/WebSocketContext";
import { Bell, Check, CheckCheck, Trash2, Filter, AlertCircle, Info, Shield, TrendingUp } from "lucide-react";

export const NotificationsPage: React.FC = () => {
  const { notifications: realtimeNotifications, subscribeToNotifications } = useWebSocket();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<NotificationsParams>({
    page: 1,
    limit: 20,
  });
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
  });

  // Carrega notificações
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(filters);
      
      setNotifications(response.data.notifications);
      setStats({
        total: response.data.total,
        unread: response.data.unread_count,
      });
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    subscribeToNotifications(); // Subscreve para notificações em tempo real
  }, [filters, subscribeToNotifications]);

  // Atualiza lista quando há novas notificações em tempo real
  useEffect(() => {
    if (realtimeNotifications.length > 0) {
      // Adiciona novas notificações no topo da lista
      const newNotifications = realtimeNotifications.filter(
        newNotif => !notifications.some(existing => existing.id === newNotif.id)
      );
      
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
        setStats(prev => ({
          total: prev.total + newNotifications.length,
          unread: prev.unread + newNotifications.filter(n => !n.is_read).length,
        }));
      }
    }
  }, [realtimeNotifications, notifications]);

  // Marcar como lida
  const markAsRead = async (notificationIds: string[]) => {
    try {
      await notificationService.markAsRead(notificationIds);
      setNotifications(prev => 
        prev.map(notif => 
          notificationIds.includes(notif.id) 
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      );
      setStats(prev => ({ ...prev, unread: prev.unread - notificationIds.length }));
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ 
          ...notif, 
          is_read: true, 
          read_at: new Date().toISOString() 
        }))
      );
      setStats(prev => ({ ...prev, unread: 0 }));
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    }
  };

  // Excluir notificações
  const deleteNotifications = async (notificationIds: string[]) => {
    if (!window.confirm(`Tem certeza que deseja excluir ${notificationIds.length} notificações?`)) {
      return;
    }

    try {
      await notificationService.deleteNotifications(notificationIds);
      setNotifications(prev => prev.filter(notif => !notificationIds.includes(notif.id)));
      setSelectedNotifications(new Set());
      
      const deletedUnread = notifications.filter(
        notif => notificationIds.includes(notif.id) && !notif.is_read
      ).length;
      
      setStats(prev => ({
        total: prev.total - notificationIds.length,
        unread: prev.unread - deletedUnread,
      }));
    } catch (error) {
      console.error("Erro ao excluir notificações:", error);
    }
  };

  // Toggle seleção de notificação
  const toggleSelection = (notificationId: string) => {
    const newSelection = new Set(selectedNotifications);
    if (newSelection.has(notificationId)) {
      newSelection.delete(notificationId);
    } else {
      newSelection.add(notificationId);
    }
    setSelectedNotifications(newSelection);
  };

  // Selecionar todas
  const toggleSelectAll = () => {
    if (selectedNotifications.size === notifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(notifications.map(notif => notif.id)));
    }
  };

  // Ícone baseado no tipo de notificação
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert_triggered":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "system":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "security":
        return <Shield className="h-5 w-5 text-red-500" />;
      case "price_update":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Classe de prioridade
  const getPriorityClass = (priority: Notification["priority"]) => {
    switch (priority) {
      case "urgent":
        return "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20";
      case "high":
        return "border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20";
      case "medium":
        return "border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "border-l-4 border-gray-300 bg-white dark:bg-gray-800";
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
              Notificações
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {stats.unread} não lidas de {stats.total} total
            </p>
          </div>
          
          <div className="flex space-x-2">
            {stats.unread > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Marcar Todas como Lidas
              </Button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
            >
              <option value="">Todos os tipos</option>
              <option value="alert_triggered">Alertas acionados</option>
              <option value="system">Sistema</option>
              <option value="security">Segurança</option>
              <option value="price_update">Atualizações de preço</option>
              <option value="info">Informações</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.is_read?.toString() || ""}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                is_read: e.target.value === "" ? undefined : e.target.value === "true"
              }))}
            >
              <option value="">Todas</option>
              <option value="false">Não lidas</option>
              <option value="true">Lidas</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.priority || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as any }))}
            >
              <option value="">Todas as prioridades</option>
              <option value="urgent">Urgente</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>
        </Card>

        {/* Ações em Lote */}
        {selectedNotifications.size > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedNotifications.size} notificações selecionadas
              </span>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => markAsRead(Array.from(selectedNotifications))}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Marcar como Lidas
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteNotifications(Array.from(selectedNotifications))}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Notificações */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`${getPriorityClass(notification.priority)} ${
                  !notification.is_read ? 'shadow-md' : 'opacity-75'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.has(notification.id)}
                      onChange={() => toggleSelection(notification.id)}
                      className="mt-1 rounded border-gray-300"
                    />
                    
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-sm font-medium ${
                            !notification.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {notification.title}
                          </h3>
                          
                          <p className={`mt-1 text-sm ${
                            !notification.is_read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <span>
                              {new Date(notification.created_at).toLocaleString()}
                            </span>
                            
                            {notification.symbol && (
                              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {notification.symbol}
                              </span>
                            )}
                            
                            <span className={`px-2 py-1 rounded ${
                              notification.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              notification.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {notification.priority}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          
                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead([notification.id])}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Marcar como lida"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotifications([notification.id])}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma notificação encontrada
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Suas notificações aparecerão aqui quando houver atividade
              </p>
            </Card>
          )}
        </div>

        {/* Paginação */}
        {notifications.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando {notifications.length} de {stats.total} notificações
              </span>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={filters.page === 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page! - 1 }))}
                >
                  Anterior
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={notifications.length < (filters.limit || 20)}
                  onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage;
