'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { httpClient } from '@/infrastructure/http/HttpClient';
import { usePagination } from '@/shared/hooks/usePagination';

interface Hotel {
  id: string;
  tradingName: string;
  city: string;
  state: string;
}

interface RoomType {
  id: string;
  code: string;
  name: string;
  description?: string;
  capacityAdults: number;
  capacityChildren: number;
  basePrice: number;
  active: boolean;
}

interface Room {
  id: string;
  hotelId: string;
  roomTypeId: string;
  roomNumber: string;
  floor: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'OCCUPIED' | 'CLEANING';
  createdAt: string;
  updatedAt: string;
  roomType?: RoomType;
}

export default function RoomsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('all');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  const fetchHotels = useCallback(async () => {
    try {
      const data = await httpClient.get<Hotel[]>('/Hotels');
      setHotels(data);
      
      if (data.length > 0 && !selectedHotelId) {
        setSelectedHotelId(data[0].id);
      }
    } catch (error) {
      toast.error('Erro ao carregar hotéis');
    }
  }, [selectedHotelId]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchHotels();
    }
  }, [status, fetchHotels]);

  useEffect(() => {
    if (selectedHotelId) {
      fetchRooms(selectedHotelId);
      fetchRoomTypes(selectedHotelId);
    }
  }, [selectedHotelId]);

  const fetchRoomTypes = async (hotelId: string) => {
    try {
      const data = await httpClient.get<RoomType[]>(`/RoomTypes/hotel/${hotelId}?activeOnly=true`);
      setRoomTypes(data);
    } catch (error) {
      setRoomTypes([]);
    }
  };

  const fetchRooms = async (hotelId: string) => {
    setLoading(true);
    try {
      // O backend já retorna os quartos com roomType incluído
      const roomsData = await httpClient.get<Room[]>(`/Rooms?hotelId=${hotelId}`);
      
      // Os quartos já vêm com roomType do backend, não precisa associar manualmente
      setRooms(roomsData);
    } catch (error) {
      console.error('❌ Erro ao buscar quartos:', error);
      toast.error('Erro ao carregar quartos');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'OCCUPIED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'CLEANING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'MAINTENANCE':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: 'Disponível',
      OCCUPIED: 'Ocupado',
      CLEANING: 'Limpeza',
      MAINTENANCE: 'Manutenção',
      INACTIVE: 'Inativo',
    };
    return labels[status] || status;
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType?.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesRoomType = roomTypeFilter === 'all' || room.roomTypeId === roomTypeFilter;
    const matchesFloor = floorFilter === 'all' || room.floor === floorFilter;
    return matchesSearch && matchesStatus && matchesRoomType && matchesFloor;
  });

  const uniqueFloors = Array.from(new Set(rooms.map(r => r.floor).filter(Boolean))).sort();

  const {
    items: paginatedRooms,
    currentPage,
    totalPages,
    goToPage,
    hasNextPage,
    hasPreviousPage,
  } = usePagination({
    items: filteredRooms,
    itemsPerPage: 5,
  });

  const stats = {
    total: rooms.length,
    active: rooms.filter(r => r.status === 'ACTIVE').length,
    occupied: rooms.filter(r => r.status === 'OCCUPIED').length,
    maintenance: rooms.filter(r => r.status === 'MAINTENANCE').length,
    cleaning: rooms.filter(r => r.status === 'CLEANING').length,
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

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:to-dark-2 py-20">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
            <span>/</span>
            <span>Quartos</span>
          </div>
          
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark dark:text-white lg:text-4xl">
                Gerenciador de Quartos
              </h1>
              <p className="mt-2 text-body-color dark:text-dark-6">
                Gerencie todos os quartos dos seus hotéis
              </p>
            </div>
            
            <div className="flex items-center gap-3">
            {selectedHotelId && (
              <Link
                href={`/rooms/new?hotelId=${selectedHotelId}`}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Quarto
              </Link>
            )}
              
              <div className="relative">
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-700 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:border-primary"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                {showOptionsMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowOptionsMenu(false)}
                    ></div>
                    <div className="absolute right-0 top-12 z-20 w-56 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-dark-3 dark:bg-dark-2">
                      <div className="p-1">
                        <Link
                          href={selectedHotelId ? `/room-types?hotelId=${selectedHotelId}` : '/room-types'}
                          onClick={() => setShowOptionsMenu(false)}
                          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-primary/10 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/20"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                          </svg>
                          Tipos de Quartos
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seletor de Hotel */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-xl dark:bg-dark-2">
          <label className="mb-3 block text-sm font-semibold text-dark dark:text-white">
            Selecione o Hotel
          </label>
          <select
            value={selectedHotelId}
            onChange={(e) => setSelectedHotelId(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white md:w-auto md:min-w-[300px]"
          >
            <option value="">Selecione um hotel...</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.tradingName} - {hotel.city}/{hotel.state}
              </option>
            ))}
          </select>
        </div>

        {selectedHotelId && (
          <>
            {/* Estatísticas */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
              <div className="rounded-xl bg-white p-4 shadow-lg dark:bg-dark-2">
                <p className="text-sm text-body-color dark:text-dark-6">Total</p>
                <p className="text-2xl font-bold text-dark dark:text-white">{stats.total}</p>
              </div>
              <div className="rounded-xl bg-green-50 p-4 shadow-lg dark:bg-green-900/10">
                <p className="text-sm text-green-700 dark:text-green-400">Disponíveis</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-300">{stats.active}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-4 shadow-lg dark:bg-blue-900/10">
                <p className="text-sm text-blue-700 dark:text-blue-400">Ocupados</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{stats.occupied}</p>
              </div>
              <div className="rounded-xl bg-yellow-50 p-4 shadow-lg dark:bg-yellow-900/10">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">Limpeza</p>
                <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{stats.cleaning}</p>
              </div>
              <div className="rounded-xl bg-orange-50 p-4 shadow-lg dark:bg-orange-900/10">
                <p className="text-sm text-orange-700 dark:text-orange-400">Manutenção</p>
                <p className="text-2xl font-bold text-orange-800 dark:text-orange-300">{stats.maintenance}</p>
              </div>
            </div>

            {/* Filtros */}
            <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl dark:bg-dark-2">
              <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Filtros</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Busca */}
                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Buscar
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Número, tipo ou código..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 bg-white py-3 pl-12 pr-4 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                    <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filtro de Status */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  >
                    <option value="all">Todos</option>
                    <option value="ACTIVE">Disponível</option>
                    <option value="OCCUPIED">Ocupado</option>
                    <option value="CLEANING">Limpeza</option>
                    <option value="MAINTENANCE">Manutenção</option>
                    <option value="INACTIVE">Inativo</option>
                  </select>
                </div>

                {/* Filtro de Tipo de Quarto */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Tipo de Quarto
                  </label>
                  <select
                    value={roomTypeFilter}
                    onChange={(e) => setRoomTypeFilter(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  >
                    <option value="all">Todos</option>
                    {roomTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} ({type.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro de Andar */}
                {uniqueFloors.length > 0 && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Andar
                    </label>
                    <select
                      value={floorFilter}
                      onChange={(e) => setFloorFilter(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    >
                      <option value="all">Todos</option>
                      {uniqueFloors.map((floor) => (
                        <option key={floor} value={floor}>
                          {floor}º Andar
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de Quartos */}
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-white shadow-xl dark:bg-dark-2">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-body-color dark:text-dark-6">Carregando quartos...</p>
                </div>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-xl dark:bg-dark-2">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                  <svg className="h-8 w-8 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                  Nenhum quarto encontrado
                </h3>
                <p className="mb-6 text-body-color dark:text-dark-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca' 
                    : 'Comece criando o primeiro quarto deste hotel'}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Link
                    href={`/rooms/new?hotelId=${selectedHotelId}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Criar Primeiro Quarto
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-body-color dark:text-dark-6">
                    Mostrando {paginatedRooms.length} de {filteredRooms.length} quartos
                  </p>
                </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedRooms.map((room) => (
                  <div
                    key={room.id}
                    className="group overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-dark-2"
                  >
                    {/* Header do Card com Gradiente Animado */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6">
                      {/* Efeito de brilho animado */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
                      
                      <div className="relative flex items-start justify-between">
                        <div>
                          <h3 className="text-3xl font-black text-white">
                            #{room.roomNumber}
                          </h3>
                          <div className="mt-2 flex items-center gap-2">
                            {room.floor && (
                              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                {room.floor}º Andar
                              </span>
                            )}
                            {room.roomType && (
                              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                {room.roomType.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`rounded-full px-4 py-2 text-xs font-bold shadow-lg ${getStatusColor(room.status)}`}>
                          {getStatusLabel(room.status)}
                        </span>
                      </div>
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="p-6">
                      {/* Tipo e Descrição */}
                      {room.roomType && (
                        <div className="mb-4">
                          <p className="text-sm text-body-color dark:text-dark-6 line-clamp-2">
                            {room.roomType.description}
                          </p>
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* Informações em Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Capacidade */}
                          {room.roomType && (
                            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-3 dark:from-blue-900/20 dark:to-blue-800/20">
                              <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <div>
                                  <p className="text-xs text-blue-600 dark:text-blue-400">Capacidade</p>
                                  <p className="text-lg font-bold text-blue-800 dark:text-blue-300">
                                    {room.roomType.capacityAdults + room.roomType.capacityChildren}
                                  </p>
                                  <p className="text-xs text-blue-600 dark:text-blue-400">
                                    {room.roomType.capacityAdults} adultos, {room.roomType.capacityChildren} crianças
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Preço */}
                          {room.roomType && (
                            <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-3 dark:from-green-900/20 dark:to-green-800/20">
                              <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                  <p className="text-xs text-green-600 dark:text-green-400">Diária</p>
                                  <p className="text-lg font-bold text-green-800 dark:text-green-300">
                                    R$ {room.roomType.basePrice.toFixed(0)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Ações com Animações */}
                      <div className="mt-6 flex gap-3">
                        <Link
                          href={`/rooms/${room.id}`}
                          className="group/btn flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary/30 bg-white py-3 font-bold text-primary transition-all hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg dark:bg-dark-3"
                        >
                          <svg className="h-4 w-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver
                        </Link>
                        <Link
                          href={`/rooms/${room.id}/edit`}
                          className="group/btn flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                        >
                          <svg className="h-4 w-4 transition-transform group-hover/btn:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => goToPage(1)}
                      disabled={!hasPreviousPage}
                      className="rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300"
                    >
                      Primeira
                    </button>
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={!hasPreviousPage}
                      className="rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300"
                    >
                      Anterior
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                              currentPage === pageNum
                                ? 'bg-primary text-white'
                                : 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={!hasNextPage}
                      className="rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300"
                    >
                      Próxima
                    </button>
                    <button
                      onClick={() => goToPage(totalPages)}
                      disabled={!hasNextPage}
                      className="rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300"
                    >
                      Última
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {!selectedHotelId && hotels.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-xl dark:bg-dark-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
              <svg className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
              Nenhum hotel cadastrado
            </h3>
            <p className="mb-6 text-body-color dark:text-dark-6">
              Você precisa cadastrar um hotel antes de criar quartos
            </p>
            <Link
              href="/hotels/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
            >
              Criar Primeiro Hotel
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
