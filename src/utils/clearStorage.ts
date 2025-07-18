// Utilitário para limpar todos os dados da aplicação

export const clearAllAppData = () => {
  // Lista de chaves conhecidas da aplicação
  const appKeys = [
    // Autenticação
    'priceGuard_auth_token',
    'priceGuard_refresh_token', 
    'priceGuard_user_data',
    'priceGuard_user_preferences',
    'priceGuard_token_expires_in',
    'priceGuard_token_type',
    
    // Configurações
    'priceGuard_app_theme',
    'priceGuard_language',
    'priceGuard_notification_settings',
    'priceGuard_audioConfig',
    'priceGuard_dashboard_config',
    
    // Cache
    'priceGuard_crypto_cache',
    'priceGuard_alerts_cache',
    
    // Chaves antigas que podem existir
    'user',
    'access_token',
    'refresh_token',
    'token_expires_in',
    'token_type',
    'user_settings',
    'notificationSettings',
    'theme',
  ];

  // Remove todas as chaves da aplicação
  appKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  // Remove também qualquer chave que comece com 'priceGuard'
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('priceGuard')) {
      localStorage.removeItem(key);
    }
  });

  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('priceGuard')) {
      sessionStorage.removeItem(key);
    }
  });

  console.log('🧹 Todos os dados da aplicação foram limpos');
};

// Função para debug - mostra todos os dados armazenados
export const debugStorageData = () => {
  console.log('📊 Dados do localStorage:');
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('priceGuard')) {
      console.log(`  ${key}:`, localStorage.getItem(key));
    }
  });

  console.log('📊 Dados do sessionStorage:');
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('priceGuard')) {
      console.log(`  ${key}:`, sessionStorage.getItem(key));
    }
  });
};
