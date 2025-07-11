import React, { useState } from "react";
import { 
  User, 
  Gear, 
  Activity, 
  Camera, 
  Shield,
  Bell,
  Palette,
  Download,
  CheckCircle,
  Warning,
  ChartLine
} from "@phosphor-icons/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, Button } from "../../components/ui";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [riskLimitPercent, setRiskLimitPercent] = useState(2);
  const [positionLimit, setPositionLimit] = useState(5);
  const { user } = useAuth();

  const mockWallet = 125000;

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "settings", label: "Configurações", icon: Gear },
    { id: "activity", label: "Atividades", icon: Activity },
  ];

  const stats = [
    { label: "Alertas Ativos", value: "12", icon: Bell, color: "text-primary-600" },
    { label: "Trades Realizados", value: "347", icon: ChartLine, color: "text-secondary-600" },
    { label: "Taxa de Sucesso", value: "68%", icon: CheckCircle, color: "text-success" },
    { label: "Risk Score", value: "Baixo", icon: Shield, color: "text-warning" }
  ];

  const ProfileSection = () => (
    <div className="space-y-8">
      {/* Header do Perfil */}
      <Card className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0">
        <Card.Body className="p-8">
          <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="relative">
              <img
                src={user?.picture || "https://via.placeholder.com/120"}
                alt="Profile"
                className="w-32 h-32 rounded-full ring-4 ring-white/30 shadow-strong"
              />
              <button className="absolute bottom-2 right-2 p-3 bg-white/90 text-primary-600 rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-medium">
                <Camera size={18} />
              </button>
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {user?.name || "Usuário Teste"}
              </h1>
              <p className="text-primary-100 text-lg mb-4">
                {user?.email || "teste@exemplo.com"}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-sm font-medium">Membro desde 2024</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-sm font-medium">Trader Ativo</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-primary-100 text-sm mb-1">Carteira Total</p>
              <p className="text-3xl font-bold">
                ${mockWallet.toLocaleString()}
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} hover>
            <Card.Body className="text-center">
              <div className={`w-12 h-12 ${stat.color} bg-current/10 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <p className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</p>
              <p className="text-neutral-600 text-sm">{stat.label}</p>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Informações Pessoais */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Informações Pessoais</h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                className="input"
                value={user?.name || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="input"
                value={user?.email || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                className="input"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                País
              </label>
              <select className="input">
                <option value="BR">Brasil</option>
                <option value="US">Estados Unidos</option>
                <option value="EU">Europa</option>
              </select>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  const SettingsSection = () => (
    <div className="space-y-8">
      {/* Configurações de Risco */}
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Shield size={20} className="text-warning" />
            <h3 className="text-lg font-semibold">Configurações de Risco</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Limite de Risco por Trade: {riskLimitPercent}%
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={riskLimitPercent}
                onChange={(e) => setRiskLimitPercent(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>1%</span>
                <span>10%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Máximo de Posições Simultâneas: {positionLimit}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={positionLimit}
                onChange={(e) => setPositionLimit(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>1</span>
                <span>20</span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Notificações */}
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Bell size={20} className="text-primary-600" />
            <h3 className="text-lg font-semibold">Configurações de Notificação</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {[
              { label: "Alertas de Preço", description: "Receber notificações quando os preços atingirem seus alvos" },
              { label: "Relatórios Diários", description: "Resumo diário das suas posições e performance" },
              { label: "Notificações de Sistema", description: "Atualizações importantes da plataforma" },
              { label: "Marketing", description: "Novidades, promoções e conteúdo educacional" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900">{item.label}</p>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={index < 2} />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  const ActivitySection = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Atividade Recente</h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {[
              { action: "Login realizado", time: "2 minutos atrás", icon: User, color: "text-primary-600" },
              { action: "Alerta configurado para BTC", time: "1 hora atrás", icon: Bell, color: "text-secondary-600" },
              { action: "Trade executado: ETH/USDT", time: "3 horas atrás", icon: ChartLine, color: "text-success" },
              { action: "Perfil atualizado", time: "1 dia atrás", icon: Gear, color: "text-neutral-600" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                <div className={`w-10 h-10 ${activity.color} bg-current/10 rounded-lg flex items-center justify-center`}>
                  <activity.icon size={18} className={activity.color} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{activity.action}</p>
                  <p className="text-sm text-neutral-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Meu <span className="gradient-text">Perfil</span>
          </h1>
          <p className="text-neutral-600 text-lg">
            Gerencie suas informações pessoais e configurações da conta
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-neutral-200 p-1 rounded-xl mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "settings" && <SettingsSection />}
          {activeTab === "activity" && <ActivitySection />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
