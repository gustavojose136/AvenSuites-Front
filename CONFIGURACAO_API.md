# 🔧 Configuração da API Externa

Este documento explica como configurar a conexão com a API externa do AvenSuites.

## 📋 Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# ============================================
# API EXTERNA - AVENSUITES BACKEND
# ============================================
NEXT_PUBLIC_API_URL=https://localhost:7000/api

# ============================================
# NEXTAUTH CONFIGURATION
# ============================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-super-segura-aqui

# ============================================
# OAUTH PROVIDERS (OPCIONAL)
# ============================================
GITHUB_CLIENT_ID=seu_github_client_id
GITHUB_CLIENT_SECRET=seu_github_client_secret

GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret

# ============================================
# EMAIL PROVIDER (OPCIONAL)
# ============================================
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=seu_email@gmail.com
EMAIL_SERVER_PASSWORD=sua_senha_app
EMAIL_FROM=noreply@avensuites.com

# ============================================
# DATABASE (SE USAR PRISMA LOCALMENTE)
# ============================================
DATABASE_URL=postgresql://usuario:senha@localhost:5432/avensuites
```

## 🔑 Variáveis Principais

### 1. NEXT_PUBLIC_API_URL
- **Descrição**: URL base da sua API backend
- **Exemplo Development**: `https://localhost:7000/api`
- **Exemplo Production**: `https://api.avensuites.com/api`
- **Nota**: O prefixo `NEXT_PUBLIC_` torna a variável acessível no client-side

### 2. NEXTAUTH_SECRET
- **Descrição**: Chave secreta para criptografia do NextAuth
- **Como gerar**: Execute no terminal:
  ```bash
  openssl rand -base64 32
  ```
- **Importante**: NUNCA compartilhe esta chave!

### 3. NEXTAUTH_URL
- **Descrição**: URL do seu frontend
- **Exemplo Development**: `http://localhost:3000`
- **Exemplo Production**: `https://avensuites.com`

## 🔐 Endpoint de Login

O sistema está configurado para usar o seguinte endpoint:

```
POST ${NEXT_PUBLIC_API_URL}/Auth/login
```

### Request Body:
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

### Response Esperada:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "usuario@email.com",
    "name": "Nome do Usuário",
    "roles": ["ADMIN", "USER"],
    "image": "https://avatar.url/image.jpg"
  },
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

### Estruturas Alternativas Suportadas:

#### Formato 1 (Recomendado):
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "user_id",
    "email": "email@example.com",
    "name": "User Name",
    "roles": ["ADMIN"]
  }
}
```

#### Formato 2 (Simplificado):
```json
{
  "accessToken": "JWT_TOKEN",
  "id": "user_id",
  "email": "email@example.com",
  "name": "User Name",
  "roles": ["USER"]
}
```

## 🛠️ Testando a Integração

### 1. Verificar se a API está rodando

```bash
curl -k https://localhost:7000/api/Auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@email.com","password":"senha123"}'
```

### 2. Verificar logs do Next.js

Ao fazer login, você verá logs no console:

```
🔐 Iniciando processo de autenticação...
📧 Email: usuario@email.com
🌐 API URL: https://localhost:7000/api
🔗 Endpoint: /Auth/login
📡 Response status: 200
✅ Login bem-sucedido!
👤 Usuário: { ... }
```

### 3. Testar no Frontend

1. Acesse: `http://localhost:3000/signin`
2. Insira credenciais válidas
3. Clique em "Entrar no Sistema"
4. Verifique o console do navegador e do terminal

## ⚠️ Troubleshooting

### Erro: "Erro de conexão com o servidor"
- ✅ Verifique se a API está rodando
- ✅ Confirme a URL em `NEXT_PUBLIC_API_URL`
- ✅ Verifique se não há firewall bloqueando

### Erro: "E-mail ou senha inválidos"
- ✅ Confirme as credenciais
- ✅ Verifique se o usuário existe no banco
- ✅ Veja os logs da API para mais detalhes

### Erro de SSL/Certificado
- ✅ Em desenvolvimento, o código já ignora certificados inválidos
- ✅ Em produção, use certificados SSL válidos

### Token não está sendo enviado nas requisições
- ✅ Verifique se o token está sendo salvo na sessão
- ✅ Confirme que o `HttpClient` está funcionando
- ✅ Veja os headers das requisições no DevTools

## 🔄 Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend (Next.js)
    participant N as NextAuth
    participant A as API Externa
    
    U->>F: Preenche formulário de login
    F->>N: signIn(credentials)
    N->>A: POST /Auth/login
    A->>N: { token, user }
    N->>N: Cria sessão JWT
    N->>F: Session com token
    F->>U: Redirect para dashboard
    
    Note over F,A: Requisições autenticadas usam o token
    
    F->>A: GET /api/hotels (Bearer token)
    A->>F: Lista de hotéis
```

## 🚀 Próximos Passos

1. ✅ Configure o arquivo `.env.local`
2. ✅ Inicie sua API backend
3. ✅ Inicie o frontend: `npm run dev`
4. ✅ Teste o login
5. ✅ Verifique se o token está sendo salvo
6. ✅ Teste requisições autenticadas

## 📝 Arquivos Relacionados

- `src/utils/auth.ts` - Configuração do NextAuth
- `src/infrastructure/http/HttpClient.ts` - Cliente HTTP
- `src/components/Auth/SignIn/index.tsx` - Componente de Login
- `src/app/api/auth/[...nextauth]/route.ts` - API Route do NextAuth

## 🆘 Precisa de Ajuda?

Se encontrar problemas:
1. Verifique os logs do console
2. Veja a documentação da sua API
3. Confirme as variáveis de ambiente
4. Entre em contato com o suporte

---

**Última atualização**: 2025
**Versão**: 1.0.0

