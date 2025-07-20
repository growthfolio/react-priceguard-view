import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  List, 
  Bell, 
  User, 
  House, 
  ChartLine, 
  Gear, 
  SignOut,
  X,
  TrendUp,
  Warning,
  CheckCircle
} from "@phosphor-icons/react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { useWebSocket } from "../../contexts/WebSocketContext";
import { NotificationBadge } from "../notifications";
import { ThemeToggle } from "../ui";
import LogoPriceGuard from "../../utils/LogoPriceGuard";

function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);

  const { logout, user } = useAuth();
  const { unreadCount } = useNotifications();
  const webSocket = useWebSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/home', icon: House },
    { name: 'Mercado', href: '/market', icon: ChartLine },
    { name: 'Dashboard', href: '/dashboard', icon: TrendUp },
    { name: 'Alertas', href: '/alerts', icon: Bell },
    { name: 'Notificações', href: '/notifications', icon: Bell },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  // Get recent notifications from WebSocket
  const recentNotifications = webSocket.notifications.slice(-5).reverse();

  const getNotificationIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Warning size={16} className="text-red-500" />;
      case 'medium': return <Bell size={16} className="text-yellow-500" />;
      case 'low': return <CheckCircle size={16} className="text-green-500" />;
      default: return <Bell size={16} className="text-blue-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Agora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m atrás`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Navbar Principal */}
      <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-neutral-200/50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                to="/home" 
                className="flex items-center space-x-3 group"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl group-hover:scale-110 transition-transform shadow-soft">
                  <LogoPriceGuard />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent hidden sm:block">
                  PriceGuard
                </span>
              </Link>
            </div>

            {/* Navigation - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActiveRoute(item.href)
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-medium'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon size={18} className={isActiveRoute(item.href) ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              
              {/* Theme Toggle */}
              <ThemeToggle variant="compact" />
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
                  className="relative p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all duration-200 group"
                >
                  <NotificationBadge 
                    count={unreadCount} 
                    variant="danger" 
                    size="sm"
                    pulse={unreadCount > 0}
                  >
                    <Bell size={20} className="group-hover:scale-110 transition-transform" />
                  </NotificationBadge>
                </button>

                {/* Notification Dropdown */}
                {notificationPanelOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-strong border border-gray-200 z-50 animate-slide-down">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Notificações {unreadCount > 0 && `(${unreadCount})`}
                        </h3>
                        <button
                          onClick={() => setNotificationPanelOpen(false)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto scrollbar">
                      {recentNotifications.length > 0 ? (
                        recentNotifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                              !notification.is_read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => navigate('/notifications')}
                          >
                            <div className="flex items-start space-x-3">
                              {getNotificationIcon(notification.priority)}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notification.is_read ? 'font-semibold' : 'font-medium'} text-gray-900 truncate`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatTime(notification.created_at)}
                                </p>
                              </div>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <Bell size={32} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Nenhuma notificação</p>
                        </div>
                      )}
                    </div>
                    {recentNotifications.length > 0 && (
                      <div className="p-3 border-t border-gray-100">
                        <button
                          onClick={() => {
                            navigate('/notifications');
                            setNotificationPanelOpen(false);
                          }}
                          className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Ver todas as notificações
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfilePanelOpen(!profilePanelOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <img
                    src={user?.picture || "https://via.placeholder.com/32"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full ring-2 ring-primary-200"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user?.name || ""}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {profilePanelOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-strong border border-gray-200 z-50 animate-slide-down">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user?.picture || "https://via.placeholder.com/40"}
                          alt="Profile"
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{user?.name || ""}</p>
                          <p className="text-sm text-gray-500">{user?.email || ""}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setProfilePanelOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User size={16} />
                        <span>Meu Perfil</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setProfilePanelOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Gear size={16} />
                        <span>Configurações</span>
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={() => {
                          setProfilePanelOpen(false);
                          logout();
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <SignOut size={16} />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-strong z-50 md:hidden animate-slide-down">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="py-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${
                      isActiveRoute(item.href)
                        ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Overlay para fechar dropdowns */}
      {(notificationPanelOpen || profilePanelOpen) && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => {
            setNotificationPanelOpen(false);
            setProfilePanelOpen(false);
          }}
        />
      )}
    </>
  );
}

export default NavBar;
