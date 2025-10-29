# 🚀 Guia de Continuação - AvenSuites Frontend

## ✅ O QUE FOI IMPLEMENTADO

### 1. Arquitetura Completa ✅
- **Domain Layer**: Entities, Repositories, Services
- **Application Layer**: DTOs completos
- **Infrastructure Layer**: HttpClient, Repositories implementados
- **Presentation Layer**: Hooks, Components
- **Shared**: Dependency Injection Container

### 2. Hooks Personalizados ✅
- `useAuth.ts` - Autenticação
- `useHotel.ts` - Gestão de hotéis
- `useRoom.ts` - Gestão de quartos
- `useBooking.ts` - Gestão de reservas
- `useGuest.ts` - Gestão de hóspedes

### 3. Componentes Visuais ✅
**Hotel:**
- `HotelList.tsx` - Lista de hotéis com cards

**Room:**
- `RoomList.tsx` - Lista de quartos com filtros

**Booking:**
- `BookingCard.tsx` - Card individual de reserva
- `BookingList.tsx` - Lista de reservas

**Comuns:**
- `LoadingSpinner.tsx` - Spinner de carregamento
- `ErrorMessage.tsx` - Mensagem de erro
- `EmptyState.tsx` - Estado vazio

### 4. Páginas/Rotas ✅
- `/hotels` - Lista de hotéis
- `/hotels/[id]` - Detalhes do hotel + quartos
- `/rooms` - Página de quartos
- `/bookings` - Lista de reservas
- `/guests` - Lista de hóspedes

### 5. Navegação ✅
- Menu atualizado com links para todos os módulos
- Breadcrumbs implementados

## 📝 O QUE AINDA PRECISA SER FEITO

### 1. Formulários (Alta Prioridade)

#### HotelForm.tsx
```typescript
// src/presentation/components/Hotel/HotelForm.tsx
// Criar formulário completo com validação
// Campos: name, tradeName, cnpj, email, phone, address, etc.
```

#### RoomForm.tsx
```typescript
// src/presentation/components/Room/RoomForm.tsx
// Criar formulário para adicionar/editar quartos
// Campos: roomNumber, floor, status, maxOccupancy, bedType, etc.
```

#### BookingForm.tsx
```typescript
// src/presentation/components/Booking/BookingForm.tsx
// Criar formulário de reserva com seleção de datas
// Integrar com verificação de disponibilidade
// Campos: hotelId, checkIn, checkOut, guests, rooms, etc.
```

#### GuestForm.tsx
```typescript
// src/presentation/components/Guest/GuestForm.tsx
// Criar formulário de hóspede
// Campos: name, email, phone, document, etc.
```

### 2. Páginas de Criação/Edição

```
src/app/(site)/
├── hotels/
│   ├── new/
│   │   └── page.tsx (formulário de novo hotel)
│   └── [id]/
│       └── edit/
│           └── page.tsx (editar hotel)
├── rooms/
│   ├── new/
│   │   └── page.tsx (novo quarto - requer hotelId)
│   └── [id]/
│       ├── page.tsx (detalhes do quarto)
│       └── edit/
│           └── page.tsx (editar quarto)
├── bookings/
│   ├── new/
│   │   └── page.tsx (nova reserva)
│   └── [id]/
│       ├── page.tsx (detalhes da reserva)
│       └── edit/
│           └── page.tsx (editar reserva)
└── guests/
    ├── new/
    │   └── page.tsx (novo hóspede)
    └── [id]/
        ├── page.tsx (detalhes do hóspede)
        └── edit/
            └── page.tsx (editar hóspede)
```

### 3. Dashboard com KPIs

```typescript
// src/app/(site)/dashboard/page.tsx
// Implementar dashboard com:
// - Total de hotéis ativos
// - Taxa de ocupação
// - Reservas do mês
// - Receita total
// - Gráficos (Chart.js ou Recharts)
```

### 4. Componentes Avançados

#### AvailabilityCalendar.tsx
```typescript
// src/presentation/components/Room/AvailabilityCalendar.tsx
// Calendário visual de disponibilidade
// Usar biblioteca como react-big-calendar ou date-fns
```

#### GuestList.tsx
```typescript
// src/presentation/components/Guest/GuestList.tsx
// Lista de hóspedes com busca e filtros
```

#### InvoiceList.tsx
```typescript
// src/presentation/components/Invoice/InvoiceList.tsx
// Lista de notas fiscais (se necessário)
```

### 5. Validação de Formulários

```bash
npm install react-hook-form zod @hookform/resolvers
```

```typescript
// src/shared/validators/hotelSchema.ts
import { z } from 'zod';

export const hotelSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido'),
  email: z.string().email('E-mail inválido'),
  // ...
});
```

### 6. Notificações/Toasts

```bash
npm install react-hot-toast
```

```typescript
// src/shared/hooks/useToast.ts
import toast from 'react-hot-toast';

export const useToast = () => ({
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  loading: (msg: string) => toast.loading(msg),
});
```

### 7. Paginação

```typescript
// src/shared/hooks/usePagination.ts
export const usePagination = (items: any[], itemsPerPage = 10) => {
  // Implementar lógica de paginação
};
```

