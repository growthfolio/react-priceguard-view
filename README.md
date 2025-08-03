# 🛡️ React PriceGuard View - Frontend de Monitoramento Crypto

## 🎯 Objetivo de Aprendizado
Projeto frontend desenvolvido para estudar **React + TypeScript avançado**, **WebSockets**, **autenticação OAuth**, e **integração com APIs**, criando uma plataforma completa de monitoramento de criptomoedas em tempo real.

## 🛠️ Tecnologias Utilizadas
- **Frontend:** React 18, TypeScript 5.7
- **Styling:** TailwindCSS, Material-UI
- **Estado:** Context API, Custom Hooks
- **Autenticação:** Google OAuth 2.0, JWT
- **Comunicação:** Axios, WebSocket
- **Gráficos:** Recharts, TradingView Widgets
- **Build:** Vite, Docker
- **Conceitos estudados:**
  - React avançado (Hooks, Context, Performance)
  - TypeScript interfaces e tipos
  - WebSocket real-time
  - OAuth 2.0 e JWT
  - Responsive design
  - Docker containerization

## 🚀 Demonstração
```tsx
// WebSocket Context para dados real-time
const WebSocketContext = createContext<WebSocketContextType>({} as WebSocketContextType);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

// Hook customizado para crypto data
const useCryptoData = () => {
  const [prices, setPrices] = useState<Map<string, PriceData>>(new Map());
  const { subscribe, unsubscribe } = useWebSocket();
  
  useEffect(() => {
    subscribe('price_updates', (data: PriceUpdate) => {
      setPrices(prev => new Map(prev.set(data.symbol, data)));
    });
    
    return () => unsubscribe('price_updates');
  }, []);
  
  return { prices };
};
```

## 💡 Principais Aprendizados

### ⚛️ React Avançado
- **Custom Hooks:** Reutilização de lógica complexa
- **Context API:** Gerenciamento de estado global
- **Performance:** useMemo, useCallback, lazy loading
- **Error Boundaries:** Tratamento de erros

### 🔌 Comunicação Real-time
- **WebSocket:** Conexão persistente para dados live
- **Reconnection Logic:** Reconexão automática
- **Message Handling:** Tipagem de mensagens WebSocket
- **Subscription Management:** Gerenciamento de canais

### 🔐 Autenticação e Segurança
- **Google OAuth:** Integração com @react-oauth/google
- **JWT Handling:** Armazenamento e renovação de tokens
- **Protected Routes:** Rotas condicionais por autenticação
- **Session Management:** Controle de sessão do usuário

## 🧠 Conceitos Técnicos Estudados

### 1. **WebSocket Service**
```typescript
class WebSocketService {
  private socket: WebSocket | null = null;
  private eventHandlers: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = sessionService.getToken();
      const wsUrl = `${this.baseUrl}/ws?token=${encodeURIComponent(token)}`;
      
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        resolve();
      };
      
      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      };
    });
  }
}
```

### 2. **TypeScript Interfaces**
```typescript
interface CryptoData {
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  last_updated: string;
}

interface WebSocketMessage {
  type: 'price_update' | 'alert_triggered' | 'notification';
  data: any;
  timestamp: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
```

### 3. **Responsive Components**
```tsx
const MarketTable: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'market_cap', direction: 'desc' });
  
  const sortedData = useMemo(() => {
    return [...cryptoData].sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });
  }, [cryptoData, sortConfig]);
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-lg rounded-lg">
        {/* Table implementation */}
      </table>
    </div>
  );
};
```

## 📁 Estrutura do Projeto
```
react-priceguard-view/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base
│   │   ├── layout/         # Layout da aplicação
│   │   └── marketTable/    # Tabela de mercado
│   ├── contexts/           # Context API
│   │   ├── AuthContext.tsx
│   │   └── WebSocketContext.tsx
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Páginas da aplicação
│   ├── services/           # Serviços (API, WebSocket)
│   ├── models/             # Interfaces TypeScript
│   └── utils/              # Funções utilitárias
├── public/                 # Assets estáticos
├── docker-compose.yml      # Configuração Docker
└── nginx.conf             # Configuração Nginx
```

## 🔧 Como Executar

### Desenvolvimento Local
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Iniciar aplicação
npm start
```

### Docker (Recomendado)
```bash
# Desenvolvimento
./docker.sh dev

# Produção
./docker.sh prod

# Verificar status
./docker.sh status
```

### Configuração OAuth
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie credenciais OAuth 2.0
3. Configure URLs autorizadas
4. Adicione Client ID no `.env.local`

## 🚧 Desafios Enfrentados
1. **WebSocket Management:** Reconexão automática e handling de mensagens
2. **TypeScript:** Tipagem complexa para dados de crypto
3. **Performance:** Otimização de re-renders com dados real-time
4. **OAuth Integration:** Fluxo completo de autenticação Google
5. **Responsive Design:** Interface adaptável para mobile/desktop
6. **Docker Configuration:** Setup para desenvolvimento e produção

## 📚 Recursos Utilizados
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Google OAuth Guide](https://developers.google.com/identity/oauth2/web/guides/overview)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 📈 Próximos Passos
- [ ] Implementar PWA (Progressive Web App)
- [ ] Adicionar testes automatizados (Jest + Testing Library)
- [ ] Criar sistema de notificações push
- [ ] Implementar modo escuro/claro
- [ ] Adicionar mais indicadores técnicos
- [ ] Otimizar performance com React Query

## 🔗 Projetos Relacionados
- [Go PriceGuard API](../go-priceguard-api/) - Backend da aplicação
- [React E-commerce](../react-ecommerce-tt/) - Experiência com React
- [Java Generation Notes](../java-generation-notes/) - Base de estudos

---

**Desenvolvido por:** Felipe Macedo  
**Contato:** contato.dev.macedo@gmail.com  
**GitHub:** [FelipeMacedo](https://github.com/felipemacedo1)  
**LinkedIn:** [felipemacedo1](https://linkedin.com/in/felipemacedo1)

> 💡 **Reflexão:** Este projeto elevou meus conhecimentos em React e TypeScript a um nível avançado. A integração com WebSockets, OAuth e a criação de uma interface complexa e responsiva consolidaram habilidades essenciais para desenvolvimento frontend moderno.