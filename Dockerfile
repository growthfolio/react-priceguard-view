# Dockerfile para produção - Multi-stage build
# Stage 1: Build da aplicação
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY yarn.lock* ./

# Instalar dependências
RUN npm ci --only=production --silent

# Copiar código fonte
COPY . .

# Construir a aplicação para produção
RUN npm run build

# Stage 2: Servir com Nginx
FROM nginx:alpine AS production

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos estáticos do build
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar certificados SSL se existirem
COPY localhost*.pem /etc/ssl/certs/ 2>/dev/null || true

# Expor porta 80 e 443
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
