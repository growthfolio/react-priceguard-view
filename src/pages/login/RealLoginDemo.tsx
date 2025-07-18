import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RealLoginDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const simulateGoogleCredential = async () => {
    setLoading(true);
    
    try {
      // Simula um token JWT real do Google (isso normalmente viria do Google OAuth)
      const mockGoogleJWT = createMockGoogleJWT();
      
      console.log('🔄 Simulando login com credential do Google...');
      await loginWithGoogle(mockGoogleJWT);
      
      // Redirecionamento será feito pelo AuthContext
    } catch (error) {
      console.error('❌ Erro no login simulado:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMockGoogleJWT = (): string => {
    // Simula a estrutura de um JWT do Google
    const header = {
      alg: "RS256",
      kid: "mock-key-id",
      typ: "JWT"
    };

    const payload = {
      iss: "https://accounts.google.com",
      azp: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      aud: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      sub: "123456789012345678901", // Google user ID
      email: "felipe@example.com",
      email_verified: true,
      name: "Felipe Macedo",
      picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      given_name: "Felipe",
      family_name: "Macedo",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    };

    // Em um caso real, isso seria assinado pelo Google
    const mockJWT = `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}.mock-signature`;
    
    return mockJWT;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-6">Login Real Simulado</h1>
          <p className="text-gray-600 mb-6">
            Simula um login real com Google OAuth usando um token JWT mock que segue o formato do Google.
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={simulateGoogleCredential}
              disabled={loading}
              fullWidth
              variant="primary"
            >
              {loading ? 'Fazendo login...' : '🚀 Simular Login com Google'}
            </Button>

            <div className="text-sm text-gray-500 space-y-2">
              <p>Este login simulado irá:</p>
              <ul className="text-left list-disc list-inside space-y-1">
                <li>Tentar o backend real primeiro</li>
                <li>Usar mock se o backend falhar</li>
                <li>Criar uma sessão válida</li>
                <li>Redirecionar para o app</li>
              </ul>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                fullWidth
              >
                Voltar para Login
              </Button>
              <Button
                onClick={() => navigate('/test')}
                variant="ghost"
                fullWidth
              >
                Testar Backend
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RealLoginDemo;
