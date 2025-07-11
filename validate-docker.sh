#!/bin/bash

# Script de validação da configuração Docker
# Verifica se todos os arquivos necessários estão presentes e configurados corretamente

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Validando configuração Docker do PriceGuard...${NC}"
echo ""

# Lista de arquivos obrigatórios
required_files=(
    "Dockerfile"
    "Dockerfile.dev"
    "docker-compose.yml"
    "nginx.conf"
    "nginx-dev.conf"
    ".dockerignore"
    ".env.docker"
    "docker.sh"
    "docs/DOCKER_SETUP.md"
)

# Verificar se os arquivos existem
echo -e "${BLUE}📁 Verificando arquivos obrigatórios...${NC}"
missing_files=()

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ✅ $file"
    else
        echo -e "  ❌ $file ${RED}(AUSENTE)${NC}"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo -e "\n${RED}❌ Arquivos ausentes encontrados!${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ Todos os arquivos obrigatórios estão presentes!${NC}"

# Verificar se o Docker está instalado
echo -e "\n${BLUE}🐳 Verificando instalação do Docker...${NC}"

if command -v docker &> /dev/null; then
    docker_version=$(docker --version)
    echo -e "  ✅ Docker: $docker_version"
else
    echo -e "  ❌ Docker não está instalado!"
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    compose_version=$(docker-compose --version)
    echo -e "  ✅ Docker Compose: $compose_version"
else
    echo -e "  ❌ Docker Compose não está instalado!"
    exit 1
fi

# Verificar se o script docker.sh é executável
echo -e "\n${BLUE}🔧 Verificando permissões...${NC}"
if [ -x "docker.sh" ]; then
    echo -e "  ✅ docker.sh é executável"
else
    echo -e "  ⚠️  Tornando docker.sh executável..."
    chmod +x docker.sh
    echo -e "  ✅ Permissões corrigidas"
fi

# Verificar se o arquivo .env existe
echo -e "\n${BLUE}⚙️  Verificando configuração de ambiente...${NC}"
if [ -f ".env" ]; then
    echo -e "  ✅ Arquivo .env existe"
else
    echo -e "  ⚠️  Arquivo .env não encontrado, criando a partir de .env.docker..."
    cp .env.docker .env
    echo -e "  ✅ Arquivo .env criado"
fi

# Validar sintaxe do docker-compose.yml
echo -e "\n${BLUE}📋 Validando sintaxe do docker-compose.yml...${NC}"
if docker-compose config > /dev/null 2>&1; then
    echo -e "  ✅ docker-compose.yml tem sintaxe válida"
else
    echo -e "  ❌ docker-compose.yml tem erros de sintaxe"
    exit 1
fi

# Verificar se as portas estão disponíveis
echo -e "\n${BLUE}🔌 Verificando disponibilidade de portas...${NC}"

check_port() {
    local port=$1
    local name=$2
    
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo -e "  ⚠️  Porta $port ($name) está em uso"
        return 1
    else
        echo -e "  ✅ Porta $port ($name) disponível"
        return 0
    fi
}

# Verificar portas principais
check_port 3000 "Desenvolvimento"
check_port 80 "Produção HTTP"
check_port 443 "Produção HTTPS"

echo -e "\n${GREEN}🎉 Validação concluída com sucesso!${NC}"
echo ""
echo -e "${BLUE}🚀 Próximos passos:${NC}"
echo -e "  1. Ajuste as variáveis no arquivo .env conforme necessário"
echo -e "  2. Execute: ${GREEN}./docker.sh dev${NC} para desenvolvimento"
echo -e "  3. Execute: ${GREEN}./docker.sh prod${NC} para produção"
echo -e "  4. Consulte: ${GREEN}docs/DOCKER_SETUP.md${NC} para documentação completa"
echo ""
echo -e "${YELLOW}💡 Dica: Use './docker.sh help' para ver todos os comandos disponíveis${NC}"
