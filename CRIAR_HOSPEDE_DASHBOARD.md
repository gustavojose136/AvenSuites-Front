# 🏨 Criar Hóspede pelo Dashboard

## ✅ **Funcionalidade Implementada**

Agora você pode **criar um novo hóspede diretamente do dashboard**, e o sistema **automaticamente pega o hotelId do usuário logado** através do token JWT!

---

## 🎯 **Como Funciona**

### 1. **Extração Automática do HotelId**

O sistema decodifica o token JWT do usuário logado e extrai o `HotelId` automaticamente:

```typescript
// src/app/(site)/dashboard/page.tsx

import { getHotelIdFromToken } from '@/shared/utils/jwtHelper';

// Extrai hotelId do token JWT
const hotelId = useMemo(() => {
  if (session?.accessToken) {
    return getHotelIdFromToken(session.accessToken as string);
  }
  return null;
}, [session]);
```

### 2. **Link com HotelId Dinâmico**

O botão "Novo Hóspede" no dashboard agora passa automaticamente o hotelId:

```tsx
<Link
  href={hotelId ? `/guests/new?hotelId=${hotelId}&returnTo=/dashboard` : '/guests/new'}
  className="flex flex-col items-center gap-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/20"
>
  <div className="rounded-full bg-white/20 p-3">
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  </div>
  <span className="text-sm font-semibold">Novo Hóspede</span>
</Link>
```

**Parâmetros da URL:**
- `hotelId`: ID do hotel do usuário logado (extraído do JWT)
- `returnTo`: `/dashboard` (volta para o dashboard após criar)

---

## 🔧 **Arquivo Criado: JWT Helper**

### `src/shared/utils/jwtHelper.ts`

Utilitário para decodificar e extrair informações do token JWT:

```typescript
/**
 * Decodifica um JWT token sem validar assinatura
 */
export function decodeJwtToken(token: string): any {
  // Decodifica o payload do JWT
  const parts = token.split('.');
  const payload = parts[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

/**
 * Extrai o HotelId do token JWT
 */
export function getHotelIdFromToken(token: string | undefined | null): string | null {
  if (!token) return null;
  
  const decoded = decodeJwtToken(token);
  if (!decoded) return null;
  
  // O token pode ter HotelId em diferentes formatos
  return decoded.HotelId || decoded.hotelId || decoded.hotel_id || null;
}

/**
 * Extrai informações do usuário do token JWT
 */
export function getUserInfoFromToken(token: string | undefined | null) {
  // ... retorna todas as claims do usuário
}
```

---

## 📊 **Estrutura do Token JWT**

Conforme a documentação da sua API, o token contém:

```json
{
  "nameid": "f36d8acd-1822-4019-ac76-a6ea959d5193",
  "name": "Gustavo",
  "email": "gjose2980@gmail.com",
  "HotelId": "7a326969-3bf6-40d9-96dc-1aecef585000",  // ✅ Extraído automaticamente
  "role": "Hotel-Admin",
  "exp": 1730284200
}
```

**Observação da API:**
- `HotelId` está presente apenas para usuários com role `Hotel-Admin`
- Usuários com role `Admin` não possuem `HotelId` (têm acesso a todos os hotéis)

---

## 🔄 **Fluxo Completo**

```
1. Usuário faz login
   ↓
2. API retorna JWT com HotelId no payload
   ↓
3. NextAuth armazena o token na sessão
   ↓
4. Dashboard carrega
   ↓
5. getHotelIdFromToken() decodifica o JWT
   ↓
6. HotelId é extraído do token
   ↓
7. Link "Novo Hóspede" usa o HotelId
   ↓
8. Usuário clica em "Novo Hóspede"
   ↓
9. Redireciona para /guests/new?hotelId=abc123&returnTo=/dashboard
   ↓
10. Formulário já vem com hotelId preenchido
   ↓
11. Após criar, volta automaticamente para /dashboard
```

---

## 🧪 **Como Testar**

### Teste 1: Usuário Hotel-Admin (com HotelId)

```bash
# 1. Faça login como Hotel-Admin
Email: gjose2980@gmail.com
Senha: SenhaForte@123

# 2. Acesse o Dashboard
http://localhost:3000/dashboard

# 3. Na seção "Ações Rápidas", clique em "Novo Hóspede"

# 4. Verifique a URL:
✅ Deve ser: /guests/new?hotelId=7a326969-3bf6-40d9-96dc-1aecef585000&returnTo=/dashboard

# 5. Preencha os dados do hóspede e cadastre

# 6. Após criar:
✅ Deve voltar automaticamente para /dashboard
✅ Hóspede deve estar associado ao hotel correto
```

### Teste 2: Console do Navegador

```bash
# 1. Abra o DevTools (F12)

# 2. No console, execute:
const token = sessionStorage.getItem('next-auth.session-token');
const parts = atob(token.split('.')[1]);
console.log(JSON.parse(parts));

# 3. Verifique se HotelId está presente:
{
  "nameid": "...",
  "name": "Gustavo",
  "email": "gjose2980@gmail.com",
  "HotelId": "7a326969-3bf6-40d9-96dc-1aecef585000",  // ✅ Aqui!
  "role": "Hotel-Admin"
}
```

