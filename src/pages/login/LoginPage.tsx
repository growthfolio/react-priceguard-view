import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sparkle, Shield, ChartLine, Bell, Warning } from "@phosphor-icons/react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const LoginPage: React.FC = () => {
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [canRenderGoogleLogin, setCanRenderGoogleLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verifica se deve pular autenticação para ambiente de teste
  const skipAuthString = process.env.REACT_APP_SKIP_AUTH || 'false';
  const skipAuth = skipAuthString === 'true';
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  const hasValidClientId = !!clientId && clientId !== 'your_google_client_id_here' && clientId.trim() !== '';
  
  // Para debug
  console.log('LoginPage Debug:', { 
    skipAuth, 
    hasValidClientId, 
    clientId: clientId.substring(0, 20) + '...',
    isAuthenticated 
  });

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // Verifica se pode renderizar o GoogleLogin com segurança
  useEffect(() => {
    // Só renderiza o GoogleLogin se não estiver em modo skipAuth e tiver clientId válido
    if (!skipAuth && hasValidClientId) {
      setCanRenderGoogleLogin(true);
    } else {
      setCanRenderGoogleLogin(false);
    }
  }, [skipAuth, hasValidClientId]);

  const handleSuccess = async (credentialResponse: any) => {
    console.log("🎉 Google Login bem-sucedido:", credentialResponse);
    setIsLoading(true);

    try {
      await loginWithGoogle(credentialResponse.credential);
      // O redirecionamento será feito pelo AuthContext
    } catch (error) {
      console.error("❌ Erro ao autenticar:", error);
      setIsLoading(false);
    }
  };

  const handleError = () => {
    console.error("❌ Falha no login com o Google");
    setIsLoading(false);
  };

  const handleTestLogin = async () => {
    setIsLoading(true);
    try {
      navigate('/test-login');
    } catch (error) {
      console.error("Erro ao navegar para login de teste:", error);
      setIsLoading(false);
    }
  };

  const handleBackendTest = () => {
    navigate('/test');
  };

  const features = [
    {
      icon: Bell,
      title: "Alertas Inteligentes",
      description: "Notificações em tempo real",
    },
    {
      icon: ChartLine,
      title: "Dashboard Avançado",
      description: "Análises detalhadas",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Autenticação segura",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex">
      {/* Background com efeitos visuais */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-info/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Side Panel com Features */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Sparkle size={24} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">PriceGuard</h1>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Monitore o Futuro do
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                {" "}
                Mercado Digital
              </span>
            </h2>
            <p className="text-neutral-300 text-lg">
              Plataforma inteligente para acompanhar criptomoedas em tempo real
              e tomar decisões informadas.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <feature.icon size={20} className="text-primary-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{feature.title}</h3>
                  <p className="text-neutral-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
            <div className="p-8">
              {/* Logo para telas menores */}
              <div className="lg:hidden text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                    <Sparkle size={20} className="text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-neutral-900">
                    PriceGuard
                  </h1>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                  Bem-vindo de volta!
                </h2>
                <p className="text-neutral-600">
                  Faça login para acessar sua conta
                </p>
              </div>

              <div className="space-y-6">
                {skipAuth ? (
                  <button
                    onClick={handleTestLogin}
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 group"
                  >
                    <span className="mr-2">🧪</span>
                    Entrar como Usuário de Teste
                    <Sparkle
                      size={16}
                      className="ml-2 group-hover:animate-pulse"
                    />
                  </button>
                ) : canRenderGoogleLogin ? (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-neutral-500">
                          Entre com sua conta Google
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        useOneTap={false}
                        theme="outline"
                        size="large"
                        width="100%"
                      />
                    </div>

                    {/* Opções de desenvolvimento */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-center text-sm text-gray-500 mb-3">
                        Opções de Desenvolvimento
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={handleTestLogin}
                          variant="outline"
                          size="sm"
                          fullWidth
                          disabled={isLoading}
                        >
                          Teste Simples
                        </Button>
                        <Button
                          onClick={() => navigate('/real-login-demo')}
                          variant="primary"
                          size="sm"
                          fullWidth
                          disabled={isLoading}
                        >
                          Login Real
                        </Button>
                        <Button
                          onClick={handleBackendTest}
                          variant="ghost"
                          size="sm"
                          fullWidth
                          disabled={isLoading}
                        >
                          Testar API
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Card className="p-4 bg-yellow-50 border-yellow-200">
                      <div className="flex items-start space-x-3">
                        <Warning className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium text-yellow-800">
                            Google OAuth não configurado
                          </h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            Para usar o login com Google, configure a variável{' '}
                            <code className="bg-yellow-200 px-1 rounded">
                              REACT_APP_GOOGLE_CLIENT_ID
                            </code>{' '}
                            no arquivo .env
                          </p>
                        </div>
                      </div>
                    </Card>

                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-4">
                        Use as opções de desenvolvimento para continuar:
                      </p>
                      <div className="space-y-2">
                        <Button
                          onClick={handleTestLogin}
                          variant="primary"
                          fullWidth
                          disabled={isLoading}
                        >
                          {isLoading ? 'Carregando...' : 'Entrar como Teste'}
                        </Button>
                        <Button
                          onClick={handleBackendTest}
                          variant="outline"
                          fullWidth
                          disabled={isLoading}
                        >
                          Testar Conectividade Backend
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 text-center space-y-2">
                <p className="text-sm text-neutral-600">
                  Ainda não tem uma conta?{" "}
                  <a
                    href="/register"
                    className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Crie uma agora
                  </a>
                </p>
                <p className="text-sm text-neutral-600">
                  Esqueceu a senha?{" "}
                  <a
                    href="/reset-password"
                    className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Redefinir
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 text-center">
            <p className="text-neutral-400 text-sm mb-4">
              Confiado por mais de 50.000 usuários
            </p>
            <div className="flex justify-center space-x-4 opacity-60">
              <Shield size={24} className="text-neutral-400" />
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-primary-400 rounded-full"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
