

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { httpClient } from '@/infrastructure/http/HttpClient';

interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
}

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

interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  maxOccupancy: number;
  basePrice: number;
  amenities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RoomWithType extends Room {
  roomType?: RoomType;
}

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function NewBookingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<RoomWithType[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [selectedGuestId, setSelectedGuestId] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchHotels();
    }
  }, [status]);

  useEffect(() => {
    if (selectedHotelId) {
      fetchGuests(selectedHotelId);
    }
  }, [selectedHotelId]);

  const fetchHotels = async () => {
    try {
      const data = await httpClient.get<Hotel[]>('/Hotels');
      setHotels(data);
    } catch (error) {
      console.error('❌ Erro ao buscar hotéis:', error);
      toast.error('Erro ao carregar hotéis');

      setHotels([
        { id: '1', name: 'Hotel Exemplo 1', address: 'Rua A, 123', city: 'São Paulo' },
        { id: '2', name: 'Hotel Exemplo 2', address: 'Av. B, 456', city: 'Rio de Janeiro' },
      ]);
    }
  };

  const fetchGuests = async (hotelId: string) => {
    try {
      const endpoint = hotelId ? `/Guests?hotelId=${hotelId}` : '/Guests';
      const data = await httpClient.get<any[]>(endpoint);

      const mappedGuests: Guest[] = data.map(g => ({
        id: g.id,
        firstName: g.fullName?.split(' ')[0] || g.fullName || 'N/A',
        lastName: g.fullName?.split(' ').slice(1).join(' ') || '',
        email: g.email || '',
        phone: g.phone || ''
      }));

      setGuests(mappedGuests);
    } catch (error) {
      console.error('❌ Erro ao buscar hóspedes:', error);
      toast.error('Erro ao carregar hóspedes');
      setGuests([]);
    }
  };

  const fetchAvailableRooms = useCallback(async () => {
    if (!selectedHotelId || !checkInDate || !checkOutDate || !guestCount) {
      setRooms([]);
      return;
    }

    try {

      const [roomsData, typesData] = await Promise.all([
        httpClient.get<Room[]>(
          `/Rooms?hotelId=${selectedHotelId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&guests=${guestCount}`
        ),
        httpClient.get<RoomType[]>(`/RoomType`)
      ]);

      const hotelTypes = typesData.filter(rt => rt.hotelId === selectedHotelId);

      const availableRooms = roomsData
        .filter(r => r.status === 'ACTIVE')
        .map((room, index) => ({
          ...room,
          roomType: hotelTypes[index % hotelTypes.length]

        }));

      setRooms(availableRooms);

      if (availableRooms.length === 0) {
        toast('Nenhum quarto disponível para as datas selecionadas', {
          icon: 'ℹ️',
        });
      }
    } catch (error) {
      console.error('❌ Erro ao buscar quartos:', error);
      toast.error('Erro ao carregar quartos disponíveis');
      setRooms([]);
    }
  }, [selectedHotelId, checkInDate, checkOutDate, guestCount]);

  useEffect(() => {
    fetchAvailableRooms();
  }, [fetchAvailableRooms]);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diff = new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return selectedRooms.reduce((total, roomId) => {
      const room = rooms.find(r => r.id === roomId);
      const price = room?.roomType?.basePrice || 200;
      return total + (price * nights);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!selectedHotelId || !selectedGuestId || !checkInDate || !checkOutDate || selectedRooms.length === 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        hotelId: selectedHotelId,
        primaryGuestId: selectedGuestId,
        checkInDate,
        checkOutDate,
        guestCount,
        rooms: selectedRooms.map(id => ({ roomId: id })),
        specialRequests: specialRequests || undefined,
        totalAmount: calculateTotal(),
        status: 'Confirmed',

      };

      const booking = await httpClient.post('/Bookings', bookingData);

      toast.success('Reserva criada com sucesso!');
      router.push('/bookings');

    } catch (error: any) {
      console.error('❌ Erro ao criar reserva:', error);
      const message = error.response?.data?.message || error.message || 'Erro ao criar reserva';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:to-dark-2 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-body-color dark:text-dark-6">Carregando...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/signin');
    return null;
  }

  const selectedHotel = hotels.find(h => h.id === selectedHotelId);
  const selectedGuest = guests.find(g => g.id === selectedGuestId);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:to-dark-2 py-20">
      <div className="container mx-auto px-4">

        {}
          <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
            <span>/</span>
            <Link href="/bookings" className="hover:text-primary">Reservas</Link>
            <span>/</span>
            <span>Nova Reserva</span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark dark:text-white lg:text-4xl">
                Nova Reserva
            </h1>
              <p className="mt-2 text-body-color dark:text-dark-6">
                Crie uma nova reserva em poucos passos
              </p>
            </div>
          </div>
        </div>

        {}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`
                    flex h-10 w-10 items-center justify-center rounded-full font-bold transition-all
                    ${step >= s
                      ? 'bg-primary text-white shadow-lg scale-110'
                      : 'bg-gray-300 text-gray-600 dark:bg-dark-3 dark:text-gray-400'
                    }
                  `}>
                    {s}
                  </div>
                  {s < 4 && (
                    <div className={`
                      h-1 w-12 transition-all
                      ${step > s ? 'bg-primary' : 'bg-gray-300 dark:bg-dark-3'}
                    `}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-8 text-xs text-body-color dark:text-dark-6">
            <span className={step >= 1 ? 'font-semibold text-primary' : ''}>Hotel</span>
            <span className={step >= 2 ? 'font-semibold text-primary' : ''}>Datas</span>
            <span className={step >= 3 ? 'font-semibold text-primary' : ''}>Quartos</span>
            <span className={step >= 4 ? 'font-semibold text-primary' : ''}>Confirmação</span>
          </div>
        </div>

        <div className="mx-auto max-w-4xl">

          {}
          {step === 1 && (
            <div className="space-y-6">
              {}
              <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-dark-2">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark dark:text-white">Selecione o Hotel</h3>
                    <p className="text-sm text-body-color dark:text-dark-6">Escolha onde será a reserva</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {hotels.map((hotel) => (
                    <label
                      key={hotel.id}
                      className={`
                        flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all
                        ${selectedHotelId === hotel.id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-gray-200 hover:border-primary/50 dark:border-dark-3'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="hotel"
                          value={hotel.id}
                          checked={selectedHotelId === hotel.id}
                          onChange={(e) => setSelectedHotelId(e.target.value)}
                          className="h-5 w-5 text-primary"
                        />
                        <div>
                          <p className="font-semibold text-dark dark:text-white">{hotel.name}</p>
                          <p className="text-sm text-body-color dark:text-dark-6">
                            {hotel.address} - {hotel.city}
                          </p>
                        </div>
                      </div>
                      {selectedHotelId === hotel.id && (
                        <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {}
              {selectedHotelId && (
                <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-dark-2">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
                      <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark dark:text-white">Selecione o Hóspede</h3>
                      <p className="text-sm text-body-color dark:text-dark-6">Quem fará o check-in</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {guests.length > 0 ? (
                      <>
                        {guests.map((guest) => (
                          <label
                            key={guest.id}
                            className={`
                              flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all
                              ${selectedGuestId === guest.id
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-gray-200 hover:border-primary/50 dark:border-dark-3'
                              }
                            `}
                          >
                            <div className="flex items-center gap-4">
                              <input
                                type="radio"
                                name="guest"
                                value={guest.id}
                                checked={selectedGuestId === guest.id}
                                onChange={(e) => setSelectedGuestId(e.target.value)}
                                className="h-5 w-5 text-primary"
                              />
                              <div>
                                <p className="font-semibold text-dark dark:text-white">
                                  {guest.firstName} {guest.lastName}
                                </p>
                                <p className="text-sm text-body-color dark:text-dark-6">
                                  {guest.email} • {guest.phone}
                                </p>
                              </div>
                            </div>
                            {selectedGuestId === guest.id && (
                              <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </label>
                        ))}

                        {}
                        <Link
                          href={`/guests/new?hotelId=${selectedHotelId}&returnTo=/bookings/new`}
                          className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary bg-primary/5 p-4 text-primary transition-all hover:bg-primary/10 dark:border-primary/50"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="font-semibold">Cadastrar Novo Hóspede</span>
                        </Link>
                      </>
                    ) : (
                      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-dark-3">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                          <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h4 className="mb-2 text-lg font-semibold text-dark dark:text-white">
                          Nenhum hóspede cadastrado
                        </h4>
                        <p className="mb-4 text-sm text-body-color dark:text-dark-6">
                          Cadastre o primeiro hóspede para continuar com a reserva
                        </p>
                        <Link
                          href={`/guests/new?hotelId=${selectedHotelId}&returnTo=/bookings/new`}
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Cadastrar Hóspede
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => router.back()}
                  className="rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedHotelId || !selectedGuestId}
                  className="rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {}
          {step === 2 && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-dark-2">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/20">
                    <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark dark:text-white">Período da Reserva</h3>
                    <p className="text-sm text-body-color dark:text-dark-6">Escolha as datas de entrada e saída</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                      Check-in <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>

                  {}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                      Check-out <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                      className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>

                  {}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                      Hóspedes <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value))}
                      min="1"
                      max="10"
                      className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>
                </div>

                {}
                {checkInDate && checkOutDate && (
                  <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/10">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">
                        {calculateNights()} noite{calculateNights() !== 1 ? 's' : ''} • {guestCount} hóspede{guestCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {}
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
                >
                  ← Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!checkInDate || !checkOutDate || !guestCount}
                  className="rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {}
          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-dark-2">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/20">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark dark:text-white">Quartos Disponíveis</h3>
                    <p className="text-sm text-body-color dark:text-dark-6">Selecione um ou mais quartos</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {rooms.map((room) => (
                    <label
                      key={room.id}
                      className={`
                        group relative cursor-pointer overflow-hidden rounded-2xl border-3 transition-all duration-300
                        ${selectedRooms.includes(room.id)
                          ? 'border-primary bg-gradient-to-br from-primary/10 to-purple-500/10 shadow-2xl scale-105'
                          : 'border-gray-200 bg-white hover:border-primary/30 hover:shadow-xl dark:border-dark-3 dark:bg-dark-2'
                        }
                      `}
                    >
                      {}
                      {selectedRooms.includes(room.id) && (
                        <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-lg">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          SELECIONADO
                        </div>
                      )}

                      {}
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedRooms.includes(room.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRooms([...selectedRooms, room.id]);
                                } else {
                                  setSelectedRooms(selectedRooms.filter(id => id !== room.id));
                                }
                              }}
                              className="h-6 w-6 rounded-lg border-2 border-white bg-white/20 text-primary focus:ring-2 focus:ring-white"
                            />
                            <div>
                              <h4 className="text-2xl font-black text-white">
                                Quarto #{room.roomNumber}
                              </h4>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                                  {room.floor}º Andar
                                </span>
                                {room.roomType && (
                                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                                    {room.roomType.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {}
                      <div className="p-5">
                        {}
                        {room.roomType && (
                          <p className="mb-4 text-sm text-body-color dark:text-dark-6 line-clamp-2">
                            {room.roomType.description}
                          </p>
                        )}

                        {}
                        <div className="mb-4 grid grid-cols-2 gap-3">
                          {}
                          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                            <div className="flex items-center gap-2">
                              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400">Capacidade</p>
                                <p className="text-base font-bold text-blue-800 dark:text-blue-300">{room.maxOccupancy} pessoas</p>
                              </div>
                            </div>
                          </div>

                          {}
                          <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                            <div className="flex items-center gap-2">
                              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="text-xs text-green-600 dark:text-green-400">Diária</p>
                                <p className="text-base font-bold text-green-800 dark:text-green-300">
                                  R$ {room.roomType?.basePrice.toFixed(0) || '200'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {}
                        {room.roomType?.amenities && room.roomType.amenities.length > 0 && (
                          <div className="rounded-lg border-2 border-dashed border-purple-200 bg-purple-50/50 p-3 dark:border-purple-800 dark:bg-purple-900/10">
                            <p className="mb-2 flex items-center gap-1 text-xs font-bold text-purple-700 dark:text-purple-400">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Comodidades Incluídas
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {room.roomType.amenities.slice(0, 3).map((amenity, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-md bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {room.roomType.amenities.length > 3 && (
                                <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-dark-3 dark:text-gray-300">
                                  +{room.roomType.amenities.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {}
                        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-50 py-2 dark:bg-green-900/20">
                          <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-bold text-green-700 dark:text-green-400">
                            Disponível Agora
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}

                  {rooms.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-dark-3">
                      <p className="text-body-color dark:text-dark-6">
                        Nenhum quarto disponível para o período selecionado
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {}
              <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-dark-2">
                <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                  Solicitações Especiais <span className="text-sm font-normal text-body-color">(Opcional)</span>
                </h3>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={4}
                  placeholder="Ex: Andar alto, cama extra, berço para bebê..."
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
              </div>

              {}
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
                >
                  ← Voltar
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={selectedRooms.length === 0}
                  className="rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Revisar Reserva →
                </button>
              </div>
            </div>
          )}

          {}
          {step === 4 && (
            <div className="space-y-6">
              {}
              <div className="rounded-2xl bg-gradient-to-br from-primary to-indigo-600 p-8 text-white shadow-2xl">
                <h3 className="mb-6 text-2xl font-bold">Resumo da Reserva</h3>

                <div className="space-y-4">
                  {}
                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-sm text-blue-100">Hotel</p>
                    <p className="text-lg font-semibold">{selectedHotel?.name}</p>
                    <p className="text-sm text-blue-100">{selectedHotel?.city}</p>
                  </div>

                  {}
                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-sm text-blue-100">Hóspede</p>
                    <p className="text-lg font-semibold">
                      {selectedGuest?.firstName} {selectedGuest?.lastName}
                    </p>
                    <p className="text-sm text-blue-100">{selectedGuest?.email}</p>
                  </div>

                  {}
                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-sm text-blue-100">Período</p>
                    <p className="text-lg font-semibold">
                      {new Date(checkInDate).toLocaleDateString('pt-BR')} até {new Date(checkOutDate).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-blue-100">
                      {calculateNights()} noite{calculateNights() !== 1 ? 's' : ''} • {guestCount} hóspede{guestCount !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {}
                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <p className="mb-2 text-sm text-blue-100">Quartos Selecionados</p>
                    {selectedRooms.map(roomId => {
                      const room = rooms.find(r => r.id === roomId);
                      const price = room?.roomType?.basePrice || 200;
                      return room ? (
                        <div key={roomId} className="mb-2 flex justify-between">
                          <span>Quarto {room.roomNumber} - {room.roomType?.name || 'Standard'}</span>
                          <span className="font-semibold">R$ {(price * calculateNights()).toFixed(2)}</span>
                        </div>
                      ) : null;
                    })}
                  </div>

                  {}
                  <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold">TOTAL</p>
                      <p className="text-3xl font-bold">R$ {calculateTotal().toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setStep(3)}
                  disabled={loading}
                  className="rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
                >
                  ← Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-8 py-4 text-lg font-bold text-white shadow-2xl transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Criando Reserva...
                    </>
                  ) : (
                    <>
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmar Reserva
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
        </div>
      </section>
  );
}
