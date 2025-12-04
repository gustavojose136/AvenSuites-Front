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
  pricePerNight?: number; // Preço calculado pela API baseado na quantidade de hóspedes
  amenities?: string[];
  active?: boolean;
}

// Helper para criar data no timezone local a partir de string YYYY-MM-DD
const createLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Helper para formatar data no timezone local
const formatDateLocal = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  const date = createLocalDate(dateString);
  return date.toLocaleDateString("pt-BR", options);
};

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const hotelId = searchParams.get('hotelId') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = Number(searchParams.get('guests')) || 2;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = () => {
    // Verifica se tem token Guest
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
      
      // Busca hotel
      let hotelData: Hotel | null = null;
      try {
        hotelData = await httpClient.get<Hotel>(`/Hotels/${hotelId}`);
      } catch (err) {
        hotelData = await httpClient.get<Hotel>(`/Hotels/${hotelId}`);
      }
      
      setHotel(hotelData);
      
      // Busca quartos do hotel disponíveis para as datas selecionadas e quantidade de hóspedes
      const roomsData = await httpClient.get<any[]>(
        `/Rooms?hotelId=${hotelId}&checkInDate=${checkIn}&checkOutDate=${checkOut}&guests=${guests}`
      );
      
      // Verifica se tem roomNumber (são quartos reais) ou code (são tipos)
      const hasRoomNumber = roomsData.length > 0 && 'roomNumber' in roomsData[0];

      let availableRooms: Room[] = [];

      if (hasRoomNumber) {
        // Os dados são Rooms reais com roomType aninhado
        const filteredByStatus = roomsData.filter(r => r.status === 'ACTIVE');
        
        // Calcula capacidade baseada no roomType
        const filteredByCapacity = filteredByStatus.filter(r => {
          const totalCapacity = (r.roomType?.capacityAdults || 0) + (r.roomType?.capacityChildren || 0);
          const hasCapacity = totalCapacity >= guests;
          return hasCapacity;
        });
        
        // Mapeia para formato esperado, preservando o preço calculado pela API
        availableRooms = filteredByCapacity.map(r => ({
          ...r,
          maxOccupancy: (r.roomType?.capacityAdults || 0) + (r.roomType?.capacityChildren || 0),
          capacityAdults: r.roomType?.capacityAdults,
          capacityChildren: r.roomType?.capacityChildren,
          basePrice: r.pricePerNight || r.roomType?.basePrice, // Usa o preço calculado pela API se disponível
          pricePerNight: r.pricePerNight, // Preço calculado baseado na quantidade de hóspedes
          amenities: r.roomType?.amenities || [],
          description: r.roomType?.description,
          name: r.roomType?.name
        }));
      } else {
        // Os dados são RoomTypes direto
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
            basePrice: rt.pricePerNight || rt.basePrice, // Usa o preço calculado pela API se disponível
            pricePerNight: rt.pricePerNight, // Preço calculado baseado na quantidade de hóspedes
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
      }
      
      setRooms(availableRooms);

      if (availableRooms.length === 0) {
        toast('Nenhum quarto disponível para o número de hóspedes selecionado', { icon: 'ℹ️' });
      }
    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error);
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
    // Prioriza o preço calculado pela API baseado na quantidade de hóspedes
    if (room.pricePerNight) {
      return room.pricePerNight;
    }
    
    // Fallback: usa basePrice se disponível
    if (room.basePrice) {
      return room.basePrice;
    }
    
    // Fallback: busca preço específico para a ocupação no roomType
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRoomId) {
      toast.error('Selecione um quarto');
      return;
    }

    try {
      setSubmitting(true);
      
      // Busca o guestId do localStorage
      const user = JSON.parse(localStorage.getItem('guestUser') || '{}');
      const guestId = user.id; // O ID do guest vem do user

      if (!guestId) {
        toast.error('Erro ao identificar hóspede. Faça login novamente.');
        router.push('/guest/login');
        return;
      }

      // Busca o quarto selecionado para pegar roomTypeId
      const selectedRoom = rooms.find(r => r.id === selectedRoomId);
      if (!selectedRoom) {
        toast.error('Quarto não encontrado');
        return;
      }

      // Gera código único da reserva
      const bookingCode = `BK-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      // Monta o objeto no formato correto da API
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
      console.error('❌ Erro ao criar reserva:', error);
      console.error('❌ Detalhes do erro:', error.response?.data);
      toast.error(error.response?.data?.message || error.response?.data?.title || 'Erro ao criar reserva');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
            <h1 className="mb-2 text-3xl font-semibold text-gray-900 dark:text-white">
              Seleção de Quarto
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Escolha o quarto de sua preferência para completar sua reserva
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
                <div className="lg:col-span-2">
                  {/* Resumo da Reserva */}
                  {hotel && (
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="mb-4 flex items-start justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {hotel.name}
                          </h2>
                          {hotel.city && hotel.state && (
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {hotel.city}, {hotel.state}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="flex items-start gap-2">
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              Check-in
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                              {formatDateLocal(checkIn)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              Check-out
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                              {formatDateLocal(checkOut)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              Hóspedes
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                              {guests} {guests === 1 ? 'pessoa' : 'pessoas'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              Período
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                              {calculateNights()} {calculateNights() === 1 ? 'noite' : 'noites'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quartos Disponíveis */}
                  <div className="mb-6">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                      Quartos Disponíveis
                    </h2>

                    {rooms.length === 0 ? (
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
                      <div className="grid gap-3 md:grid-cols-2">
                        {rooms.map((room) => (
                          <label
                            key={room.id}
                            className={`
                              relative block cursor-pointer rounded-lg border-2 transition-all
                              ${selectedRoomId === room.id
                                ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                                : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name="room"
                              value={room.id}
                              checked={selectedRoomId === room.id}
                              onChange={(e) => setSelectedRoomId(e.target.value)}
                              className="sr-only"
                            />
                            <div className="p-4">
                              {/* Header com nome e seleção */}
                              <div className="mb-3 flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                      {room.name || 'Quarto'}
                                    </h3>
                                  </div>
                                  {(room.roomNumber || room.code) && (
                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                      </svg>
                                      <span className="font-mono font-medium">{room.roomNumber || room.code}</span>
                                    </div>
                                  )}
                                </div>
                                {selectedRoomId === room.id && (
                                  <div className="ml-2 flex-shrink-0">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Descrição compacta */}
                              {(room.roomType || room.description) && (
                                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                                  {room.description || room.roomType?.description}
                                </p>
                              )}

                              {/* Informações principais com ícones */}
                              <div className="space-y-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>
                                      {room.capacityAdults || room.roomType?.capacityAdults || 0} adultos
                                      {(room.capacityChildren || room.roomType?.capacityChildren || 0) > 0 && (
                                        <span className="text-gray-500">, {room.capacityChildren || room.roomType?.capacityChildren} crianças</span>
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                      R$ {calculatePricePerNight(room).toFixed(2)}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">/noite</span>
                                  </div>
                                </div>

                                {/* Comodidades compactas */}
                                {((room.amenities && room.amenities.length > 0) || (room.roomType?.amenities && room.roomType.amenities.length > 0)) && (
                                  <div className="flex items-center gap-1.5">
                                    <svg className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    <div className="flex flex-wrap gap-1">
                                      {(room.amenities || room.roomType?.amenities || []).slice(0, 3).map((amenity, idx) => (
                                        <span key={idx} className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                          {amenity}
                                        </span>
                                      ))}
                                      {(room.amenities || room.roomType?.amenities || []).length > 3 && (
                                        <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                          +{(room.amenities || room.roomType?.amenities || []).length - 3}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Observações */}
                  {rooms.length > 0 && (
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Observações Especiais
                      </h2>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                        placeholder="Informe alguma solicitação especial (ex: andar alto, vista para o mar, cama de casal, etc.)"
                      />
                    </div>
                  )}
                </div>

                {/* Sidebar - Resumo e Total */}
                {rooms.length > 0 && (
                  <div className="lg:col-span-1">
                    <div className="sticky top-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                        Resumo da Reserva
                      </h2>
                      
                      {selectedRoomId ? (
                        <>
                          <div className="mb-6 space-y-3 border-b border-gray-200 pb-6 dark:border-gray-700">
                            {(() => {
                              const selectedRoom = rooms.find(r => r.id === selectedRoomId);
                              return selectedRoom ? (
                                <div className="space-y-3">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                      </svg>
                                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {selectedRoom.name || 'Quarto Selecionado'}
                                      </p>
                                    </div>
                                    {(selectedRoom.roomNumber || selectedRoom.code) && (
                                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                        <span className="font-mono">{selectedRoom.roomNumber || selectedRoom.code}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between rounded-md bg-gray-50 p-2.5 dark:bg-gray-700/50">
                                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <span>{calculateNights()} {calculateNights() === 1 ? 'noite' : 'noites'}</span>
                                    </div>
                                    <div className="text-xs font-semibold text-gray-900 dark:text-white">
                                      R$ {calculatePricePerNight(selectedRoom).toFixed(2)}/noite
                                    </div>
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>
                          
                          <div className="mb-6">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
                              </div>
                              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                R$ {calculateTotal().toFixed(2)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Taxas e impostos incluídos
                            </p>
                          </div>

                          <div className="space-y-3">
                            <button
                              type="submit"
                              disabled={!selectedRoomId || submitting}
                              className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                              className="block w-full rounded-md border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                              Voltar
                            </Link>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Selecione um quarto para ver o resumo
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

