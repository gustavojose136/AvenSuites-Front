# 📘 Exemplos Práticos de Uso - AvenSuites Frontend

## 🎯 Como Usar a Arquitetura Implementada

---

## 1. 🏨 Trabalhando com Hotéis

### Listar Todos os Hotéis

```typescript
'use client';

import { useEffect } from 'react';
import { useHotel } from '@/presentation/hooks/useHotel';
import { container } from '@/shared/di/Container';

export default function HotelsPage() {
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
      <h1>Hotéis ({hotels.length})</h1>
      {hotels.map(hotel => (
        <div key={hotel.id}>
          <h2>{hotel.name}</h2>
          <p>{hotel.city} - {hotel.state}</p>
        </div>
      ))}
    </div>
  );
}
```

### Criar um Novo Hotel

```typescript
'use client';

import { useState } from 'react';
import { useHotel } from '@/presentation/hooks/useHotel';
import { container } from '@/shared/di/Container';
import { HotelCreateRequest } from '@/application/dto/Hotel.dto';

export default function NewHotelPage() {
  const { createHotel, loading } = useHotel(container.getHotelService());
  const [formData, setFormData] = useState<HotelCreateRequest>({
    name: '',
    cnpj: '',
    email: '',
    phoneE164: '',
    timezone: 'America/Sao_Paulo',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    countryCode: 'BR',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hotel = await createHotel(formData);
      alert(`Hotel ${hotel.name} criado com sucesso!`);
      // Redirecionar ou limpar formulário
    } catch (error) {
      alert('Erro ao criar hotel');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Nome do Hotel"
        required
      />
      {/* Mais campos... */}
      <button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Hotel'}
      </button>
    </form>
  );
}
```

### Buscar Hotel por ID

```typescript
'use client';

import { useEffect } from 'react';
import { useHotel } from '@/presentation/hooks/useHotel';
import { container } from '@/shared/di/Container';

export default function HotelDetailPage({ params }: { params: { id: string } }) {
  const { selectedHotel, loading, error, fetchHotelById } = useHotel(
    container.getHotelService()
  );

  useEffect(() => {
    fetchHotelById(params.id);
  }, [params.id, fetchHotelById]);

  if (loading) return <div>Carregando...</div>;
  if (error || !selectedHotel) return <div>Hotel não encontrado</div>;

  return (
    <div>
      <h1>{selectedHotel.name}</h1>
      <p>CNPJ: {selectedHotel.cnpj}</p>
      <p>Email: {selectedHotel.email}</p>
      <p>Endereço: {selectedHotel.addressLine1}, {selectedHotel.city}/{selectedHotel.state}</p>
    </div>
  );
}
```

---

## 2. 🛏️ Trabalhando com Quartos

### Listar Quartos de um Hotel

```typescript
'use client';

import { useEffect } from 'react';
import { useRoom } from '@/presentation/hooks/useRoom';
import { container } from '@/shared/di/Container';

export function RoomsOfHotel({ hotelId }: { hotelId: string }) {
  const { rooms, loading, fetchRoomsByHotel } = useRoom(
    container.getRoomService()
  );

  useEffect(() => {
    fetchRoomsByHotel(hotelId);
  }, [hotelId, fetchRoomsByHotel]);

  if (loading) return <div>Carregando quartos...</div>;

  return (
    <div>
      <h2>Quartos ({rooms.length})</h2>
      <div className="grid grid-cols-3 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="border p-4">
            <h3>Quarto {room.roomNumber}</h3>
            <p>Status: {room.status}</p>
            <p>Andar: {room.floor}</p>
            <p>Capacidade: {room.maxOccupancy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Verificar Disponibilidade

```typescript
'use client';

import { useState } from 'react';
import { useRoom } from '@/presentation/hooks/useRoom';
import { container } from '@/shared/di/Container';
import { RoomAvailabilityRequest } from '@/application/dto/Room.dto';

