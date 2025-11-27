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
  amenities?: string[];
  active?: boolean;
}

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
      console.log('🔍 Verificando autenticação Guest:', token ? 'Token encontrado' : 'Sem token');
      
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
      
      console.log('🔍 Buscando dados para hotelId:', hotelId);
      console.log('👥 Número de hóspedes:', guests);
      
      // Busca hotel
      let hotelData: Hotel | null = null;
      try {
        hotelData = await httpClient.get<Hotel>(`/Hotels/${hotelId}`);
        console.log('✅ Hotel encontrado:', hotelData);
      } catch (err) {
        console.log('⚠️ Tentando endpoint /Hotel...');
        hotelData = await httpClient.get<Hotel>(`/Hotels/${hotelId}`);
        console.log('✅ Hotel encontrado com /Hotel:', hotelData);
      }
      
      setHotel(hotelData);
      
      // Busca quartos do hotel
      const roomsData = await httpClient.get<any[]>(`/Rooms?hotelId=${hotelId}`);
      console.log('🛏️ Total de quartos recebidos:', roomsData.length);
      console.log('🛏️ Estrutura do primeiro quarto:', roomsData[0]);
      
      // Verifica se tem roomNumber (são quartos reais) ou code (são tipos)
      const hasRoomNumber = roomsData.length > 0 && 'roomNumber' in roomsData[0];
      console.log('📋 Dados são quartos reais?', hasRoomNumber);

      let availableRooms: Room[] = [];

      if (hasRoomNumber) {
        // Os dados são Rooms reais com roomType aninhado
        console.log('✅ Trabalhando com Rooms (com roomType aninhado)');
        
        const filteredByStatus = roomsData.filter(r => r.status === 'ACTIVE');
        console.log(`✅ Quartos com status ACTIVE: ${filteredByStatus.length}`);
        
        // Calcula capacidade baseada no roomType
        const filteredByCapacity = filteredByStatus.filter(r => {
          const totalCapacity = (r.roomType?.capacityAdults || 0) + (r.roomType?.capacityChildren || 0);
          const hasCapacity = totalCapacity >= guests;
          console.log(`Quarto #${r.roomNumber}: capacityAdults=${r.roomType?.capacityAdults}, capacityChildren=${r.roomType?.capacityChildren}, total=${totalCapacity}, guests=${guests}, ok=${hasCapacity}`);
          return hasCapacity;
        });
        console.log(`✅ Quartos com capacidade suficiente: ${filteredByCapacity.length}`);
        
        // Mapeia para formato esperado
        availableRooms = filteredByCapacity.map(r => ({
          ...r,
          maxOccupancy: (r.roomType?.capacityAdults || 0) + (r.roomType?.capacityChildren || 0),
          capacityAdults: r.roomType?.capacityAdults,
          capacityChildren: r.roomType?.capacityChildren,
          basePrice: r.roomType?.basePrice,
          amenities: r.roomType?.amenities || [],
          description: r.roomType?.description,
          name: r.roomType?.name
        }));
      } else {
        // Os dados são RoomTypes direto
        console.log('✅ Trabalhando com RoomTypes');
        
        availableRooms = roomsData
          .filter(rt => {
            const isActive = rt.active !== false;
            const capacityOk = (rt.capacityAdults + (rt.capacityChildren || 0)) >= guests;
            console.log(`Tipo "${rt.name}": active=${isActive}, capacity=${rt.capacityAdults + (rt.capacityChildren || 0)}, guests=${guests}, ok=${capacityOk}`);
            return isActive && capacityOk;
          })
          .map((rt) => ({
            id: rt.id,
            roomNumber: rt.code,
            name: rt.name,
            description: rt.description,
            capacityAdults: rt.capacityAdults,
            capacityChildren: rt.capacityChildren,
            basePrice: rt.basePrice,
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

      console.log('✅ Total de quartos disponíveis após filtros:', availableRooms.length);
      console.log('✅ Quartos disponíveis completos:', availableRooms);
      
      setRooms(availableRooms);

      if (availableRooms.length === 0) {
        console.warn('⚠️ NENHUM QUARTO DISPONÍVEL!');
        console.warn(`Total de quartos recebidos: ${roomsData.length}`);
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
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculatePricePerNight = (room: Room) => {
    if (!room.roomType) return room.basePrice || 0;
    
    // Busca preço específico para a ocupação
    const occupancyPrice = room.roomType.occupancyPrices?.find(
      op => op.occupancy === guests
    );
    
    // Se encontrou preço específico, usa ele; senão usa basePrice como fallback
    return occupancyPrice ? occupancyPrice.pricePerNight : room.roomType.basePrice;
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

      console.log('📤 Criando reserva com formato correto:', bookingData);
      console.log('🔐 Token será adicionado automaticamente pelo HttpClient');

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
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:via-dark-2 dark:to-dark py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-black text-dark dark:text-white">
              Finalize sua <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Reserva</span>
            </h1>
            <p className="text-lg text-body-color dark:text-dark-6">
              Escolha seu quarto e confirme os detalhes
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-body-color dark:text-dark-6">Carregando quartos disponíveis...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Resumo da Reserva */}
              {hotel && (
                <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary to-blue-600 p-8 text-white shadow-xl">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="mb-1 text-sm text-white/80">Hotel</p>
                      <p className="text-lg font-bold">{hotel.name}</p>
                      {hotel.city && hotel.state && (
                        <p className="text-sm text-white/80">{hotel.city}, {hotel.state}</p>
                      )}
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-white/80">Check-in</p>
                      <p className="text-lg font-bold">
                        {new Date(checkIn).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-white/80">Check-out</p>
                      <p className="text-lg font-bold">
                        {new Date(checkOut).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-white/80">Hóspedes</p>
                      <p className="text-lg font-bold">
                        {guests} {guests === 1 ? 'pessoa' : 'pessoas'}
                      </p>
                      <p className="text-sm text-white/80">
                        {calculateNights()} {calculateNights() === 1 ? 'noite' : 'noites'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quartos Disponíveis */}
              <div className="mb-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-dark-2">
                <h2 className="mb-6 text-2xl font-bold text-dark dark:text-white">
                  Quartos Disponíveis
                </h2>

                {rooms.length === 0 ? (
                  <div className="rounded-xl bg-yellow-50 p-8 text-center dark:bg-yellow-900/20">
                    <svg className="mx-auto mb-4 h-12 w-12 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
                      Nenhum quarto disponível
                    </h3>
                    <p className="text-body-color dark:text-dark-6">
                      Não há quartos disponíveis para as datas selecionadas ou que acomodem {guests} {guests === 1 ? 'pessoa' : 'pessoas'}.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {rooms.map((room) => (
                      <label
                        key={room.id}
                        className={`
                          group cursor-pointer overflow-hidden rounded-2xl border-3 transition-all duration-300
                          ${selectedRoomId === room.id
                            ? 'border-primary bg-gradient-to-br from-primary/10 to-blue-600/10 shadow-2xl scale-105'
                            : 'border-gray-200 bg-white hover:border-primary/30 hover:shadow-xl dark:border-dark-3 dark:bg-dark-2'
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

                         {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-black text-white">
                                {room.name || `#${room.roomNumber}`}
                              </h3>
                              {room.roomNumber && room.name && (
                                <p className="text-sm text-white/80">Código: {room.roomNumber}</p>
                              )}
                            </div>
                            {selectedRoomId === room.id && (
                              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-4">
                          {(room.roomType || room.description) && (
                            <>
                              <p className="mb-4 text-sm text-body-color dark:text-dark-6 line-clamp-2">
                                {room.description || room.roomType?.description}
                              </p>

                              <div className="mb-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-body-color dark:text-dark-6">Capacidade</span>
                                  <span className="font-bold text-dark dark:text-white">
                                    {room.capacityAdults || room.roomType?.capacityAdults || 0} adultos
                                    {(room.capacityChildren || room.roomType?.capacityChildren || 0) > 0 && `, ${room.capacityChildren || room.roomType?.capacityChildren} crianças`}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-body-color dark:text-dark-6">Preço/noite ({guests} {guests === 1 ? 'hóspede' : 'hóspedes'})</span>
                                  <span className="font-bold text-primary">R$ {calculatePricePerNight(room).toFixed(2)}</span>
                                </div>
                              </div>

                              {((room.amenities && room.amenities.length > 0) || (room.roomType?.amenities && room.roomType.amenities.length > 0)) && (
                                <div className="rounded-lg border border-stroke p-3 dark:border-dark-3">
                                  <p className="mb-2 text-xs font-bold text-body-color dark:text-dark-6">Comodidades</p>
                                  <div className="flex flex-wrap gap-1">
                                    {(room.amenities || room.roomType?.amenities || []).slice(0, 3).map((amenity, idx) => (
                                      <span key={idx} className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                                        {amenity}
                                      </span>
                                    ))}
                                    {(room.amenities || room.roomType?.amenities || []).length > 3 && (
                                      <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-dark-3">
                                        +{(room.amenities || room.roomType?.amenities || []).length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Observações */}
              {rooms.length > 0 && (
                <div className="mb-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-dark-2">
                  <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">
                    Observações (Opcional)
                  </h2>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                    placeholder="Alguma solicitação especial? (ex: andar alto, vista para o mar, etc.)"
                  />
                </div>
              )}

              {/* Total e Ações */}
              {rooms.length > 0 && (
                <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-dark-2">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-body-color dark:text-dark-6">Valor Total</p>
                      <p className="text-4xl font-black text-dark dark:text-white">
                        R$ {calculateTotal().toFixed(2)}
                      </p>
                       <p className="text-sm text-body-color dark:text-dark-6">
                        {calculateNights()} {calculateNights() === 1 ? 'noite' : 'noites'} × R$ {selectedRoomId ? (() => {
                          const selectedRoom = rooms.find(r => r.id === selectedRoomId);
                          return selectedRoom ? calculatePricePerNight(selectedRoom).toFixed(2) : '0.00';
                        })() : '0.00'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href="/guest/search"
                      className="flex-1 rounded-xl border-2 border-stroke px-6 py-4 text-center font-bold text-body-color transition-all hover:border-primary hover:text-primary dark:border-dark-3 dark:text-dark-6"
                    >
                      Voltar
                    </Link>
                    <button
                      type="submit"
                      disabled={!selectedRoomId || submitting}
                      className="flex-1 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Confirmando...
                        </span>
                      ) : (
                        'Confirmar Reserva'
                      )}
                    </button>
                  </div>
                </div>
              )}
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

