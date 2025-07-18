# Guia de Segurança - PriceGuard

## 🔒 Informações Sensíveis

Este projeto utiliza informações sensíveis que **NUNCA** devem ser commitadas no repositório:

### Arquivos Protegidos pelo .gitignore

- **Arquivos de Ambiente:**
  - `.env.local` - Configurações locais de desenvolvimento
  - `.env.development.local` - Sobrescreve configurações de desenvolvimento
  - `.env.production.local` - Sobrescreve configurações de produção
  - `.env.test.local` - Configurações de teste

- **Certificados e Chaves:**
  - `*.pem`, `*.key`, `*.crt` - Certificados SSL
  - `*.p12`, `*.pfx` - Certificados em outros formatos
  - `private-keys/` - Diretório de chaves privadas

- **Credenciais de APIs:**
  - `api-keys.json` - Chaves de APIs
  - `credentials.json` - Credenciais de serviços
  - `service-account-key.json` - Chaves de conta de serviço

## 🛠️ Configuração Segura

### 1. Configuração Local

Copie o arquivo de exemplo e configure com suas credenciais:

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais reais:

```bash
# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=seu_google_client_id_real

# APIs
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080/ws/dashboard
```

### 2. Google OAuth Setup

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione existente
3. Ative a API do Google OAuth 2.0
4. Crie credenciais OAuth 2.0 Client ID
5. Configure URLs autorizadas:
   - `http://localhost:3000` (desenvolvimento)
   - `https://seu-dominio.com` (produção)

### 3. Verificação de Segurança

Execute o script de verificação:

```bash
./security-check.sh
```

## ⚠️ Práticas de Segurança

### ✅ Faça:
- Use `.env.local` para desenvolvimento local
- Mantenha credenciais em variáveis de ambiente em produção
- Use valores falsos em `.env.example`
- Execute `security-check.sh` regularmente
- Revogue credenciais se expostas acidentalmente

### ❌ Nunca Faça:
- Commitar arquivos `.env.local` ou similares
- Incluir credenciais reais em código
- Compartilhar chaves privadas por email/chat
- Usar credenciais de produção em desenvolvimento
- Deixar credenciais em comentários

## 🚨 Se Credenciais Foram Expostas

1. **Revogar imediatamente:**
   - Google Client ID: Google Cloud Console
   - API Keys: Plataforma respectiva
   - Certificados: Regenerar novos

2. **Limpar histórico do Git:**
   ```bash
   # Para arquivo específico
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch arquivo-sensivel' \
   --prune-empty --tag-name-filter cat -- --all
   
   # Força push (cuidado!)
   git push origin --force --all
   ```

3. **Notificar equipe** sobre a exposição

## 📝 Checklist de Deploy

- [ ] Todas as credenciais estão em variáveis de ambiente
- [ ] Nenhum arquivo sensível foi commitado
- [ ] `.env.local` não está no repositório
- [ ] Certificados SSL são válidos e seguros
- [ ] APIs keys têm escopo mínimo necessário
- [ ] Logs não expõem informações sensíveis

## 🔧 Scripts Úteis

- `./security-check.sh` - Verificação de segurança
- `npm run build` - Verifica se build funciona sem credenciais expostas

## 📞 Contato

Em caso de dúvidas sobre segurança, entre em contato com a equipe de desenvolvimento.
