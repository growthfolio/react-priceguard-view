# 🔥 PriceGuard - Monitor de Preços de Criptomoedas

<div align="center">
  <img src="public/logo512.png" alt="PriceGuard Logo" width="120" height="120">
  
  **Plataforma inteligente para monitoramento de criptomoedas em tempo real**
  
  [![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
</div>

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [Docker](#-docker)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API e WebSocket](#-api-e-websocket)
- [Testes](#-testes)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🎯 Sobre o Projeto

O **PriceGuard** é uma plataforma moderna e intuitiva para monitoramento de preços de criptomoedas em tempo real. Desenvolvida com React e TypeScript, oferece uma experiência rica para traders e investidores acompanharem o mercado de criptomoedas.

### ✨ Principais Características

- 📊 **Dashboard Avançado** - Visualizações interativas com gráficos em tempo real
- 🔔 **Alertas Inteligentes** - Notificações personalizadas para mudanças de preços
- 🔒 **Autenticação Segura** - Login com Google OAuth 2.0
- ⚡ **Tempo Real** - Dados atualizados via WebSocket
- 📱 **Responsivo** - Interface adaptável para todos os dispositivos
- 🐳 **Docker Ready** - Ambiente containerizado para desenvolvimento e produção

## 🚀 Funcionalidades

### 🏠 Página Inicial
- Visão geral do mercado de criptomoedas
- Estatísticas globais e tendências
- Interface moderna com animações suaves

### 📈 Mercado
- **Visão Geral**: Top gainers e losers do dia
- **Tabela Completa**: Lista abrangente com filtros e ordenação
- **Dashboard Avançado**: Análises técnicas detalhadas com indicadores

### 👤 Perfil do Usuário
- Gerenciamento de configurações pessoais
- Histórico de atividades
- Configurações de alertas e notificações

### 📊 Widgets TradingView
- Gráficos interativos integrados
- Análise técnica avançada
- Múltiplos timeframes

## 🛠 Tecnologias

### Frontend
- **React** 18.3.1 - Biblioteca principal
- **TypeScript** 5.7.2 - Tipagem estática
- **React Router** 6.28.0 - Navegação
- **TailwindCSS** 3.4.1 - Estilização utilitária

### UI/UX
- **Material-UI** 6.1.8 - Componentes avançados
- **Phosphor Icons** 2.1.7 - Ícones modernos
- **React Toastify** 10.0.6 - Notificações
- **Recharts** 2.13.3 - Gráficos e visualizações

### Autenticação & Estado
- **React OAuth Google** 0.12.1 - Autenticação
- **JWT Decode** 4.0.0 - Decodificação de tokens
- **Axios** 1.3.4 - Cliente HTTP

### Desenvolvimento
- **Docker** - Containerização
- **ESLint** - Linting de código
- **React Hook Form** 7.53.2 - Gerenciamento de formulários

## 📋 Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- **Docker** (opcional, para ambiente containerizado)
- **Google OAuth Client ID** (para autenticação)

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/growthfolio/react-priceguard-view.git
cd react-priceguard-view
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.docker .env

# Edite as variáveis necessárias
REACT_APP_GOOGLE_CLIENT_ID=seu_google_client_id
REACT_APP_API_URL=http://localhost:8080
REACT_APP_SKIP_AUTH=false  # true para modo de teste
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm start
# ou
yarn start
```

A aplicação estará disponível em `http://localhost:3000`

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `REACT_APP_GOOGLE_CLIENT_ID` | ID do cliente Google OAuth | - |
| `REACT_APP_API_URL` | URL da API backend | `http://localhost:8080` |
| `REACT_APP_SKIP_AUTH` | Pular autenticação (modo teste) | `false` |

### Modo de Teste

Para desenvolvimento sem necessidade de autenticação:

```bash
# No arquivo .env
REACT_APP_SKIP_AUTH=true
```

Este modo utiliza dados mockados e um usuário de teste padrão.

## 🎮 Como Usar

### 1. **Login**
- Acesse a página de login
- Use sua conta Google para autenticação
- Ou ative o modo de teste para acesso direto

### 2. **Dashboard Principal**
- Visualize estatísticas globais do mercado
- Acompanhe as principais criptomoedas
- Acesse recursos rápidos

### 3. **Página de Mercado**
- **Visão Geral**: Top gainers/losers
- **Tabela**: Lista completa com filtros
- **Dashboard Avançado**: Análises técnicas

### 4. **Análise Detalhada**
- Clique em qualquer criptomoeda para abrir o gráfico TradingView
- Analise tendências e indicadores técnicos
- Configure alertas personalizados

## 🐳 Docker

### Desenvolvimento Rápido

```bash
# Iniciar ambiente de desenvolvimento
./docker.sh dev

# Ou usando docker-compose diretamente
docker-compose --profile dev up
```

### Produção

```bash
# Build e deploy em produção
./docker.sh prod

# Verificar status
./docker.sh status
```

### Scripts Docker Disponíveis

| Comando | Descrição |
|---------|-----------|
| `./docker.sh dev` | Ambiente de desenvolvimento |
| `./docker.sh prod` | Ambiente de produção |
| `./docker.sh build` | Build das imagens |
| `./docker.sh stop` | Parar containers |
| `./docker.sh clean` | Limpeza completa |
| `./docker.sh logs [serviço]` | Visualizar logs |

### Profiles Docker

- **dev**: Desenvolvimento com hot-reload
- **prod**: Produção com Nginx
- **dev-nginx**: Desenvolvimento + Nginx

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Button, Card, etc)
│   ├── layout/         # Layout da aplicação
│   ├── nav/           # Navegação e navbar
│   ├── footer/        # Rodapé
│   ├── marketTable/   # Componentes da tabela de mercado
│   └── dropdowns/     # Menus dropdown
├── contexts/           # Contextos React
│   ├── AuthContext.tsx    # Autenticação
│   └── WebSocketContext.tsx # WebSocket
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
│   ├── home/          # Página inicial
│   ├── login/         # Autenticação
│   ├── market/        # Mercado
│   └── profile/       # Perfil do usuário
├── routes/             # Configuração de rotas
├── services/           # Serviços (API, WebSocket)
├── models/             # Modelos TypeScript
├── utils/              # Utilitários
└── modal/              # Componentes de modal
```

## 🌐 API e WebSocket

### Endpoints da API

```typescript
// Serviços principais
/api/auth/google        # Autenticação Google
/api/crypto/data        # Dados de criptomoedas
/api/user/profile       # Perfil do usuário
/api/alerts             # Alertas personalizados
```

### WebSocket

```typescript
// Conexão em tempo real
ws://localhost:8080/websocket

// Eventos
- crypto_data_update    # Atualização de preços
- alert_triggered       # Alerta disparado
- connection_status     # Status da conexão
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com cobertura
npm test -- --coverage --watchAll=false

# Via Docker
./docker.sh test
```

### Estrutura de Testes

- **Unit Tests**: Componentes individuais
- **Integration Tests**: Fluxos completos
- **E2E Tests**: Cenários de usuário

## 📊 Funcionalidades Técnicas

### Performance
- ⚡ Lazy loading de componentes
- 🎯 Memoização de dados pesados
- 📦 Code splitting automático
- 🔄 Cache inteligente de dados

### Segurança
- 🔐 Autenticação JWT
- 🛡️ Sanitização de dados
- 🔒 HTTPS em produção
- 🚫 Proteção XSS/CSRF

### Monitoramento
- 📈 Web Vitals
- 🔍 Error tracking
- 📊 Performance metrics
- 🚀 Health checks

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o projeto
2. **Clone** seu fork
3. **Crie** uma branch para sua feature
4. **Commit** suas mudanças
5. **Push** para a branch
6. **Abra** um Pull Request

### Padrões de Commit

```bash
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: mudanças de estilo/formatação
refactor: refatoração de código
test: adiciona ou modifica testes
chore: tarefas de manutenção
```

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm start

# Executar testes
npm test

# Build para produção
npm run build
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

**Desenvolvido por [Felipe Macedo](https://github.com/felipemacedo1)**

### 🌟 Funcionalidades Futuras

- [ ] Notificações push
- [ ] Modo escuro/claro
- [ ] API própria para dados
- [ ] App mobile React Native
- [ ] Alertas por email/SMS
- [ ] Portfolio tracking
- [ ] Social trading features

### 🐛 Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/growthfolio/react-priceguard-view/issues/new)

### 💬 Suporte

- 📧 Email: contato.dev.macedo@gmail.com
<!--
- 💬 Discord: [PriceGuard Community](https://discord.gg/priceguard)
- 📚 Documentação: [docs.priceguard.dev](https://docs.priceguard.dev)
-->
---

<div align="center">
  <p>⭐ Não esqueça de dar uma estrela se o projeto foi útil!</p>
  <p>🚀 <strong>Happy Trading!</strong> 🚀</p>
</div>