### 8. Filtros e Busca

```typescript
// src/presentation/components/common/SearchBar.tsx
// Barra de busca reutilizável

// src/presentation/components/common/FilterBar.tsx
// Filtros por status, data, etc.
```

### 9. Proteção de Rotas

```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/signin',
  },
});

export const config = {
  matcher: ['/hotels/:path*', '/rooms/:path*', '/bookings/:path*', '/guests/:path*'],
};
```

### 10. Testes

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

```typescript
// src/presentation/hooks/__tests__/useHotel.test.ts
// Testes unitários para hooks

// src/presentation/components/__tests__/HotelList.test.tsx
// Testes de componentes
```

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS (Ordem de Prioridade)

1. **Criar formulários** (HotelForm, RoomForm, BookingForm, GuestForm)
2. **Criar páginas de novo/edição** para cada módulo
3. **Implementar validação** com react-hook-form + zod
4. **Adicionar notificações** com react-hot-toast
5. **Implementar dashboard** com KPIs
6. **Adicionar busca e filtros** nas listas
7. **Implementar paginação** nas listas
8. **Adicionar calendário de disponibilidade**
9. **Proteger rotas** com middleware
10. **Adicionar testes unitários**

## 🔧 COMANDOS ÚTEIS

```bash
# Instalar dependências de formulários
npm install react-hook-form zod @hookform/resolvers

# Instalar toasts
npm install react-hot-toast

# Instalar calendário (opcional)
npm install react-big-calendar date-fns

# Instalar gráficos (opcional)
npm install recharts

# Verificar tipos
npx tsc --noEmit

# Verificar lint
npm run lint

# Build
npm run build

# Dev
npm run dev
```

## 📚 ESTRUTURA FINAL DO PROJETO

```
src/
├── domain/                         ✅ COMPLETO
│   ├── entities/
│   ├── repositories/
│   └── services/
│
├── application/                    ✅ COMPLETO
│   └── dto/
│
├── infrastructure/                 ✅ COMPLETO
│   ├── http/
│   └── api/repositories/
│
├── presentation/                   ⏳ 70% COMPLETO
│   ├── hooks/                      ✅ 5/5 hooks
│   ├── contexts/                   ✅ 1 context
│   ├── components/
│   │   ├── Hotel/                  ⏳ 1/3 (falta Form, Card)
│   │   ├── Room/                   ⏳ 1/3 (falta Form, Calendar)
│   │   ├── Booking/                ✅ 2/3 (falta Form)
│   │   ├── Guest/                  ❌ 0/2 (falta List, Form)
│   │   └── common/                 ✅ 3/3
│   │
│   └── pages/                      ⏳ 40% COMPLETO
│       ├── hotels/                 ✅ list, details
│       ├── rooms/                  ✅ list
│       ├── bookings/               ✅ list
│       └── guests/                 ✅ list
│
└── shared/                         ✅ COMPLETO
    ├── di/
    ├── constants/
    └── validators/                 ❌ TODO
```

## 🎨 EXEMPLO DE FORMULÁRIO COMPLETO

```typescript
// src/presentation/components/Hotel/HotelForm.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HotelCreateRequest } from '@/application/dto/Hotel.dto';

const hotelSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  tradeName: z.string().optional(),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve ter 14 dígitos'),
  email: z.string().email('E-mail inválido'),
  phoneE164: z.string().min(10, 'Telefone inválido'),
  timezone: z.string(),
  addressLine1: z.string().min(5, 'Endereço obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'UF deve ter 2 letras'),
  postalCode: z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos'),
  countryCode: z.string().default('BR'),
});

interface HotelFormProps {
  onSubmit: (data: HotelCreateRequest) => Promise<void>;
  initialData?: Partial<HotelCreateRequest>;
  loading?: boolean;
}

export const HotelForm: React.FC<HotelFormProps> = ({ 
  onSubmit, 
  initialData,
  loading = false 
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<HotelCreateRequest>({
    resolver: zodResolver(hotelSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Implementar campos */}
      <div>
        <label className="block mb-2 text-sm font-medium">Nome do Hotel</label>
        <input
          {...register('name')}
          className="w-full rounded-lg border border-stroke p-3"
          disabled={loading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Mais campos... */}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar Hotel'}
      </button>
    </form>
  );
};
```

## ✨ RECURSOS ADICIONAIS

### Bibliotecas Úteis
- **react-hook-form**: Formulários otimizados
- **zod**: Validação de schemas
- **react-hot-toast**: Notificações elegantes
- **date-fns**: Manipulação de datas
- **react-big-calendar**: Calendário visual
- **recharts**: Gráficos para dashboard

### Padrões de Código
- Sempre usar `'use client'` em componentes interativos
- Importar serviços via `container.getService()`
- Usar hooks customizados para lógica de negócio
- Componentes de apresentação devem ser puros quando possível
- Validar dados com Zod antes de enviar para API

---

**Status Atual**: Arquitetura completa, componentes básicos prontos, pronto para formulários e páginas avançadas.

**Progresso Geral**: ~70% completo

