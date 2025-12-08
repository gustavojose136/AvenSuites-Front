'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { httpClient } from '@/infrastructure/http/HttpClient';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Hotel {
  id: string;
  name: string;
  city?: string;
  state?: string;
  phone?: string;
}

interface RoomTypeOccupancyPrice {
  id: string;
  occupancy: number;
  pricePerNight: number;
}

interface RoomType {
  id: string;
  code: string;
  name: string;
  description: string;
  capacityAdults: number;
  capacityChildren: number;
  basePrice: number;
  occupancyPrices?: RoomTypeOccupancyPrice[];
  amenities?: string[];
  active: boolean;
}

interface Room {
  id: string;
  roomNumber?: string;
  floor?: number;
  maxOccupancy?: number;
  status?: string;
  roomTypeId?: string; // ID do tipo de quarto
  roomType?: RoomType;
  // Campos para quando vier como RoomType diretamente
  code?: string;
  name?: string;
  description?: string;
  capacityAdults?: number;
  capacityChildren?: number;
  basePrice?: number;
  pricePerNight?: number;
  amenities?: string[];
  active?: boolean;
}

const createLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDateLocal = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  const date = createLocalDate(dateString);
  return date.toLocaleDateString("pt-BR", options);
};

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const hotelId = searchParams.get('hotelId') || '7a326969-3bf6-40d9-96dc-1aecef585000';
  const initialCheckIn = searchParams.get('checkIn') || '';
  const initialCheckOut = searchParams.get('checkOut') || '';
  const initialGuests = Math.min(Math.max(Number(searchParams.get('guests')) || 2, 1), 3);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<Map<string, { roomType: RoomType; rooms: Room[] }>>(new Map());
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(Math.min(Math.max(initialGuests, 1), 3));
  const [isEditingDates, setIsEditingDates] = useState(false);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('guestToken');
      
      if (!token) {
        toast.error('Faça login para fazer uma reserva');
        router.push(`/guest/login?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
        return;
      }
    }

    if (!hotelId || !checkIn || !checkOut) {
      toast.error('Dados de reserva incompletos');
      router.push('/guest/search');
      return;
    }

    fetchHotelAndRooms();
  };

  const fetchHotelAndRooms = async () => {
    try {
      setLoading(true);
      
      let hotelData: Hotel | null = null;
      try {
        hotelData = await httpClient.get<Hotel>(`/Hotels/${hotelId}`);
      } catch (err) {
        hotelData = await httpClient.get<Hotel>(`/Hotels/${hotelId}`);
      }
      
      setHotel(hotelData);
      
      const roomsData = await httpClient.get<any[]>(
        `/Rooms?hotelId=${hotelId}&checkInDate=${checkIn}&checkOutDate=${checkOut}&guests=${guests}`
      );
      
      const hasRoomNumber = roomsData.length > 0 && 'roomNumber' in roomsData[0];

      let availableRooms: Room[] = [];

      if (hasRoomNumber) {
        const filteredByStatus = roomsData.filter(r => r.status === 'ACTIVE');
        
        const filteredByCapacity = filteredByStatus.filter(r => {
          const totalCapacity = (r.roomType?.capacityAdults || 0) + (r.roomType?.capacityChildren || 0);
          const hasCapacity = totalCapacity >= guests;
          return hasCapacity;
        });
        
        availableRooms = filteredByCapacity.map(r => ({
          ...r,
          maxOccupancy: (r.roomType?.capacityAdults || 0) + (r.roomType?.capacityChildren || 0),
          capacityAdults: r.roomType?.capacityAdults,
          capacityChildren: r.roomType?.capacityChildren,
          basePrice: r.pricePerNight || r.roomType?.basePrice,
          pricePerNight: r.pricePerNight,
          amenities: r.roomType?.amenities || [],
          description: r.roomType?.description,
          name: r.roomType?.name
        }));

        const groupedByType = new Map<string, { roomType: RoomType; rooms: Room[] }>();
        
        availableRooms.forEach(room => {
          const typeId = room.roomTypeId || room.roomType?.id || '';
          if (!typeId) return;
          
          if (!groupedByType.has(typeId)) {
            groupedByType.set(typeId, {
              roomType: room.roomType || {
                id: typeId,
                code: room.code || '',
                name: room.name || '',
                description: room.description || '',
                capacityAdults: room.capacityAdults || 0,
                capacityChildren: room.capacityChildren || 0,
                basePrice: room.basePrice || 0,
                active: true
              },
              rooms: []
            });
          }
          
          groupedByType.get(typeId)!.rooms.push(room);
        });
        
        setRoomTypes(groupedByType);
      } else {
        availableRooms = roomsData
          .filter(rt => {
            const isActive = rt.active !== false;
            const capacityOk = (rt.capacityAdults + (rt.capacityChildren || 0)) >= guests;
            return isActive && capacityOk;
          })
          .map((rt) => ({
            id: rt.id,
            roomNumber: rt.code,
            name: rt.name,
            description: rt.description,
            capacityAdults: rt.capacityAdults,
            capacityChildren: rt.capacityChildren,
            basePrice: rt.pricePerNight || rt.basePrice,
            pricePerNight: rt.pricePerNight,
            amenities: rt.amenities || [],
            active: rt.active,
            maxOccupancy: rt.capacityAdults + (rt.capacityChildren || 0),
            roomType: {
              id: rt.id,
              code: rt.code,
              name: rt.name,
              description: rt.description,
              capacityAdults: rt.capacityAdults,
              capacityChildren: rt.capacityChildren,
              basePrice: rt.basePrice,
              amenities: rt.amenities || [],
              active: rt.active
            }
          }));
        
        const groupedByType = new Map<string, { roomType: RoomType; rooms: Room[] }>();
        availableRooms.forEach(room => {
          const typeId = room.roomType?.id || room.id;
          if (!groupedByType.has(typeId)) {
            groupedByType.set(typeId, {
              roomType: room.roomType || {
                id: room.id,
                code: room.code || '',
                name: room.name || '',
                description: room.description || '',
                capacityAdults: room.capacityAdults || 0,
                capacityChildren: room.capacityChildren || 0,
                basePrice: room.basePrice || 0,
                active: true
              },
              rooms: [room]
            });
          } else {
            groupedByType.get(typeId)!.rooms.push(room);
          }
        });
        
        setRoomTypes(groupedByType);
      }
      
      setRooms(availableRooms);

      if (availableRooms.length === 0) {
        toast('Nenhum quarto disponível para o número de hóspedes selecionado', { icon: 'ℹ️' });
      }
    } catch (error) {
      toast.error('Erro ao carregar dados da reserva');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    const checkInDate = createLocalDate(checkIn);
    const checkOutDate = createLocalDate(checkOut);
    const diff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculatePricePerNight = (room: Room) => {
    if (room.pricePerNight) {
      return room.pricePerNight;
    }
    
    if (room.basePrice) {
      return room.basePrice;
    }
    
    if (room.roomType) {
    const occupancyPrice = room.roomType.occupancyPrices?.find(
      op => op.occupancy === guests
    );
    
      if (occupancyPrice) {
        return occupancyPrice.pricePerNight;
      }
      
      return room.roomType.basePrice || 0;
    }
    
    return 0;
  };

  const calculateTotal = () => {
    if (!selectedRoomId) return 0;
    const selectedRoom = rooms.find(r => r.id === selectedRoomId);
    if (!selectedRoom) return 0;
    
    const pricePerNight = calculatePricePerNight(selectedRoom);
    return pricePerNight * calculateNights();
  };

  const handleRoomTypeSelect = (roomTypeId: string) => {
    setSelectedRoomTypeId(roomTypeId);
    
    const typeGroup = roomTypes.get(roomTypeId);
    if (!typeGroup || typeGroup.rooms.length === 0) {
      toast.error('Nenhum quarto disponível deste tipo');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * typeGroup.rooms.length);
    const randomRoom = typeGroup.rooms[randomIndex];
    setSelectedRoomId(randomRoom.id);
  };

  // Obtém o quarto selecionado
  const getSelectedRoom = (): Room | null => {
    if (!selectedRoomId) return null;
    return rooms.find(r => r.id === selectedRoomId) || null;
  };

  const getToday = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMinCheckOut = (): string => {
    if (!checkIn) return getToday();
    const checkInDate = createLocalDate(checkIn);
    checkInDate.setDate(checkInDate.getDate() + 1);
    const year = checkInDate.getFullYear();
    const month = String(checkInDate.getMonth() + 1).padStart(2, '0');
    const day = String(checkInDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const validateDates = (newCheckIn: string, newCheckOut: string): boolean => {
    const today = getToday();
    
    if (newCheckIn < today) {
      toast.error('A data de check-in não pode ser no passado');
      return false;
    }
    
    if (newCheckOut <= newCheckIn) {
      toast.error('A data de check-out deve ser posterior à data de check-in');
      return false;
    }
    
    return true;
  };

  useEffect(() => {
    if (checkIn && checkOut && checkOut <= checkIn) {
      const checkInDate = createLocalDate(checkIn);
      checkInDate.setDate(checkInDate.getDate() + 1);
      const year = checkInDate.getFullYear();
      const month = String(checkInDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkInDate.getDate()).padStart(2, '0');
      setCheckOut(`${year}-${month}-${day}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn]);

  const handleUpdateDates = async () => {
    if (!validateDates(checkIn, checkOut)) {
      return;
    }

    // Limpa a seleção de quarto
    setSelectedRoomId('');
    setSelectedRoomTypeId('');

    // Atualiza a URL
    const params = new URLSearchParams();
    params.set('hotelId', hotelId);
    params.set('checkIn', checkIn);
    params.set('checkOut', checkOut);
    params.set('guests', guests.toString());
    router.replace(`/guest/booking?${params.toString()}`);

    // Recarrega os quartos
    await fetchHotelAndRooms();
    
    setIsEditingDates(false);
    toast.success('Datas atualizadas com sucesso');
  };

  const handleUpdateGuests = async () => {
    if (guests < 1 || guests > 3) {
      toast.error('A quantidade de hóspedes deve ser entre 1 e 3');
      return;
    }

    // Limpa a seleção de quarto
    setSelectedRoomId('');
    setSelectedRoomTypeId('');

    // Atualiza a URL
    const params = new URLSearchParams();
    params.set('hotelId', hotelId);
    params.set('checkIn', checkIn);
    params.set('checkOut', checkOut);
    params.set('guests', guests.toString());
    router.replace(`/guest/booking?${params.toString()}`);

    // Recarrega os quartos
    await fetchHotelAndRooms();
    
    toast.success('Quantidade de hóspedes atualizada');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRoomId) {
      toast.error('Selecione um quarto');
      return;
    }

    try {
      setSubmitting(true);
      
      const user = JSON.parse(localStorage.getItem('guestUser') || '{}');
      const guestId = user.id;

      if (!guestId) {
        toast.error('Erro ao identificar hóspede. Faça login novamente.');
        router.push('/guest/login');
        return;
      }

      const selectedRoom = rooms.find(r => r.id === selectedRoomId);
      if (!selectedRoom) {
        toast.error('Quarto não encontrado');
        return;
      }

      const bookingCode = `BK-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      const bookingData = {
        hotelId: hotelId,
        code: bookingCode,
        source: 'DIRECT',
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults: guests,
        children: 0,
        currency: 'BRL',
        mainGuestId: guestId,
        channelRef: null,
        notes: notes || null,
        bookingRooms: [
          {
            roomId: selectedRoomId,
            roomTypeId: selectedRoom.roomTypeId || selectedRoom.roomType?.id,
            ratePlanId: null,
            priceTotal: calculateTotal(),
            notes: null
          }
        ],
        additionalGuestIds: []
      };


      await httpClient.post('/Bookings', bookingData);

      toast.success('Reserva criada com sucesso!');
      router.push('/guest/portal');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.response?.data?.title || 'Erro ao criar reserva');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          {/* Header Simplificado */}
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
              Finalizar Reserva
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Escolha o tipo de quarto e confirme sua reserva
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
                <p className="text-gray-600 dark:text-gray-400">Carregando quartos disponíveis...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Coluna Principal - Quartos */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Resumo da Reserva Compacto */}
              {hotel && (
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            {hotel.name}
                          </h2>
                      {hotel.city && hotel.state && (
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                              {hotel.city}, {hotel.state}
                            </p>
                          )}
                        </div>
                        {!isEditingDates && (
                          <button
                            type="button"
                            onClick={() => setIsEditingDates(true)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                        )}
                      </div>
                      
                      {isEditingDates ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Check-in
                              </label>
                              <input
                                type="date"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                min={getToday()}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Check-out
                              </label>
                              <input
                                type="date"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                min={getMinCheckOut()}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Hóspedes
                              </label>
                              <select
                                value={Math.min(Math.max(guests, 1), 3)}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  if (value >= 1 && value <= 3) {
                                    setGuests(value);
                                  }
                                }}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                              >
                                {[1, 2, 3].map((num) => (
                                  <option key={num} value={num}>
                                    {num} {num === 1 ? 'pessoa' : 'pessoas'}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleUpdateDates}
                              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                            >
                              Atualizar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingDates(false);
                                setCheckIn(initialCheckIn);
                                setCheckOut(initialCheckOut);
                                setGuests(initialGuests);
                              }}
                              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                    </div>
                    <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Check-in</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {formatDateLocal(checkIn)}
                      </p>
                    </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                    <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Check-out</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {formatDateLocal(checkOut)}
                      </p>
                    </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                    <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Hóspedes</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {guests} {guests === 1 ? 'pessoa' : 'pessoas'}
                      </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Período</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {calculateNights()} {calculateNights() === 1 ? 'noite' : 'noites'}
                      </p>
                    </div>
                  </div>
                        </div>
                      )}
                </div>
              )}

                  {/* Tipos de Quartos Disponíveis */}
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                          Escolha o Tipo de Quarto
                </h2>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          Selecione o tipo e um quarto será atribuído automaticamente
                        </p>
                      </div>
                      {selectedRoomTypeId && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          Tipo selecionado
                        </span>
                      )}
                    </div>

                    {roomTypes.size === 0 ? (
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8 text-center dark:border-yellow-800 dark:bg-yellow-900/20">
                    <svg className="mx-auto mb-4 h-12 w-12 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      Nenhum quarto disponível
                    </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                      Não há quartos disponíveis para as datas selecionadas ou que acomodem {guests} {guests === 1 ? 'pessoa' : 'pessoas'}.
                    </p>
                  </div>
                ) : (
                      <>
                        <div className="grid gap-4 md:grid-cols-2">
                          {Array.from(roomTypes.entries()).map(([typeId, { roomType, rooms: typeRooms }]) => {
                            const avgPrice = typeRooms.length > 0
                              ? typeRooms.reduce((sum, r) => sum + (r.pricePerNight || r.basePrice || 0), 0) / typeRooms.length
                              : roomType.basePrice || 0;
                            const isSelected = selectedRoomTypeId === typeId;

                            return (
                              <button
                                key={typeId}
                                type="button"
                                onClick={() => handleRoomTypeSelect(typeId)}
                        className={`
                                  group relative text-left rounded-xl border-2 p-5 transition-all duration-200
                                  ${isSelected
                                    ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20'
                                    : 'border-slate-200 bg-white hover:border-primary/30 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
                          }
                        `}
                      >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                      </svg>
                                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {roomType.name}
                              </h3>
                                    </div>
                                    {roomType.code && (
                                      <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                        <span className="font-mono font-medium">{roomType.code}</span>
                                      </div>
                                    )}
                                    {roomType.description && (
                                      <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                        {roomType.description}
                                      </p>
                              )}
                            </div>
                                  {selectedRoomTypeId === typeId && (
                                    <div className="ml-2 flex-shrink-0">
                                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                                      </div>
                                    </div>
                            )}
                        </div>

                                <div className="space-y-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                      </svg>
                                      <span>
                                        {roomType.capacityAdults} adultos
                                        {roomType.capacityChildren > 0 && (
                                          <span className="text-gray-500">, {roomType.capacityChildren} crianças</span>
                                        )}
                                  </span>
                                </div>
                                    <div className="flex items-center gap-1.5">
                                      <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                                        R$ {avgPrice.toFixed(2)}
                                      </span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">/noite</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span>{typeRooms.length} {typeRooms.length === 1 ? 'quarto disponível' : 'quartos disponíveis'}</span>
                                </div>
                                </div>
                              </button>
                            );
                          })}
                              </div>

                        {/* Mostra o quarto selecionado após escolher o tipo */}
                        {selectedRoomId && getSelectedRoom() && (
                          <div className="mt-6 rounded-xl border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5 p-6 shadow-lg ring-2 ring-primary/20">
                            <div className="mb-4 flex items-start justify-between">
                              <div className="flex-1">
                                <div className="mb-3 flex items-center gap-2">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-primary">Quarto Selecionado</p>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                      {getSelectedRoom()?.name || 'Quarto'}
                                    </h3>
                                  </div>
                                </div>
                                {(getSelectedRoom()?.roomNumber || getSelectedRoom()?.code) && (
                                  <div className="flex items-center gap-2 rounded-lg bg-white/60 dark:bg-slate-800/60 px-3 py-2">
                                    <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                    <span className="text-sm font-mono font-semibold text-slate-900 dark:text-white">
                                      {getSelectedRoom()?.roomNumber || getSelectedRoom()?.code}
                                      </span>
                                    {getSelectedRoom()?.floor && (
                                      <span className="text-xs text-slate-500 dark:text-slate-400">• {getSelectedRoom()?.floor}º andar</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-white/80 dark:bg-slate-800/80 px-4 py-3">
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Preço por noite</span>
                              <span className="text-xl font-bold text-slate-900 dark:text-white">
                                R$ {getSelectedRoom() ? calculatePricePerNight(getSelectedRoom()!).toFixed(2) : '0.00'}
                                      </span>
                                  </div>
                                </div>
                              )}
                            </>
                )}
              </div>

              {/* Observações */}
                  {selectedRoomId && (
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-white">
                        Observações Especiais
                  </h2>
                      <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">
                        Informe alguma solicitação especial para sua estadia
                      </p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                        placeholder="Ex: andar alto, vista para o mar, cama de casal..."
                  />
                </div>
              )}
                </div>

                {/* Sidebar - Resumo e Total */}
                {roomTypes.size > 0 && (
                  <div className="lg:col-span-1">
                    <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                      <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">
                        Resumo da Reserva
                      </h2>
                      
                      {selectedRoomId && getSelectedRoom() ? (
                        <>
                          <div className="mb-6 space-y-4 border-b border-slate-200 pb-6 dark:border-slate-700">
                            <div className="space-y-3">
                              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                                <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">Quarto</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                  {getSelectedRoom()?.name || 'Quarto Selecionado'}
                                </p>
                                {(getSelectedRoom()?.roomNumber || getSelectedRoom()?.code) && (
                                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                    {getSelectedRoom()?.roomNumber || getSelectedRoom()?.code}
                                    {getSelectedRoom()?.floor ? ` • ${getSelectedRoom()?.floor}º andar` : ''}
                      </p>
                                )}
                              </div>
                              <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5">
                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>{calculateNights()} {calculateNights() === 1 ? 'noite' : 'noites'}</span>
                                </div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                  R$ {getSelectedRoom() ? calculatePricePerNight(getSelectedRoom() as Room).toFixed(2) : '0.00'}/noite
                                </div>
                              </div>
                    </div>
                  </div>

                          <div className="mb-6 rounded-lg bg-primary/5 dark:bg-primary/10 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">Total</span>
                              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                R$ {calculateTotal().toFixed(2)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Taxas e impostos incluídos
                            </p>
                          </div>

                          <div className="space-y-2">
                    <button
                      type="submit"
                      disabled={!selectedRoomId || submitting}
                              className="w-full rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-md"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Confirmando...
                        </span>
                      ) : (
                        'Confirmar Reserva'
                      )}
                    </button>
                            <Link
                              href="/guest/search"
                              className="block w-full rounded-lg border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                              Voltar
                            </Link>
                          </div>
                        </>
                      ) : (
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-6 text-center">
                          <svg className="mx-auto mb-3 h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Selecione um tipo de quarto
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                            Escolha acima para ver o resumo
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-body-color dark:text-dark-6">Carregando...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}