export function AvailabilityChecker({ hotelId }: { hotelId: string }) {
  const { availableRooms, loading, checkAvailability } = useRoom(
    container.getRoomService()
  );
  
  const [dates, setDates] = useState({
    checkIn: '',
    checkOut: '',
  });

  const handleCheck = async () => {
    const request: RoomAvailabilityRequest = {
      hotelId,
      checkInDate: dates.checkIn,
      checkOutDate: dates.checkOut,
      guestCount: 2,
    };
    
    const available = await checkAvailability(request);
    console.log('Quartos disponíveis:', available);
  };

  return (
    <div>
      <h3>Verificar Disponibilidade</h3>
      <input
        type="date"
        value={dates.checkIn}
        onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
      />
      <input
        type="date"
        value={dates.checkOut}
        onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
      />
      <button onClick={handleCheck} disabled={loading}>
        Verificar
      </button>
      
      {availableRooms.length > 0 && (
        <div>
          <h4>{availableRooms.length} quartos disponíveis</h4>
          {availableRooms.map(room => (
            <div key={room.id}>
              Quarto {room.roomNumber} - R$ {room.totalPrice}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 3. 📅 Trabalhando com Reservas

### Criar uma Nova Reserva

```typescript
'use client';

import { useState } from 'react';
import { useBooking } from '@/presentation/hooks/useBooking';
import { container } from '@/shared/di/Container';
import { BookingCreateRequest } from '@/application/dto/Booking.dto';

export function NewBookingForm({ hotelId }: { hotelId: string }) {
  const { createBooking, loading } = useBooking(container.getBookingService());
  
  const [formData, setFormData] = useState<BookingCreateRequest>({
    hotelId,
    primaryGuestId: '',
    checkInDate: '',
    checkOutDate: '',
    guestCount: 1,
    rooms: [],
    specialRequests: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const booking = await createBooking(formData);
      alert(`Reserva ${booking.bookingCode} criada com sucesso!`);
    } catch (error) {
      alert('Erro ao criar reserva');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nova Reserva</h2>
      
      <label>Check-in:</label>
      <input
        type="date"
        value={formData.checkInDate}
        onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
        required
      />
      
      <label>Check-out:</label>
      <input
        type="date"
        value={formData.checkOutDate}
        onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
        required
      />
      
      <label>Número de hóspedes:</label>
      <input
        type="number"
        value={formData.guestCount}
        onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
        min="1"
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Reserva'}
      </button>
    </form>
  );
}
```

### Listar Reservas com Filtros

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useBooking } from '@/presentation/hooks/useBooking';
import { container } from '@/shared/di/Container';

export function BookingListFiltered() {
  const { 
    bookings, 
    loading, 
    fetchBookingsByHotel 
  } = useBooking(container.getBookingService());
  
  const [filters, setFilters] = useState({
    hotelId: '',
    startDate: '',
    endDate: '',
  });

  const applyFilters = () => {
    if (filters.hotelId) {
      fetchBookingsByHotel(filters.hotelId, filters.startDate, filters.endDate);
    }
  };

  return (
    <div>
      <div>
        <select
          value={filters.hotelId}
          onChange={(e) => setFilters({ ...filters, hotelId: e.target.value })}
        >
          <option value="">Selecione um hotel</option>
          {/* Mapear hotéis */}
        </select>
        
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />
        
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
        
        <button onClick={applyFilters}>Filtrar</button>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div>
          {bookings.map(booking => (
            <div key={booking.id}>
              <h3>Reserva #{booking.bookingCode}</h3>
              <p>Status: {booking.status}</p>
              <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
              <p>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Confirmar/Cancelar Reserva

```typescript
'use client';

import { useBooking } from '@/presentation/hooks/useBooking';
import { container } from '@/shared/di/Container';

export function BookingActions({ bookingId }: { bookingId: string }) {
  const { confirmBooking, cancelBooking, loading } = useBooking(
    container.getBookingService()
  );

  const handleConfirm = async () => {
    if (confirm('Deseja confirmar esta reserva?')) {
      try {
        await confirmBooking(bookingId);
        alert('Reserva confirmada!');
      } catch (error) {
        alert('Erro ao confirmar');
      }
    }
  };

  const handleCancel = async () => {
    const reason = prompt('Motivo do cancelamento:');
    if (reason) {
      try {
        await cancelBooking(bookingId, reason);
        alert('Reserva cancelada!');
      } catch (error) {
        alert('Erro ao cancelar');
      }
    }
  };

  return (
    <div>
      <button onClick={handleConfirm} disabled={loading}>
        Confirmar Reserva
      </button>
      <button onClick={handleCancel} disabled={loading}>
        Cancelar Reserva
      </button>
    </div>
  );
}
```

---

## 4. 👥 Trabalhando com Hóspedes

### Criar um Hóspede

```typescript
'use client';

import { useState } from 'react';
import { useGuest } from '@/presentation/hooks/useGuest';
import { container } from '@/shared/di/Container';
import { GuestCreateRequest } from '@/application/dto/Guest.dto';

export function NewGuestForm({ hotelId }: { hotelId: string }) {
  const { createGuest, loading } = useGuest(container.getGuestService());
  
  const [formData, setFormData] = useState<GuestCreateRequest>({
    hotelId,
    firstName: '',
    lastName: '',
    email: '',
    phoneE164: '',
    documentType: 'CPF',
    documentNumber: '',
    birthDate: '',
    nationality: 'BR',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const guest = await createGuest(formData);
      alert(`Hóspede ${guest.firstName} ${guest.lastName} criado!`);
    } catch (error) {
      alert('Erro ao criar hóspede');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Nome"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        required
      />
      <input
        placeholder="Sobrenome"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      {/* Mais campos... */}
      <button type="submit" disabled={loading}>
        Criar Hóspede
      </button>
    </form>
  );
}
```

---

## 5. 🔐 Trabalhando com Autenticação

### Verificar Usuário Logado

```typescript
'use client';

import { useSession } from 'next-auth/react';

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Carregando...</div>;
  if (status === 'unauthenticated') return <div>Você precisa fazer login</div>;

  return (
    <div>
      <h2>Bem-vindo, {session?.user?.name}!</h2>
      <p>E-mail: {session?.user?.email}</p>
      <p>Roles: {session?.roles?.join(', ')}</p>
      <p>Token expira em: {session?.expiresAt}</p>
    </div>
  );
}
```

### Proteger uma Rota

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/signin');
    }
  }, [status]);

  if (status === 'loading') return <div>Carregando...</div>;

  return <div>Conteúdo protegido</div>;
}
```

---

## 6. 🎨 Componentes Reutilizáveis

### Usando LoadingSpinner

```typescript
import { LoadingSpinner } from '@/presentation/components/common/LoadingSpinner';

export function MyComponent() {
  const { loading } = useSomeHook();

  if (loading) return <LoadingSpinner size="lg" />;

  return <div>Conteúdo</div>;
}
```

### Usando ErrorMessage

```typescript
import { ErrorMessage } from '@/presentation/components/common/ErrorMessage';

export function MyComponent() {
  const { error } = useSomeHook();

  if (error) return <ErrorMessage message={error} />;

  return <div>Conteúdo</div>;
}
```

### Usando EmptyState

```typescript
import { EmptyState } from '@/presentation/components/common/EmptyState';
import { useRouter } from 'next/navigation';

export function MyComponent() {
  const router = useRouter();
  const { items } = useSomeHook();

  if (items.length === 0) {
    return (
      <EmptyState
        message="Nenhum item encontrado"
        actionLabel="Adicionar Novo"
        onAction={() => router.push('/new')}
      />
    );
  }

  return <div>Lista de items</div>;
}
```

---

## 7. 🧪 Padrões Avançados

### Composição de Hooks

```typescript
'use client';

import { useEffect } from 'react';
import { useHotel } from '@/presentation/hooks/useHotel';
import { useRoom } from '@/presentation/hooks/useRoom';
import { container } from '@/shared/di/Container';

export function HotelDashboard({ hotelId }: { hotelId: string }) {
  const { selectedHotel, fetchHotelById } = useHotel(container.getHotelService());
  const { rooms, fetchRoomsByHotel } = useRoom(container.getRoomService());

  useEffect(() => {
    fetchHotelById(hotelId);
    fetchRoomsByHotel(hotelId);
  }, [hotelId]);

  return (
    <div>
      <h1>{selectedHotel?.name}</h1>
      <p>Total de quartos: {rooms.length}</p>
      <p>Disponíveis: {rooms.filter(r => r.status === 'Available').length}</p>
    </div>
  );
}
```

### Custom Hook Combinado

```typescript
import { useState, useEffect } from 'react';
import { useHotel } from '@/presentation/hooks/useHotel';
import { useRoom } from '@/presentation/hooks/useRoom';
import { container } from '@/shared/di/Container';

export function useHotelWithRooms(hotelId: string) {
  const hotelHook = useHotel(container.getHotelService());
  const roomHook = useRoom(container.getRoomService());
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([
        hotelHook.fetchHotelById(hotelId),
        roomHook.fetchRoomsByHotel(hotelId),
      ]);
      setLoading(false);
    };
    load();
  }, [hotelId]);

  return {
    hotel: hotelHook.selectedHotel,
    rooms: roomHook.rooms,
    loading,
    error: hotelHook.error || roomHook.error,
  };
}
```

---

## 8. 💡 Boas Práticas

### 1. Sempre use o Container para obter serviços

```typescript
// ✅ CORRETO
const service = container.getHotelService();

// ❌ ERRADO - não instanciar diretamente
const service = new HotelService(new HotelRepository());
```

### 2. Use hooks em componentes 'use client'

```typescript
'use client'; // SEMPRE necessário para hooks

import { useHotel } from '@/presentation/hooks/useHotel';
```

### 3. Trate erros adequadamente

```typescript
const { error, loading } = useHotel(container.getHotelService());

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
// render normal
```

### 4. Cleanup em useEffect quando necessário

```typescript
useEffect(() => {
  let cancelled = false;
  
  const load = async () => {
    const data = await fetchData();
    if (!cancelled) {
      setData(data);
    }
  };
  
  load();
  
  return () => { cancelled = true; };
}, []);
```

---

**Esses exemplos cobrem os casos de uso mais comuns. Consulte a documentação para casos avançados!** 🚀

