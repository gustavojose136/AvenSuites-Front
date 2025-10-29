# 🏨 AvenSuites Frontend

## 📋 Sobre o Projeto

Frontend do sistema AvenSuites, uma plataforma unificada para gestão hoteleira que centraliza reservas, quartos, hóspedes e faturamento.

**Tecnologias:**
- Next.js 14 (App Router)
- TypeScript
- NextAuth.js (Autenticação)
- Tailwind CSS
- Axios (HTTP Client)

**Arquitetura:**
- Clean Architecture
- SOLID Principles
- Dependency Injection
- Repository Pattern
- Service Layer

---

## 🎯 Funcionalidades Implementadas

### ✅ Módulo de Autenticação
- Login com NextAuth
- Integração com API externa (.NET)
- Suporte a SSL auto-assinado
- Gestão de tokens JWT
- Roles de usuário

### ✅ Módulo de Hotéis
- ✅ Listagem de hotéis
- ✅ Detalhes do hotel
- ✅ Exclusão de hotel
- ⏳ Formulário de criação (template disponível)
- ⏳ Formulário de edição (template disponível)

### ✅ Módulo de Quartos
- ✅ Listagem de quartos por hotel
- ✅ Status visual (Disponível, Ocupado, Manutenção)
- ✅ Exclusão de quarto
- ⏳ Formulário de criação (template disponível)
- ⏳ Verificação de disponibilidade (serviço pronto)

### ✅ Módulo de Reservas
- ✅ Listagem de reservas
- ✅ Cards com status visual
- ✅ Confirmação de reserva
- ✅ Cancelamento de reserva
- ⏳ Formulário de nova reserva (template disponível)
- ⏳ Detalhes da reserva (rota criada)

### ✅ Módulo de Hóspedes
- ✅ Serviços e repositórios implementados
- ⏳ Listagem (template disponível)
- ⏳ Formulário CRUD (template disponível)

---

## 📁 Estrutura do Projeto

```
src/
├── domain/                          # Camada de Domínio
│   ├── entities/                    # Entidades de negócio
│   │   └── User.ts
│   ├── repositories/                # Interfaces de repositórios
│   │   ├── IAuthRepository.ts
│   │   ├── IHotelRepository.ts
│   │   ├── IRoomRepository.ts
│   │   ├── IBookingRepository.ts
│   │   └── IGuestRepository.ts
│   └── services/                    # Interfaces e serviços
│       ├── IAuthService.ts
│       ├── IHotelService.ts
│       ├── IRoomService.ts
│       ├── IBookingService.ts
│       └── IGuestService.ts
│
├── application/                     # Camada de Aplicação
│   └── dto/                         # Data Transfer Objects
│       ├── Hotel.dto.ts
│       ├── Room.dto.ts
│       ├── Booking.dto.ts
│       └── Guest.dto.ts
│
├── infrastructure/                  # Camada de Infraestrutura
│   ├── http/
│   │   └── HttpClient.ts           # Cliente HTTP configurado
│   └── api/repositories/           # Implementações de repositórios
│       ├── AuthRepository.ts
│       ├── HotelRepository.ts
│       ├── RoomRepository.ts
│       ├── BookingRepository.ts
│       └── GuestRepository.ts
│
├── presentation/                    # Camada de Apresentação
│   ├── hooks/                       # Hooks customizados
│   │   ├── useAuth.ts
│   │   ├── useHotel.ts
│   │   ├── useRoom.ts
│   │   ├── useBooking.ts
│   │   └── useGuest.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── components/
│       ├── Hotel/
│       │   └── HotelList.tsx
│       ├── Room/
│       │   └── RoomList.tsx
│       ├── Booking/
│       │   ├── BookingCard.tsx
│       │   └── BookingList.tsx
│       └── common/
│           ├── LoadingSpinner.tsx
│           ├── ErrorMessage.tsx
│           └── EmptyState.tsx
│
├── shared/                          # Camada Compartilhada
│   └── di/
│       └── Container.ts            # Injeção de Dependências
│
└── app/                            # Rotas Next.js
    └── (site)/
        ├── hotels/
        │   ├── page.tsx
        │   └── [id]/page.tsx
        ├── rooms/
        │   └── page.tsx
        ├── bookings/
        │   └── page.tsx
        └── guests/
            └── page.tsx
```

---

## 🚀 Como Usar

### 1. Configuração Inicial

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
```

### 2. Variáveis de Ambiente

```env
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL=postgresql://user:pass@localhost:5432/db
NEXT_PUBLIC_API_URL=https://localhost:7000/api/
```

### 3. Executar

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start
```

---

## 💡 Como Usar os Serviços

### Exemplo 1: Usando um Hook

```typescript
'use client';

import { useEffect } from 'react';
import { useHotel } from '@/presentation/hooks/useHotel';
import { container } from '@/shared/di/Container';

export function MyComponent() {
  const { hotels, loading, error, fetchHotels } = useHotel(
    container.getHotelService()
  );

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {hotels.map(hotel => (
        <div key={hotel.id}>{hotel.name}</div>
      ))}
    </div>
  );
}
```

### Exemplo 2: Usando Serviço Diretamente

```typescript
import { container } from '@/shared/di/Container';

// Em qualquer lugar do código
const hotelService = container.getHotelService();
const hotels = await hotelService.getHotels();
```

### Exemplo 3: Criando um Hotel

