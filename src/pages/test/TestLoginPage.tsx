import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { sessionService } from '../../services/sessionService';
import { useNavigate } from 'react-router-dom';
import { User } from '../../models/User';

const TestLoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createTestSession = () => {
    setLoading(true);

    // Create a mock user
    const testUser: User = {
      id: 'test-user-123',
      google_id: 'test-google-123',
      name: 'Felipe Macedo (Test)',
      email: 'test@example.com',
      picture: '/img/perfil-wpp.jpeg',
      avatar: '/img/perfil-wpp.jpeg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Create a mock JWT token (for testing purposes)
    const mockToken = btoa(JSON.stringify({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: {
        sub: testUser.id,
        email: testUser.email,
        name: testUser.name,
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour from now
        iat: Math.floor(Date.now() / 1000)
      }
    }));

    const tokens = {
      access_token: `mock.${mockToken}.signature`,
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      token_type: 'Bearer' as const
    };

    // Save the session
    sessionService.saveSession(testUser, tokens);

    setTimeout(() => {
      setLoading(false);
      navigate('/test');
      window.location.reload(); // Force reload to update auth context
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-6">Test Login</h1>
          <p className="text-gray-600 mb-6">
            Criar uma sessão de teste para testar a autenticação.
          </p>
          
          <Button
            onClick={createTestSession}
            disabled={loading}
            fullWidth
            variant="primary"
          >
            {loading ? 'Criando sessão...' : 'Criar Sessão de Teste'}
          </Button>

          <div className="mt-4">
            <Button
              onClick={() => navigate('/login')}
              variant="ghost"
              fullWidth
            >
              Voltar para Login Real
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestLoginPage;
