#!/bin/bash
# Script para verificar e proteger arquivos sensíveis

echo "🔒 Verificação de Segurança - Arquivos Sensíveis"
echo "================================================="

echo ""
echo "📋 Verificando arquivos .env commitados:"
git ls-files | grep -E "\.env" | while read file; do
    echo "⚠️  $file (commitado)"
done

echo ""
echo "📋 Verificando arquivos sensíveis não rastreados:"
find . -name "*.env.local" -o -name "*.env.development.local" -o -name "*.env.production.local" | grep -v node_modules | while read file; do
    echo "✅ $file (ignorado)"
done

echo ""
echo "📋 Verificando certificados e chaves:"
find . -name "*.pem" -o -name "*.key" -o -name "*.crt" | grep -v node_modules | while read file; do
    if git ls-files | grep -q "$file"; then
        echo "⚠️  $file (commitado - ATENÇÃO!)"
    else
        echo "✅ $file (ignorado)"
    fi
done

echo ""
echo "📋 Verificando conteúdo de arquivos .env commitados:"
for file in $(git ls-files | grep -E "\.env"); do
    echo ""
    echo "🔍 Analisando $file:"
    if grep -q "GOOGLE_CLIENT_ID\|SECRET\|PASSWORD\|TOKEN\|KEY" "$file" 2>/dev/null; then
        echo "⚠️  Contém informações potencialmente sensíveis!"
        grep -E "GOOGLE_CLIENT_ID|SECRET|PASSWORD|TOKEN|KEY" "$file" | head -3
    else
        echo "✅ Parece seguro"
    fi
done

echo ""
echo "🛡️  Recomendações de Segurança:"
echo "1. Remover arquivos .env.* do histórico do git se contiverem dados sensíveis"
echo "2. Usar apenas .env.example com valores fictícios"
echo "3. Configurar .env.local apenas localmente"
echo "4. Nunca commitar certificados SSL ou chaves privadas"
echo ""
echo "Para remover arquivo sensível do histórico:"
echo "git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch ARQUIVO' --prune-empty --tag-name-filter cat -- --all"
