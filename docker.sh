#!/bin/bash

# Scripts para gerenciamento Docker do PriceGuard
# Uso: ./docker.sh [comando] [argumentos]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir ajuda
show_help() {
    echo -e "${BLUE}PriceGuard Docker Management Script${NC}"
    echo ""
    echo "Uso: ./docker.sh [comando] [argumentos]"
    echo ""
    echo "Comandos disponíveis:"
    echo -e "  ${GREEN}dev${NC}           - Iniciar ambiente de desenvolvimento"
    echo -e "  ${GREEN}prod${NC}          - Iniciar ambiente de produção"
    echo -e "  ${GREEN}build${NC}         - Construir imagens Docker"
    echo -e "  ${GREEN}stop${NC}          - Parar todos os containers"
    echo -e "  ${GREEN}clean${NC}         - Limpar containers e imagens"
    echo -e "  ${GREEN}logs${NC}          - Exibir logs dos containers"
    echo -e "  ${GREEN}shell${NC}         - Acessar shell do container"
    echo -e "  ${GREEN}test${NC}          - Executar testes"
    echo -e "  ${GREEN}health${NC}        - Verificar status dos containers"
    echo ""
    echo "Exemplos:"
    echo "  ./docker.sh dev          # Iniciar desenvolvimento"
    echo "  ./docker.sh prod         # Iniciar produção"
    echo "  ./docker.sh logs dev     # Ver logs do ambiente de desenvolvimento"
    echo "  ./docker.sh shell dev    # Acessar shell do container de desenvolvimento"
}

# Função para verificar se o Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker não está instalado!${NC}"
        echo "Instale o Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose não está instalado!${NC}"
        echo "Instale o Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
}

# Função para verificar se o arquivo .env existe
check_env() {
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠️  Arquivo .env não encontrado. Criando a partir de .env.docker...${NC}"
        cp .env.docker .env
        echo -e "${GREEN}✅ Arquivo .env criado! Ajuste as variáveis conforme necessário.${NC}"
    fi
}

# Iniciar ambiente de desenvolvimento
start_dev() {
    echo -e "${BLUE}🚀 Iniciando ambiente de desenvolvimento...${NC}"
    docker-compose --profile dev up --build -d
    echo -e "${GREEN}✅ Ambiente de desenvolvimento iniciado!${NC}"
    echo -e "${BLUE}📱 Aplicação disponível em: http://localhost:3000${NC}"
}

# Iniciar ambiente de produção
start_prod() {
    echo -e "${BLUE}🚀 Iniciando ambiente de produção...${NC}"
    docker-compose --profile prod up --build -d
    echo -e "${GREEN}✅ Ambiente de produção iniciado!${NC}"
    echo -e "${BLUE}🌐 Aplicação disponível em: http://localhost${NC}"
}

# Construir imagens
build_images() {
    echo -e "${BLUE}🔨 Construindo imagens Docker...${NC}"
    docker-compose build --no-cache
    echo -e "${GREEN}✅ Imagens construídas com sucesso!${NC}"
}

# Parar containers
stop_containers() {
    echo -e "${BLUE}⏹️  Parando containers...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Containers parados!${NC}"
}

# Limpar containers e imagens
clean_docker() {
    echo -e "${YELLOW}🧹 Limpando containers e imagens...${NC}"
    docker-compose down --volumes --remove-orphans
    docker system prune -f
    echo -e "${GREEN}✅ Limpeza concluída!${NC}"
}

# Exibir logs
show_logs() {
    local service=${2:-""}
    if [ -n "$service" ]; then
        echo -e "${BLUE}📋 Exibindo logs do serviço: $service${NC}"
        docker-compose logs -f "price-guard-$service"
    else
        echo -e "${BLUE}📋 Exibindo logs de todos os serviços...${NC}"
        docker-compose logs -f
    fi
}

# Acessar shell do container
access_shell() {
    local service=${2:-"dev"}
    echo -e "${BLUE}🐚 Acessando shell do container: price-guard-$service${NC}"
    docker-compose exec "price-guard-$service" /bin/sh
}

# Executar testes
run_tests() {
    echo -e "${BLUE}🧪 Executando testes...${NC}"
    docker-compose --profile dev run --rm price-guard-dev npm test -- --coverage --watchAll=false
}

# Verificar status dos containers
check_health() {
    echo -e "${BLUE}🔍 Verificando status dos containers...${NC}"
    docker-compose ps
    echo ""
    echo -e "${BLUE}🏥 Status de saúde dos containers:${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Verificar dependências
check_docker
check_env

# Processar comandos
case ${1:-""} in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "build")
        build_images
        ;;
    "stop")
        stop_containers
        ;;
    "clean")
        clean_docker
        ;;
    "logs")
        show_logs "$@"
        ;;
    "shell")
        access_shell "$@"
        ;;
    "test")
        run_tests
        ;;
    "health")
        check_health
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Comando desconhecido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
