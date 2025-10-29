# 🚀 Próximos Passos - AvenSuites Frontend

## ✅ Estrutura Criada

### 1. **Domain Layer** ✅
- `entities/User.ts` - Entidade User
- `repositories/IAuthRepository.ts` - Interface de repositório
- `services/IAuthService.ts` - Serviço de autenticação

### 2. **Infrastructure Layer** ✅
- `http/HttpClient.ts` - Cliente HTTP centralizado com SSL
- `api/repositories/AuthRepository.ts` - Implementação de repositório

### 3. **Application Layer** ✅ (Iniciado)
- `dto/Hotel.dto.ts` ✅
- `dto/Room.dto.ts` ✅
- `dto/Booking.dto.ts` ✅
- `dto/Guest.dto.ts` ✅

### 4. **Presentation Layer** ✅
- `hooks/useAuth.ts` - Hook de autenticação
- `contexts/AuthContext.tsx` - Context de auth

### 5. **Shared** ✅
- `di/Container.ts` - Container de injeção de dependências

## 📝 O Que Precisa Ser Criado

### 1. Completar Application Layer
```
src/application/
├── dto/
│   ├── Invoice.dto.ts       ⏳
│   └── index.ts             ⏳ (exports)
├── repositories/
│   ├── IHotelRepository.ts  ⏳
│   ├── IRoomRepository.ts   ⏳
│   ├── IBookingRepository.ts ⏳
│   └── IGuestRepository.ts  ⏳
└── services/
    ├── HotelService.ts       ⏳
    ├── RoomService.ts        ⏳
    ├── BookingService.ts     ⏳
    └── GuestService.ts       ⏳
```

### 2. Completar Infrastructure Layer
```
src/infrastructure/api/repositories/
├── HotelRepository.ts    ⏳
├── RoomRepository.ts     ⏳
├── BookingRepository.ts  ⏳
└── GuestRepository.ts    ⏳
```

### 3. Criar Presentation Layer (UI)
```
src/presentation/
├── components/
│   ├── Hotel/
│   │   ├── HotelList.tsx      ⏳
│   │   ├── HotelForm.tsx      ⏳
│   │   └── HotelCard.tsx      ⏳
│   ├── Room/
│   │   ├── RoomList.tsx       ⏳
│   │   ├── RoomForm.tsx       ⏳
│   │   └── AvailabilityCalendar.tsx ⏳
│   ├── Booking/
│   │   ├── BookingList.tsx    ⏳
│   │   ├── BookingForm.tsx    ⏳
│   │   └── BookingCard.tsx    ⏳
│   └── Guest/
│       ├── GuestList.tsx      ⏳
│       └── GuestForm.tsx      ⏳
└── pages/
    ├── dashboard/
    ├── hotels/
    ├── rooms/
    ├── bookings/
    └── guests/
```

### 4. Criar Rotas
```
src/app/
├── dashboard/
├── hotels/
├── rooms/
├── bookings/
└── guests/
```

### 5. Atualizar Container de DI
Adicionar ao `Container.ts`:
- HotelService
- RoomService
- BookingService
- GuestService

## 🎯 Ordem de Implementação Sugerida

1. **Completar DTOs e Interfaces** (Domain & Application)
2. **Implementar Repositories** (Infrastructure)
3. **Implementar Services** (Application)
4. **Criar Components** (Presentation)
5. **Criar Pages/Routes** (Navigation)
6. **Integrar Contexts** (State Management)
7. **Testes e Validações**

## 📚 Padrões a Seguir

### Repository Pattern
```typescript
export interface IHotelRepository {
  getAll(): Promise<Hotel[]>;
  getById(id: string): Promise<Hotel | null>;
  create(data: HotelCreateRequest): Promise<Hotel>;
  update(id: string, data: HotelUpdateRequest): Promise<Hotel>;
  delete(id: string): Promise<boolean>;
}
```

### Service Pattern
```typescript
export interface IHotelService {
  getHotels(): Promise<Hotel[]>;
  getHotel(id: string): Promise<Hotel>;
  createHotel(data: HotelCreateRequest): Promise<Hotel>;
  updateHotel(id: string, data: HotelUpdateRequest): Promise<Hotel>;
  deleteHotel(id: string): Promise<void>;
}
```

### Hook Pattern
```typescript
export const useHotel = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // CRUD operations
};
```

## 🔧 Configuração Necessária

1. Atualizar `.env.local` com URL correta da API
2. Configurar rotas no Next.js
3. Ajustar menu/navegação para incluir novos módulos
4. Criar layouts específicos se necessário

## 🎨 Componentes de UI Sugeridos

### Dashboard
- Métricas de ocupação
- Gráficos de receita
- Reservas recentes
- Alertas e notificações

### List Views
- Filtros avançados
- Ordenação
- Paginação
- Ações em lote

### Form Views
- Validação de campos
- Feedback visual
- Auto-save (opcional)

## 📱 Responsividade

Todos os componentes devem ser:
- Responsivos (mobile-first)
- Acessíveis (WCAG)
- Performáticos (lazy loading)
- Otimizados para SEO

