# 🔌 Integração com API Externa - AvenSuites

## ✅ O que foi implementado

### 1. Autenticação com API Externa
- ✅ Login integrado com endpoint `/Auth/login` da sua API
- ✅ Suporte a múltiplos formatos de resposta
- ✅ Tratamento de erros personalizado em português
- ✅ Logs detalhados para debugging
- ✅ Ignora certificados SSL em desenvolvimento

### 2. Cliente HTTP Configurado
- ✅ `HttpClient` com Axios configurado
- ✅ Interceptor automático para adicionar Bearer token
- ✅ Suporte a HTTPS com certificados inválidos (dev)
- ✅ Base URL configurável via variável de ambiente

### 3. Gestão de Sessão
- ✅ NextAuth configurado com JWT
- ✅ Token salvo na sessão
- ✅ Token enviado automaticamente em todas requisições
- ✅ Suporte a roles/permissões do usuário

## 🚀 Como Usar

### Passo 1: Configurar Variáveis de Ambiente

**Opção A - Configuração Automática:**
```bash
npm run setup
```

**Opção B - Configuração Manual:**
```bash
# Copie o arquivo de exemplo
cp env.example.txt .env.local

# Edite e configure:
# NEXT_PUBLIC_API_URL=https://localhost:7000/api
# NEXTAUTH_SECRET=sua-chave-secreta
```

### Passo 2: Verificar sua API

Certifique-se que sua API está respondendo em:
```
POST https://localhost:7000/api/Auth/login
```

Teste com curl:
```bash
curl -k https://localhost:7000/api/Auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"senha123"}'
```

### Passo 3: Iniciar o Frontend

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000/signin

## 📋 Formato da Resposta da API

Seu endpoint `/Auth/login` deve retornar um dos seguintes formatos:

### Formato Recomendado:
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

### Formato Alternativo:
```json
{
  "accessToken": "token_aqui",
  "id": "123",
  "email": "usuario@email.com",
  "name": "Nome",
  "roles": ["USER"]
}
```

## 🔐 Como Fazer Requisições Autenticadas

Após o login, use o `HttpClient` para fazer requisições:

```typescript
import { httpClient } from '@/infrastructure/http/HttpClient';

// GET
const hotels = await httpClient.get('/Hotel');

// POST
const newHotel = await httpClient.post('/Hotel', {
  name: 'Hotel Teste',
  address: 'Rua Teste, 123'
});

// PUT
await httpClient.put('/Hotel/123', {
  name: 'Hotel Atualizado'
});

// DELETE
await httpClient.delete('/Hotel/123');
```

O token é adicionado automaticamente em todas as requisições:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔍 Debugging

### Ver logs no console:
```javascript
// No terminal ao fazer login:
🔐 Iniciando processo de autenticação...
📧 Email: usuario@email.com
🌐 API URL: https://localhost:7000/api
🔗 Endpoint: /Auth/login
📡 Response status: 200
✅ Login bem-sucedido!
```

### Inspecionar token na sessão:
```typescript
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session } = useSession();
  console.log('Token:', session?.accessToken);
  console.log('Roles:', session?.roles);
}
```

## ⚠️ Troubleshooting

| Erro | Solução |
|------|---------|
| "Erro de conexão com o servidor" | Verifique se a API está rodando e a URL está correta |
| "E-mail ou senha inválidos" | Confirme as credenciais no banco de dados da API |
| Token não enviado | Verifique se o login foi bem-sucedido e a sessão foi criada |
| Erro SSL | Em dev, já está configurado para ignorar. Em prod, use certificados válidos |

## 📁 Arquivos Importantes

```
src/
├── utils/
│   └── auth.ts                    # ⭐ Configuração do NextAuth
├── infrastructure/
│   └── http/
│       └── HttpClient.ts          # ⭐ Cliente HTTP com Axios
├── components/
│   └── Auth/
│       └── SignIn/
│           └── index.tsx          # ⭐ Componente de Login
└── app/
    └── api/
        └── auth/
            └── [...nextauth]/
                └── route.ts       # API Route do NextAuth
```

## 🎯 Endpoints Configurados

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/Auth/login` | POST | Login com email/senha |
| `/Hotel` | GET | Listar hotéis |
| `/Hotel` | POST | Criar hotel |
| `/Hotel/{id}` | GET | Buscar hotel |
| `/Hotel/{id}` | PUT | Atualizar hotel |
| `/Hotel/{id}` | DELETE | Excluir hotel |

*Adapte conforme os endpoints da sua API*

## 📚 Documentação Completa

- 📖 [GUIA_CONFIGURACAO_API.md](./GUIA_CONFIGURACAO_API.md) - Guia passo a passo
- 📖 [CONFIGURACAO_API.md](./CONFIGURACAO_API.md) - Documentação técnica detalhada
- 📖 [env.example.txt](./env.example.txt) - Exemplo de variáveis de ambiente

## 🔄 Fluxo de Autenticação

```
1. Usuário preenche formulário de login
   ↓
2. Frontend chama signIn("credentials")
   ↓
3. NextAuth faz POST para API externa
   ↓
4. API valida e retorna token + user
   ↓
5. NextAuth cria sessão JWT
   ↓
6. Redirect para dashboard
   ↓
7. Todas as requisições usam o token automaticamente
```

## 🆘 Precisa de Ajuda?

1. ✅ Verifique os logs do console (F12)
2. ✅ Veja os logs do terminal
3. ✅ Teste a API diretamente com curl/Postman
4. ✅ Confirme as variáveis de ambiente
5. ✅ Consulte a documentação completa

## ✨ Próximos Passos

- [ ] Configure as variáveis de ambiente
- [ ] Teste o login
- [ ] Implemente as telas de CRUD (Hotéis, Quartos, etc)
- [ ] Configure refresh token (se sua API suportar)
- [ ] Adicione tratamento de token expirado
- [ ] Configure em produção com certificados válidos

---

**Versão**: 1.0.0  
**Última atualização**: 2025  
**Status**: ✅ Integração completa e funcional

