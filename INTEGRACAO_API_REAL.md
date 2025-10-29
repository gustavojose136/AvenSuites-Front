# 🔌 Integração com API Real - AvenSuites v2.0

## ✅ Status da Integração

**Última atualização**: 29 de Outubro de 2025  
**Versão da API**: 2.0.0  
**Status**: ✅ **INTEGRADO E FUNCIONAL**

---

## 📋 Endpoints Integrados

### ✅ 1. Autenticação
- **POST `/api/Auth/login`** - Login com JWT ✅
- **POST `/api/Auth/register`** - Registro de usuário ✅

### ✅ 2. Hotéis
- **GET `/api/Hotel`** - Listar hotéis ✅
- **GET `/api/Hotel/{id}`** - Buscar hotel por ID ✅
- **GET `/api/Hotel/cnpj/{cnpj}`** - Buscar por CNPJ ✅
- **POST `/api/Hotel`** - Criar hotel ✅
- **PUT `/api/Hotel/{id}`** - Atualizar hotel ✅
- **DELETE `/api/Hotel/{id}`** - Deletar hotel ✅

### ✅ 3. Quartos
- **GET `/api/Room`** - Listar quartos ✅
- **GET `/api/Room/{id}`** - Buscar quarto por ID ✅
- **GET `/api/Room/hotel/{hotelId}`** - Quartos por hotel ✅
- **GET `/api/Room/availability`** - Verificar disponibilidade ✅
- **POST `/api/Room`** - Criar quarto ✅
- **PUT `/api/Room/{id}`** - Atualizar quarto ✅
- **DELETE `/api/Room/{id}`** - Deletar quarto ✅

### ✅ 4. Hóspedes
- **GET `/api/Guest`** - Listar hóspedes ✅
- **GET `/api/Guest/{id}`** - Buscar hóspede por ID ✅
- **GET `/api/Guest/hotel/{hotelId}`** - Hóspedes por hotel ✅
- **POST `/api/Guest`** - Criar hóspede ✅
- **PUT `/api/Guest/{id}`** - Atualizar hóspede ✅
- **DELETE `/api/Guest/{id}`** - Deletar hóspede ✅

### ✅ 5. Reservas
- **GET `/api/Booking`** - Listar reservas ✅
- **GET `/api/Booking/{id}`** - Buscar reserva por ID ✅
- **GET `/api/Booking/code/{code}`** - Buscar por código ✅
- **GET `/api/Booking/hotel/{hotelId}`** - Reservas por hotel ✅
- **GET `/api/Booking/guest/{guestId}`** - Reservas por hóspede ✅
- **POST `/api/Booking`** - Criar reserva ✅
- **PUT `/api/Booking/{id}`** - Atualizar reserva ✅
- **POST `/api/Booking/{id}/cancel`** - Cancelar reserva ✅
- **POST `/api/Booking/{id}/confirm`** - Confirmar reserva ✅
- **POST `/api/Booking/{id}/check-in`** - Realizar check-in ✅
- **POST `/api/Booking/{id}/check-out`** - Realizar check-out ✅

### ⚠️ 6. Notas Fiscais (Simulado)
- **GET `/api/Invoice/simple/{roomId}`** - NF-e simplificada 🔄
- **POST `/api/Invoice`** - NF-e completa 🔄
- **POST `/api/Invoice/{hotelId}/cancel`** - Cancelar NF-e 🔄

> **Nota**: As notas fiscais estão sendo **simuladas** com base nas reservas. A integração completa com a API de NF-e será implementada em breve.

---

## 🗂️ Estrutura de Arquivos

```
src/
├── services/
│   └── dashboard.service.ts         ✅ Atualizado para API v2.0
├── infrastructure/
│   └── http/
│       └── HttpClient.ts            ✅ Cliente HTTP com JWT
├── hooks/
│   └── useDashboard.ts              ✅ Hooks para dashboard
├── app/
│   └── (site)/
│       ├── dashboard/
│       │   └── page.tsx             ✅ Dashboard principal
│       └── invoices/
│           └── page.tsx             ✅ Página de notas fiscais
└── utils/
    └── auth.ts                      ✅ NextAuth com API externa
```

