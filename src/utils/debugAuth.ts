// Utilitário para debug da autenticação

export const debugAuth = () => {
  console.group('🔍 Debug da Autenticação');
  
  console.log('📊 Variáveis de Ambiente:', {
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_SKIP_AUTH: process.env.REACT_APP_SKIP_AUTH,
    REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID?.slice(0, 10) + '...',
  });

  console.log('💾 LocalStorage (PriceGuard):', {
    user_data: localStorage.getItem('priceGuard_user_data'),
    auth_token: localStorage.getItem('priceGuard_auth_token'),
    refresh_token: localStorage.getItem('priceGuard_refresh_token'),
    token_expires_in: localStorage.getItem('priceGuard_token_expires_in'),
    token_type: localStorage.getItem('priceGuard_token_type'),
    user_preferences: localStorage.getItem('priceGuard_user_preferences'),
  });

  // Também verifica as chaves antigas
  console.log('💾 LocalStorage (Chaves Antigas):', {
    user: localStorage.getItem('user'),
    access_token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token'),
    token_expires_in: localStorage.getItem('token_expires_in'),
    token_type: localStorage.getItem('token_type'),
    user_settings: localStorage.getItem('user_settings'),
  });

  console.log('🧹 Todas as chaves do localStorage:', Object.keys(localStorage));
  
  console.groupEnd();
};

export const clearAllData = () => {
  console.log('🧹 Limpando todos os dados...');
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ Todos os dados limpos');
};
