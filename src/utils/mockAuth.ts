// Mock para simular respostas do backend durante desenvolvimento

interface MockGoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

interface MockTokenResponse {
  user: {
    id: string;
    google_id: string;
    name: string;
    email: string;
    picture: string;
    avatar: string;
    created_at: string;
    updated_at: string;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: 'Bearer';
  };
}

// Simula a decodificação de um JWT token do Google (para desenvolvimento)
export const decodeGoogleJWT = (credential: string): MockGoogleUser => {
  // Em produção, isso seria feito no backend de forma segura
  // Aqui é apenas um mock para desenvolvimento
  return {
    id: 'google-user-123',
    email: 'felipe@example.com',
    name: 'Felipe Macedo',
    picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
    given_name: 'Felipe',
    family_name: 'Macedo'
  };
};

// Simula uma resposta bem-sucedida do backend
export const mockBackendResponse = (googleUser: MockGoogleUser): MockTokenResponse => {
  const now = new Date().toISOString();
  
  return {
    user: {
      id: `user-${Date.now()}`,
      google_id: googleUser.id,
      name: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture,
      avatar: googleUser.picture,
      created_at: now,
      updated_at: now,
    },
    tokens: {
      access_token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
        sub: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
        iat: Math.floor(Date.now() / 1000)
      }))}.mock-signature`,
      refresh_token: `refresh-${Date.now()}`,
      expires_in: 86400, // 24 hours
      token_type: 'Bearer' as const
    }
  };
};

// Simula o endpoint de login do Google
export const mockGoogleLogin = async (credential: string): Promise<MockTokenResponse> => {
  // Simula delay da rede
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Simula chance de erro (5%)
  if (Math.random() < 0.05) {
    throw new Error('Erro de conectividade com o servidor');
  }
  
  const googleUser = decodeGoogleJWT(credential);
  return mockBackendResponse(googleUser);
};