---

## 📊 Modelos de Dados

### Hotel
```typescript
interface Hotel {
  id: string;
  name: string;
  legalName?: string;
  cnpj?: string;
  stateRegistration?: string;
  municipalRegistration?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Room
```typescript
interface Room {
  id: string;
  hotelId: string;
  roomNumber: string;
  floor: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'OCCUPIED' | 'CLEANING';
  maxOccupancy: number;
  createdAt: string;
  updatedAt: string;
}
```

### Guest
```typescript
interface Guest {
  id: string;
  hotelId: string;
  fullName: string;
  email: string;
  phone?: string;
  documentNumber?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  postalCode?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Booking
```typescript
interface Booking {
  id: string;
  hotelId: string;
  code: string;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';
  source: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  currency: string;
  totalAmount: number;
  mainGuestId: string;
  channelRef?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  mainGuest?: MainGuest;
  bookingRooms?: BookingRoom[];
  payments?: Payment[];
}
```

---

## 🔐 Autenticação

### Como funciona:

1. **Login** (`POST /api/Auth/login`):
   ```typescript
   // Request
   {
     "email": "gjose2980@gmail.com",
     "password": "SenhaForte@123"
   }
   
   // Response
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "expiresAt": "2025-10-30T10:30:00Z"
   }
   ```

2. **NextAuth** cria a sessão local
3. **HttpClient** adiciona o token automaticamente em todas as requisições:
   ```typescript
   Authorization: Bearer {token}
   ```

### Configuração:

**`.env.local`**:
```bash
NEXT_PUBLIC_API_URL=https://localhost:7000/api
NEXTAUTH_SECRET=seu_secret_aqui
NEXTAUTH_URL=http://localhost:3000
```

---

## 📈 Dashboard

### Estatísticas Calculadas:

O dashboard busca dados de **4 endpoints** principais:
- `GET /api/Hotel` - Lista todos os hotéis
- `GET /api/Room` - Lista todos os quartos
- `GET /api/Guest` - Lista todos os hóspedes
- `GET /api/Booking` - Lista todas as reservas

E calcula:
- ✅ Total de hotéis, quartos, hóspedes e reservas
- ✅ Taxa de ocupação
- ✅ Quartos disponíveis por status
- ✅ Reservas ativas (confirmadas e em andamento)
- ✅ Check-ins e check-outs do dia
- ✅ Receita total e mensal
- ✅ Top 3 hotéis por número de reservas
- ✅ Estatísticas de notas fiscais (simuladas)

### Exemplo de Uso:

```typescript
import { useDashboard } from '@/hooks/useDashboard';

function Dashboard() {
  const { stats, loading, error, refetch } = useDashboard();
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return (
    <div>
      <h1>Total de Hotéis: {stats.totalHotels}</h1>
      <h2>Taxa de Ocupação: {stats.occupancyRate}%</h2>
      {/* ... */}
    </div>
  );
}
```

---

## 🔍 Filtragem por Hotel

O sistema suporta filtragem por hotel para usuários com role `Hotel-Admin`:

```typescript
// Buscar quartos de um hotel específico
const rooms = await dashboardService.getRooms('hotel-id-here');

// Buscar hóspedes de um hotel específico
const guests = await dashboardService.getGuests('hotel-id-here');

// Buscar reservas de um hotel específico
const bookings = await dashboardService.getBookings('hotel-id-here');
```

A API automaticamente filtra os dados com base no role do usuário autenticado:
- **Admin**: Vê todos os hotéis
- **Hotel-Admin**: Vê apenas o próprio hotel

---

## 🧪 Como Testar

### 1. Verificar Conexão com a API:

```bash
curl -X POST https://localhost:7000/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gjose2980@gmail.com",
    "password": "SenhaForte@123"
  }'
```

### 2. Acessar Dashboard:

1. Acesse `http://localhost:3000/signin`
2. Faça login com suas credenciais
3. Será redirecionado para `/dashboard`
4. Verifique os dados carregando corretamente

### 3. Verificar Console:

O sistema exibe logs detalhados no console:

```
📊 ============================================
📊 BUSCANDO DADOS DO DASHBOARD
📊 ============================================
🏨 Buscando hotéis...
✅ 5 hotéis encontrados
🛏️  Buscando quartos...
✅ 45 quartos encontrados
👥 Buscando hóspedes...
✅ 120 hóspedes encontrados
📅 Buscando reservas...
✅ 89 reservas encontradas

📊 RESUMO DOS DADOS:
🏨 Hotéis: 5
🛏️  Quartos: 45
👥 Hóspedes: 120
📅 Reservas: 89
📊 ============================================
```

---

## 🐛 Troubleshooting

### Erro 401 (Unauthorized)
**Causa**: Token JWT inválido ou expirado  
**Solução**: Faça logout e login novamente

### Erro 404 (Not Found)
**Causa**: Endpoint não existe na API  
**Solução**: Verifique se a API está rodando e a URL está correta

### Erro de CORS
**Causa**: API não permite requisições do frontend  
**Solução**: Configure CORS no backend:
```csharp
builder.Services.AddCors(options => {
  options.AddPolicy("AllowFrontend", policy => {
    policy.WithOrigins("http://localhost:3000")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
  });
});
```

### Certificado SSL inválido (desenvolvimento)
**Causa**: HTTPS com certificado auto-assinado  
**Solução**: Já configurado no `auth.ts` com `rejectUnauthorized: false`

---

## 📝 Próximos Passos

### Fase 1 - Melhorias Imediatas:
- [ ] Implementar paginação nos listagens
- [ ] Adicionar filtros avançados (data, status, etc)
- [ ] Implementar busca por texto
- [ ] Adicionar ordenação de colunas

### Fase 2 - Notas Fiscais:
- [ ] Integrar com endpoint real de NF-e
- [ ] Implementar geração de NF-e simplificada
- [ ] Implementar geração de NF-e completa
- [ ] Adicionar cancelamento de NF-e
- [ ] Adicionar consulta de NF-e

### Fase 3 - Funcionalidades Avançadas:
- [ ] Implementar CRUD completo para hotéis
- [ ] Implementar CRUD completo para quartos
- [ ] Implementar CRUD completo para hóspedes
- [ ] Implementar criação de reservas
- [ ] Implementar edição de reservas
- [ ] Adicionar upload de imagens
- [ ] Implementar notificações em tempo real

---

## 🤝 Contribuindo

Para adicionar novos endpoints:

1. **Atualizar o serviço** (`dashboard.service.ts`):
   ```typescript
   async getNewData(): Promise<NewDataType[]> {
     return await httpClient.get<NewDataType[]>('/NewEndpoint');
   }
   ```

2. **Criar hook** (se necessário):
   ```typescript
   export function useNewData() {
     const [data, setData] = useState<NewDataType[]>([]);
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       dashboardService.getNewData()
         .then(setData)
         .finally(() => setLoading(false));
     }, []);
     
     return { data, loading };
   }
   ```

3. **Usar no componente**:
   ```typescript
   function MyComponent() {
     const { data, loading } = useNewData();
     // ...
   }
   ```

---

## 📞 Suporte

- **Documentação da API**: `ENDPOINTS_BACKEND_NECESSARIOS.md`
- **Documentação do Frontend**: `README_FRONTEND.md`
- **Exemplos de Uso**: `EXEMPLOS_USO.md`

---

**Versão**: 2.0.0  
**Data**: 29 de Outubro de 2025  
**Status**: ✅ Integrado e Funcional