```typescript
import { container } from '@/shared/di/Container';
import { HotelCreateRequest } from '@/application/dto/Hotel.dto';

const hotelService = container.getHotelService();

const newHotel: HotelCreateRequest = {
  name: 'Hotel Exemplo',
  cnpj: '12345678000100',
  email: 'contato@hotel.com',
  phoneE164: '+5511999999999',
  timezone: 'America/Sao_Paulo',
  addressLine1: 'Rua Exemplo, 123',
  city: 'São Paulo',
  state: 'SP',
  postalCode: '01234567',
  countryCode: 'BR',
};

const hotel = await hotelService.createHotel(newHotel);
```

---

## 🧩 Princípios SOLID Aplicados

### 1. Single Responsibility (SRP)
- Cada classe/componente tem uma única responsabilidade
- Hooks focados em uma funcionalidade
- Serviços específicos por módulo

### 2. Open/Closed (OCP)
- Interfaces permitem extensão sem modificação
- Novos repositórios podem ser adicionados facilmente

### 3. Liskov Substitution (LSP)
- Implementações são intercambiáveis
- Qualquer `IHotelRepository` funciona onde esperado

### 4. Interface Segregation (ISP)
- Interfaces específicas e coesas
- Nenhuma dependência de métodos desnecessários

### 5. Dependency Inversion (DIP)
- Dependências de abstrações (interfaces)
- Container gerencia todas as injeções

---

## 📦 Serviços Disponíveis

### AuthService
```typescript
interface IAuthService {
  login(email: string, password: string): Promise<LoginResponse>;
}
```

### HotelService
```typescript
interface IHotelService {
  getHotels(): Promise<Hotel[]>;
  getHotel(id: string): Promise<Hotel>;
  createHotel(data: HotelCreateRequest): Promise<Hotel>;
  updateHotel(id: string, data: HotelUpdateRequest): Promise<Hotel>;
  deleteHotel(id: string): Promise<void>;
}
```

### RoomService
```typescript
interface IRoomService {
  getRooms(): Promise<Room[]>;
  getRoom(id: string): Promise<Room>;
  getRoomsByHotel(hotelId: string, status?: string): Promise<Room[]>;
  checkAvailability(request: RoomAvailabilityRequest): Promise<RoomAvailabilityResponse[]>;
  createRoom(data: RoomCreateRequest): Promise<Room>;
  updateRoom(id: string, data: RoomUpdateRequest): Promise<Room>;
  deleteRoom(id: string): Promise<void>;
}
```

### BookingService
```typescript
interface IBookingService {
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking>;
  getBookingByCode(hotelId: string, code: string): Promise<Booking>;
  getBookingsByHotel(hotelId: string, startDate?: string, endDate?: string): Promise<Booking[]>;
  getBookingsByGuest(guestId: string): Promise<Booking[]>;
  createBooking(data: BookingCreateRequest): Promise<Booking>;
  updateBooking(id: string, data: BookingUpdateRequest): Promise<Booking>;
  cancelBooking(id: string, reason?: string): Promise<void>;
  confirmBooking(id: string): Promise<void>;
}
```

### GuestService
```typescript
interface IGuestService {
  getGuests(): Promise<Guest[]>;
  getGuest(id: string): Promise<Guest>;
  getGuestsByHotel(hotelId: string): Promise<Guest[]>;
  createGuest(data: GuestCreateRequest): Promise<Guest>;
  updateGuest(id: string, data: GuestUpdateRequest): Promise<Guest>;
  deleteGuest(id: string): Promise<void>;
}
```

---

## 📚 Documentação Adicional

- **CLEAN_ARCHITECTURE.md** - Visão geral da arquitetura limpa
- **ARQUITETURA_IMPLEMENTADA.md** - Detalhes da implementação
- **INTEGRACAO_API.md** - Guia de integração com a API
- **TEMPLATES_COMPONENTES.md** - Templates para novos componentes
- **GUIA_CONTINUACAO.md** - Próximos passos e pendências
- **RESUMO_IMPLEMENTACAO.md** - Resumo executivo

---

## ✅ Checklist de Implementação

- [x] Arquitetura Clean com SOLID
- [x] DTOs completos para todos os módulos
- [x] Repositórios implementados
- [x] Serviços de domínio
- [x] Hooks customizados
- [x] Dependency Injection Container
- [x] Componentes de lista (Hotel, Room, Booking)
- [x] Rotas principais
- [x] Navegação atualizada
- [x] Componentes comuns (Loading, Error, Empty)
- [x] Integração com API externa
- [x] Autenticação com NextAuth
- [ ] Formulários de criação/edição
- [ ] Validação com Zod
- [ ] Notificações (Toasts)
- [ ] Dashboard com KPIs
- [ ] Filtros e busca
- [ ] Paginação
- [ ] Calendário de disponibilidade
- [ ] Proteção de rotas
- [ ] Testes unitários

---

## 🎨 Próximas Features

1. **Formulários Completos** - Criar/editar todos os módulos
2. **Dashboard** - KPIs e gráficos
3. **Filtros Avançados** - Busca e filtros em todas as listas
4. **Calendário** - Visualização de disponibilidade
5. **Notificações** - Sistema de toasts
6. **Validação** - Schemas Zod completos
7. **Testes** - Cobertura de testes unitários

---

## 👥 Contribuindo

Este projeto segue Clean Architecture e SOLID. Ao adicionar novos módulos:

1. Crie a interface do repositório em `domain/repositories`
2. Crie a interface do serviço em `domain/services`
3. Crie os DTOs em `application/dto`
4. Implemente o repositório em `infrastructure/api/repositories`
5. Crie o hook em `presentation/hooks`
6. Crie os componentes em `presentation/components`
7. Registre no Container em `shared/di/Container`

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com Clean Architecture + SOLID para máxima manutenibilidade e escalabilidade** 🚀

