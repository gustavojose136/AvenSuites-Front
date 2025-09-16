# 🔗 Integração com API Externa

## 📋 Resumo das Alterações

O projeto foi modificado para integrar com sua API externa em vez de usar o banco de dados local.

## 🛠️ Arquivos Modificados

### 1. `src/utils/auth.ts`
- **Função `authorize`**: Agora faz requisição para sua API externa
- **Callbacks**: Incluem tokens de acesso e refresh da sua API
- **Endpoint**: `${NEXT_PUBLIC_API_URL}/auth/login`

### 2. Novos Arquivos Criados:
- `src/utils/apiClient.ts` - Cliente para requisições autenticadas
- `src/hooks/useApi.ts` - Hook personalizado para usar a API
- `src/components/UserProfile/index.tsx` - Exemplo de uso

## 🔧 Configuração Necessária

### Variáveis de Ambiente (`.env.local`):
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3001  # URL da sua API
```

## 📡 Formato Esperado da Sua API

### Endpoint de Login: `POST /auth/login`
```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response (Sucesso)
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "Nome do Usuário",
    "image": "https://example.com/avatar.jpg"
  },
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}

// Response (Erro)
{
  "message": "Credenciais inválidas"
}
```

### Endpoint de Perfil: `GET /user/profile`
```json
// Headers necessários
Authorization: Bearer {accessToken}

// Response
{
  "id": "user-id",
  "name": "Nome do Usuário",
  "email": "user@example.com",
  "image": "https://example.com/avatar.jpg"
}
```

## 🚀 Como Usar

### 1. No Frontend (Componentes React):
```typescript
import { useApi } from "@/hooks/useApi";

const MyComponent = () => {
  const { session, isAuthenticated, getUserProfile, loading } = useApi();
  
  // Usar os métodos disponíveis
  const loadData = async () => {
    const profile = await getUserProfile();
    // Fazer algo com os dados
  };
};
```

### 2. Requisições Diretas:
```typescript
import { apiClient } from "@/utils/apiClient";

// Fazer requisição autenticada
const data = await apiClient.get('/protected-endpoint');
```

## 🔄 Fluxo de Autenticação

1. **Login**: Usuário insere credenciais no formulário
2. **Validação**: Frontend envia para `${API_URL}/auth/login`
3. **Resposta**: Sua API retorna dados do usuário + tokens
4. **Sessão**: NextAuth armazena tokens na sessão
5. **Requisições**: Todas as requisições subsequentes incluem o token

## 🛡️ Segurança

- Tokens são armazenados de forma segura pelo NextAuth
- Requisições incluem automaticamente o token de autorização
- Suporte a refresh token para renovação automática

## 📝 Próximos Passos

1. **Configure sua API** com os endpoints esperados
2. **Teste o login** com credenciais válidas
3. **Implemente endpoints** adicionais conforme necessário
4. **Adicione tratamento de erros** específicos da sua API

## 🔧 Personalizações Possíveis

- Modificar formato de resposta da API
- Adicionar novos campos de usuário
- Implementar refresh token automático
- Adicionar interceptors para tratamento de erros
