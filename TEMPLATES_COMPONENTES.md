# 📋 Templates de Componentes Restantes

## ✅ O Que Já Foi Criado

### Hooks ✅
- `useAuth.ts` ✅
- `useHotel.ts` ✅
- `useRoom.ts` ✅
- `useBooking.ts` ✅
- `useGuest.ts` ✅

### Componentes
- `HotelList.tsx` ✅

## 📝 Templates para Criar

### 1. Formulário de Hotel
**Arquivo**: `src/presentation/components/Hotel/HotelForm.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import { HotelCreateRequest } from '@/application/dto/Hotel.dto';

interface HotelFormProps {
  onSubmit: (data: HotelCreateRequest) => Promise<void>;
  initialData?: Partial<HotelCreateRequest>;
}

export const HotelForm: React.FC<HotelFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<HotelCreateRequest>({
    name: initialData?.name || '',
    tradeName: initialData?.tradeName || '',
    cnpj: initialData?.cnpj || '',
    email: initialData?.email || '',
    phoneE164: initialData?.phoneE164 || '',
    timezone: initialData?.timezone || 'America/Sao_Paulo',
    addressLine1: initialData?.addressLine1 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postalCode || '',
    countryCode: initialData?.countryCode || 'BR',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Implementar campos do formulário */}
    </form>
  );
};
```

### 2. Lista de Quartos
**Arquivo**: `src/presentation/components/Room/RoomList.tsx`

```typescript
'use client';

import React, { useEffect } from 'react';
import { useRoom } from '@/presentation/hooks/useRoom';
import { container } from '@/shared/di/Container';

export const RoomList: React.FC<{ hotelId: string }> = ({ hotelId }) => {
  const { rooms, loading, error, fetchRoomsByHotel } = useRoom(container.getRoomService());

  useEffect(() => {
    fetchRoomsByHotel(hotelId);
  }, [hotelId, fetchRoomsByHotel]);

  // Implementar renderização
};
```

### 3. Lista de Reservas
**Arquivo**: `src/presentation/components/Booking/BookingList.tsx`

```typescript
'use client';

import React, { useEffect } from 'react';
import { useBooking } from '@/presentation/hooks/useBooking';
import { container } from '@/shared/di/Container';

export const BookingList: React.FC<{ hotelId?: string }> = ({ hotelId }) => {
  const { bookings, loading, error, fetchBookings, fetchBookingsByHotel } = 
    useBooking(container.getBookingService());

  useEffect(() => {
    if (hotelId) {
      fetchBookingsByHotel(hotelId);
    } else {
      fetchBookings();
    }
  }, [hotelId]);

  // Implementar renderização com status badges
};
```

### 4. Card de Reserva
**Arquivo**: `src/presentation/components/Booking/BookingCard.tsx`

```typescript
'use client';

import React from 'react';
import { Booking } from '@/application/dto/Booking.dto';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  onConfirm?: (id: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel, onConfirm }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm">
      {/* Implementar card com informações da reserva */}
    </div>
  );
};
```

## 🛣️ Páginas para Criar

### 1. Dashboard
**Arquivo**: `src/app/dashboard/page.tsx`

```typescript
import { HotelList } from '@/presentation/components/Hotel/HotelList';
import { BookingList } from '@/presentation/components/Booking/BookingList';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Cards com métricas */}
      </div>

      {/* Reservas recentes */}
      <BookingList />
    </div>
  );
}
```

### 2. Página de Hotéis
**Arquivo**: `src/app/hotels/page.tsx`

```typescript
import { HotelList } from '@/presentation/components/Hotel/HotelList';

export default function HotelsPage() {
  return (
    <div className="container mx-auto p-6">
      <HotelList />
    </div>
  );
}
```

### 3. Detalhes do Hotel
**Arquivo**: `src/app/hotels/[id]/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useHotel } from '@/presentation/hooks/useHotel';
import { container } from '@/shared/di/Container';
import { RoomList } from '@/presentation/components/Room/RoomList';

export default function HotelDetailPage({ params }: { params: { id: string } }) {
  const { selectedHotel, loading, fetchHotelById } = useHotel(container.getHotelService());

  useEffect(() => {
    fetchHotelById(params.id);
  }, [params.id]);

  return (
    <div className="container mx-auto p-6">
      {/* Detalhes do hotel + lista de quartos */}
    </div>
  );
}
```

### 4. Nova Reserva
**Arquivo**: `src/app/bookings/new/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/presentation/hooks/useBooking';
import { container } from '@/shared/di/Container';
import { BookingCreateRequest } from '@/application/dto/Booking.dto';

export default function NewBookingPage() {
  const router = useRouter();
  const { createBooking, loading } = useBooking(container.getBookingService());

  const handleSubmit = async (data: BookingCreateRequest) => {
    try {
      await createBooking(data);
      router.push('/bookings');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Formulário de reserva */}
    </div>
  );
}
```

## 🧭 Atualizar Navegação

**Arquivo**: `src/components/Header/menuData.tsx`

```typescript
import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Dashboard",
    path: "/dashboard",
    newTab: false,
  },
  {
    id: 2,
    title: "Hotéis",
    path: "/hotels",
    newTab: false,
  },
  {
    id: 3,
    title: "Quartos",
    path: "/rooms",
    newTab: false,
  },
  {
    id: 4,
    title: "Reservas",
    path: "/bookings",
    newTab: false,
  },
  {
    id: 5,
    title: "Hóspedes",
    path: "/guests",
    newTab: false,
  },
];

export default menuData;
```

## 🎨 Componentes de UI Comuns

### Loading Spinner
**Arquivo**: `src/presentation/components/common/LoadingSpinner.tsx`

```typescript
export const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);
```

### Error Message
**Arquivo**: `src/presentation/components/common/ErrorMessage.tsx`

```typescript
interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
    <p className="text-red-800 dark:text-red-200">{message}</p>
  </div>
);
```

### Empty State
**Arquivo**: `src/presentation/components/common/EmptyState.tsx`

```typescript
interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, actionLabel, onAction }) => (
  <div className="rounded-lg border border-stroke bg-white p-8 text-center">
    <p className="text-body-color mb-4">{message}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn-primary">
        {actionLabel}
      </button>
    )}
  </div>
);
```

## ✅ Checklist Final

- [ ] Criar componentes de formulário
- [ ] Criar páginas de listagem
- [ ] Criar páginas de detalhes
- [ ] Criar páginas de criação/edição
- [ ] Atualizar menu de navegação
- [ ] Implementar breadcrumbs
- [ ] Adicionar validação de formulários
- [ ] Implementar filtros e busca
- [ ] Adicionar paginação
- [ ] Implementar toasts/notificações
- [ ] Adicionar confirmações de ação
- [ ] Implementar loading states
- [ ] Adicionar error boundaries
- [ ] Testar responsividade
- [ ] Implementar testes unitários

## 🚀 Comandos Úteis

```bash
# Verificar tipos
npx tsc --noEmit

# Verificar lint
npm run lint

# Build production
npm run build

# Rodar dev
npm run dev
```

