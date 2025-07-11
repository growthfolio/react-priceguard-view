import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  List, 
  Bell, 
  User, 
  House, 
  ChartLine, 
  Gear, 
  SignOut,
  X,
  TrendUp
} from "@phosphor-icons/react";
import { useAuth } from "../../contexts/AuthContext";
import LogoPriceGuard from "../../utils/LogoPriceGuard";

function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);

  const { logout, user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/home', icon: House },
    { name: 'Mercado', href: '/market', icon: ChartLine },
    { name: 'Dashboard', href: '/dashboard', icon: TrendUp },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  const notifications = [
    { id: 1, title: "Bitcoin subiu 5% na última hora", time: "2 min atrás", type: "success" },
    { id: 2, title: "Ethereum atingiu novo suporte", time: "10 min atrás", type: "info" },
    { id: 3, title: "Alerta configurado com sucesso", time: "1h atrás", type: "warning" },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '🟢';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      default: return '📊';
    }
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
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
                  className="relative p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all duration-200 group"
                >
                  <Bell size={20} className="group-hover:scale-110 transition-transform" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notificationPanelOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-strong border border-gray-200 z-50 animate-slide-down">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notificações</h3>
                        <button
                          onClick={() => setNotificationPanelOpen(false)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto scrollbar">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start space-x-3">
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-100">
                      <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Ver todas as notificações
                      </button>
                    </div>
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
                    {user?.name || "Usuário"}
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
                          <p className="font-medium text-gray-900">{user?.name || "Usuário"}</p>
                          <p className="text-sm text-gray-500">{user?.email || "email@exemplo.com"}</p>
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
