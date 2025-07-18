#!/bin/bash
# Script para testar o fluxo de autenticação

echo "🔧 Testando fluxo de autenticação do PriceGuard"
echo "============================================="

echo ""
echo "📋 Variáveis de ambiente:"
echo "REACT_APP_SKIP_AUTH: $(cat .env.local | grep REACT_APP_SKIP_AUTH)"
echo "REACT_APP_GOOGLE_CLIENT_ID: $(cat .env.local | grep REACT_APP_GOOGLE_CLIENT_ID | cut -c1-50)..."

echo ""
echo "🚀 Iniciando aplicação em http://localhost:3000"
echo ""
echo "📝 Passos para testar:"
echo "1. Acesse http://localhost:3000 - deve redirecionar para /login"
echo "2. Faça login com Google OAuth (ou use o login de teste)"
echo "3. Acesse http://localhost:3000/debug para debug"
echo "4. Clique em 'Executar Logout'"
echo "5. Verifique se volta para /login"
echo "6. Tente fazer login novamente"
echo ""
echo "✅ Se tudo funcionar corretamente:"
echo "   - Login deve funcionar com Google OAuth"
echo "   - Logout deve limpar completamente a sessão"
echo "   - Novo login não deve usar dados em cache"
echo ""

npm start
