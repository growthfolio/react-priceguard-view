import React from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  Shield, 
  ChartLine, 
  CurrencyBtc, 
  Lightning,
  ArrowRight,
  Star,
  Users,
  Globe
} from "@phosphor-icons/react";
import { useAuth } from "../../contexts/AuthContext";

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Bell,
      title: "Alertas Inteligentes",
      description: "Receba notificações em tempo real sobre variações de preços personalizadas para seu perfil.",
      color: "bg-blue-500"
    },
    {
      icon: ChartLine,
      title: "Dashboard Avançado",
      description: "Visualize dados complexos de forma simples com gráficos interativos e análises detalhadas.",
      color: "bg-primary-500"
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Seus dados protegidos com criptografia de ponta e autenticação segura via Google.",
      color: "bg-secondary-500"
    },
    {
      icon: Lightning,
      title: "Performance Rápida",
      description: "Interface otimizada para carregamento instantâneo e experiência fluida.",
      color: "bg-yellow-500"
    }
  ];

  const stats = [
    { label: "Usuários Ativos", value: "50K+", icon: Users },
    { label: "Criptomoedas", value: "500+", icon: CurrencyBtc },
    { label: "Países", value: "120+", icon: Globe },
    { label: "Alertas Enviados", value: "1M+", icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        {/* Background decorativo */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Welcome message personalizada */}
            {user && (
              <div className="mb-6 animate-slide-down">
                <div className="inline-flex items-center space-x-2 bg-primary-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-500/30">
                  <span className="text-2xl">👋</span>
                  <p className="text-primary-300 font-medium">
                    Bem-vindo de volta, {user.name}!
                  </p>
                </div>
              </div>
            )}
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up leading-tight">
              Monitore o
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"> Cripto</span>
              <br />
              Mercado em
              <span className="bg-gradient-to-r from-secondary-400 to-info bg-clip-text text-transparent"> Tempo Real</span>
            </h1>
            
            <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto animate-fade-in">
              Plataforma inteligente para acompanhar criptomoedas, configurar alertas personalizados 
              e tomar decisões informadas no mercado digital.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Link
                to="/market"
                className="btn btn-primary btn-lg group shadow-soft hover:shadow-medium"
              >
                <ChartLine size={20} />
                <span>Explorar Mercado</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/dashboard"
                className="btn btn-outline-primary btn-lg text-white border-white hover:bg-white hover:text-neutral-900"
              >
                Ver Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4 group-hover:bg-primary-200 transition-colors">
                    <Icon size={24} className="text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recursos Poderosos para
              <span className="text-primary-600"> Traders Inteligentes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ferramentas profissionais desenvolvidas para maximizar seus resultados no mercado de criptomoedas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-hover group">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 mb-6">
            <Star size={16} className="text-yellow-300" />
            <span className="text-sm font-medium">Plataforma #1 em Alertas Crypto</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Revolutionar
            <br />
            Seus Investimentos?
          </h2>
          
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de traders que já transformaram sua estratégia 
            com nossas ferramentas avançadas de monitoramento.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/market"
              className="btn-lg bg-white text-gray-900 hover:bg-gray-100 font-semibold inline-flex items-center justify-center space-x-2 group"
            >
              <span>Começar Agora</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/profile"
              className="btn-lg border-2 border-white/50 text-white hover:bg-white/10 font-semibold"
            >
              Ver Perfil
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Acesso Rápido
              </h3>
              <p className="text-gray-600">
                Navegue diretamente para as principais funcionalidades
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
              <Link
                to="/market"
                className="btn-primary btn-sm"
              >
                Mercado
              </Link>
              <Link
                to="/dashboard"
                className="btn-secondary btn-sm"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="btn-outline btn-sm"
              >
                Perfil
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
