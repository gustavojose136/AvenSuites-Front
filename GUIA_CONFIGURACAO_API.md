# 🚀 Guia Rápido de Configuração da API

## ✅ Checklist de Configuração

### 1️⃣ Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp env.example.txt .env.local
```

Edite o arquivo `.env.local` e configure:

```env
NEXT_PUBLIC_API_URL=https://localhost:7000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-aqui
```

**Para gerar o NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 2️⃣ Estrutura Esperada da API

Seu endpoint de login deve estar em:
```
POST https://localhost:7000/api/Auth/login
```

**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (Formato Recomendado):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "usuario@email.com",
    "name": "Nome do Usuário",
    "roles": ["ADMIN", "USER"],
    "image": "https://url-da-foto.jpg"
  },
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

**Formatos Alternativos Suportados:**

✅ **Formato 1** (com objeto user separado):
```json
{
  "token": "...",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

✅ **Formato 2** (campos diretos):
```json
{
  "accessToken": "...",
  "id": "...",
  "email": "...",
  "name": "..."
}
```

### 3️⃣ Testar a API

Antes de testar o frontend, certifique-se que sua API está rodando:

```bash
# Teste com curl
curl -k https://localhost:7000/api/Auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"senha123"}'
```

### 4️⃣ Iniciar o Frontend

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

### 5️⃣ Testar o Login

1. Vá para: http://localhost:3000/signin
2. Insira suas credenciais
3. Clique em "Entrar no Sistema"
4. Verifique os logs no console

## 🔍 Logs Esperados

Ao fazer login, você verá no console do terminal:

```
🔐 Iniciando processo de autenticação...
📧 Email: usuario@email.com
🌐 API URL: https://localhost:7000/api
🔗 Endpoint: /Auth/login
📡 Response status: 200
✅ Login bem-sucedido!
👤 Usuário: { id: '123', email: 'usuario@email.com', ... }
```

## ❌ Erros Comuns

### "Erro de conexão com o servidor"
- ✅ Verifique se a API está rodando
- ✅ Confirme a URL em `.env.local`
- ✅ Teste a API com curl primeiro

### "E-mail ou senha inválidos"
- ✅ Confirme as credenciais no banco de dados
- ✅ Verifique se a API está retornando status 200

### "Cannot read property 'token' of undefined"
- ✅ Verifique se a API está retornando o token
- ✅ Confirme o formato da resposta JSON

## 🔐 Como Funciona

1. **Usuário preenche o formulário** no componente SignIn
2. **Next.js chama** `signIn("credentials", { email, password })`
3. **NextAuth processa** em `src/utils/auth.ts`
4. **Faz requisição** para `${NEXT_PUBLIC_API_URL}/Auth/login`
5. **API retorna** token + dados do usuário
6. **NextAuth cria sessão** com JWT
7. **Token é salvo** e usado em todas as requisições

## 📝 Arquivos Modificados

- ✅ `src/utils/auth.ts` - Integração com API externa
- ✅ `src/components/Auth/SignIn/index.tsx` - Interface modernizada
- ✅ `src/infrastructure/http/HttpClient.ts` - Cliente HTTP configurado
- ✅ `CONFIGURACAO_API.md` - Documentação completa

## 🔄 Próximas Requisições

Após o login, todas as requisições para sua API usarão automaticamente o token:

```typescript
// O HttpClient já adiciona o Bearer token automaticamente
import { httpClient } from '@/infrastructure/http/HttpClient';

// Exemplo de uso
const hotels = await httpClient.get('/Hotel');
// Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📚 Documentação Completa

Para mais detalhes, veja: `CONFIGURACAO_API.md`

## 🆘 Precisa de Ajuda?

1. Verifique os logs do console (F12)
2. Veja os logs do terminal
3. Confirme o formato da resposta da API
4. Teste a API diretamente com curl/Postman

---

✅ **Tudo configurado!** Agora você pode fazer login e usar o sistema completo.