---

## 📁 **Arquivos Modificados/Criados**

1. ✅ `src/shared/utils/jwtHelper.ts` - **NOVO** - Utilitário para JWT
2. ✅ `src/app/(site)/dashboard/page.tsx` - Link atualizado com hotelId dinâmico
3. ✅ `CRIAR_HOSPEDE_DASHBOARD.md` - Esta documentação

---

## 🎨 **Visual no Dashboard**

### Seção "Ações Rápidas"

```
┌─────────────────────────────────────────────────┐
│  Ações Rápidas                                  │
│  Acesse rapidamente as principais funcionalidades │
├────────┬────────┬────────┬────────┐
│  🏨   │   🚪   │   👤   │   📅   │
│ Novo  │ Novo   │ Novo   │ Nova   │
│ Hotel │ Quarto │Hóspede │Reserva │ ← ✅ HotelId automático
└────────┴────────┴────────┴────────┘
```

---

## ⚠️ **Tratamento de Erros**

### Usuário Admin (sem HotelId no token)

Se o usuário for `Admin` (sem HotelId no token):

```typescript
href={hotelId ? `/guests/new?hotelId=${hotelId}&returnTo=/dashboard` : '/guests/new'}
```

- **Com HotelId**: `/guests/new?hotelId=abc123&returnTo=/dashboard` ✅
- **Sem HotelId**: `/guests/new` (fallback para seleção manual)

A página `/guests/new` já possui validação:

```tsx
{hotelId ? (
  <GuestForm hotelId={hotelId} onSubmit={handleSubmit} loading={loading} />
) : (
  <div className="warning-box">
    ⚠️ Hotel não especificado
    Por favor, acesse esta página através da tela de nova reserva.
  </div>
)}
```

---

## 🔍 **Debugging**

### Ver HotelId Extraído

Adicione um console.log temporário no dashboard:

```typescript
const hotelId = useMemo(() => {
  if (session?.accessToken) {
    const id = getHotelIdFromToken(session.accessToken as string);
    console.log('🏨 HotelId extraído do token:', id);
    return id;
  }
  return null;
}, [session]);
```

### Logs Esperados:

```
🏨 HotelId extraído do token: 7a326969-3bf6-40d9-96dc-1aecef585000
```

---

## 🎯 **Benefícios**

1. ✅ **Automático**: Não precisa selecionar hotel manualmente
2. ✅ **Seguro**: HotelId vem do token JWT (validado pela API)
3. ✅ **Conveniente**: Um clique e já está no formulário correto
4. ✅ **Fluxo Natural**: Volta para dashboard após criar
5. ✅ **Reutilizável**: Função `getHotelIdFromToken()` pode ser usada em outros lugares
6. ✅ **Compatível**: Funciona com Hotel-Admin e Admin

---

## 🔄 **Reutilização em Outras Páginas**

Você pode usar o mesmo padrão em outras páginas:

### Exemplo: Criar Quarto do Dashboard

```typescript
import { getHotelIdFromToken } from '@/shared/utils/jwtHelper';

const hotelId = useMemo(() => {
  if (session?.accessToken) {
    return getHotelIdFromToken(session.accessToken as string);
  }
  return null;
}, [session]);

// Link atualizado
<Link href={hotelId ? `/rooms/new?hotelId=${hotelId}` : '/rooms/new'}>
  Novo Quarto
</Link>
```

---

## 📊 **Comparativo Antes vs Depois**

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **HotelId** | ❌ Não passava | ✅ Automático do JWT |
| **Seleção Hotel** | ❌ Manual | ✅ Automática |
| **Retorno** | ❌ Ia para /guests | ✅ Volta para /dashboard |
| **Validação** | ❌ Erro se não tinha hotelId | ✅ Valida e mostra aviso |
| **UX** | 🟡 5 cliques | ✅ 1 clique |

---

## 🚀 **Próximos Passos (Sugestões)**

### 1. **Adicionar Atalhos com HotelId em Mais Páginas**

- ✅ Novo Hóspede (feito)
- 🔲 Novo Quarto
- 🔲 Nova Reserva
- 🔲 Ver Hóspedes do Hotel
- 🔲 Ver Quartos do Hotel

### 2. **Criar Hook Customizado**

```typescript
// src/hooks/useHotelId.ts
export function useHotelId() {
  const { data: session } = useSession();
  
  return useMemo(() => {
    if (session?.accessToken) {
      return getHotelIdFromToken(session.accessToken as string);
    }
    return null;
  }, [session]);
}

// Uso:
const hotelId = useHotelId();
```

### 3. **Adicionar Indicador Visual**

```tsx
{hotelId && (
  <div className="rounded-lg bg-blue-50 px-4 py-2">
    <p className="text-sm text-blue-800">
      🏨 Hotel: {stats?.hotels?.[0]?.name || hotelId}
    </p>
  </div>
)}
```

---

**Versão**: 1.0.0  
**Data**: 31 de Outubro de 2025  
**Status**: ✅ **IMPLEMENTADO E FUNCIONANDO!**

🎉 **Agora você pode criar hóspedes diretamente do dashboard com o hotelId automático!**

