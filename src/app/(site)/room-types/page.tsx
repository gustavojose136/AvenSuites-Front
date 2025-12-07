'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { httpClient } from '@/infrastructure/http/HttpClient';

interface Hotel {
  id: string;
  tradingName: string;
  city: string;
  state: string;
}

interface OccupancyPrice {
  id?: string;
  occupancy: number;
  pricePerNight: number;
  createdAt?: string;
  updatedAt?: string;
}

interface RoomType {
  id: string;
  hotelId: string;
  code: string;
  name: string;
  description?: string;
  capacityAdults: number;
  capacityChildren: number;
  basePrice: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  occupancyPrices?: OccupancyPrice[];
}

function RoomTypesPageContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>(searchParams.get('hotelId') || '');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchHotels();
    }
  }, [status]);

  useEffect(() => {
    if (selectedHotelId) {
      fetchRoomTypes(selectedHotelId);
    }
  }, [selectedHotelId]);

  const fetchHotels = async () => {
    try {
      const data = await httpClient.get<Hotel[]>('/Hotels');
      setHotels(data);
      
      if (data.length > 0 && !selectedHotelId) {
        setSelectedHotelId(data[0].id);
      }
    } catch (error) {
      toast.error('Erro ao carregar hotéis');
    }
  };

  const fetchRoomTypes = async (hotelId: string) => {
    setLoading(true);
    try {
      const data = await httpClient.get<RoomType[]>(`/RoomTypes/hotel/${hotelId}?activeOnly=false`);
      setRoomTypes(data);
    } catch (error) {
      toast.error('Erro ao carregar tipos de quartos');
      setRoomTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar este tipo de quarto?')) {
      return;
    }

    try {
      await httpClient.delete(`/RoomTypes/${id}`);
      toast.success('Tipo de quarto desativado com sucesso');
      if (selectedHotelId) {
        fetchRoomTypes(selectedHotelId);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao desativar tipo de quarto');
    }
  };

  const filteredRoomTypes = roomTypes.filter(roomType => {
    const matchesSearch = 
      roomType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roomType.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roomType.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = activeFilter === 'all' || 
      (activeFilter === 'active' && roomType.active) ||
      (activeFilter === 'inactive' && !roomType.active);
    return matchesSearch && matchesActive;
  });

  const stats = {
    total: roomTypes.length,
    active: roomTypes.filter(rt => rt.active).length,
    inactive: roomTypes.filter(rt => !rt.active).length,
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

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:to-dark-2 py-20">
      <div className="container mx-auto px-4">
        
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
            <span>/</span>
            <Link href="/rooms" className="hover:text-primary">Quartos</Link>
            <span>/</span>
            <span>Tipos de Quartos</span>
          </div>
          
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark dark:text-white lg:text-4xl">
                Tipos de Quartos
              </h1>
              <p className="mt-2 text-body-color dark:text-dark-6">
                Gerencie os tipos de quartos e seus preços por ocupação
              </p>
            </div>
            
            {selectedHotelId && (
              <Link
                href={`/room-types/new?hotelId=${selectedHotelId}`}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Tipo de Quarto
              </Link>
            )}
          </div>
        </div>

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
            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-white p-4 shadow-lg dark:bg-dark-2">
                <p className="text-sm text-body-color dark:text-dark-6">Total</p>
                <p className="text-2xl font-bold text-dark dark:text-white">{stats.total}</p>
              </div>
              <div className="rounded-xl bg-green-50 p-4 shadow-lg dark:bg-green-900/10">
                <p className="text-sm text-green-700 dark:text-green-400">Ativos</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-300">{stats.active}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 shadow-lg dark:bg-gray-900/10">
                <p className="text-sm text-gray-700 dark:text-gray-400">Inativos</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-300">{stats.inactive}</p>
              </div>
            </div>

            <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl dark:bg-dark-2">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar por nome, código ou descrição..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 bg-white py-3 pl-12 pr-4 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                    <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-white shadow-xl dark:bg-dark-2">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-body-color dark:text-dark-6">Carregando tipos de quartos...</p>
                </div>
              </div>
            ) : filteredRoomTypes.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-xl dark:bg-dark-2">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                  <svg className="h-8 w-8 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                  Nenhum tipo de quarto encontrado
                </h3>
                <p className="mb-6 text-body-color dark:text-dark-6">
                  {searchTerm || activeFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca' 
                    : 'Comece criando o primeiro tipo de quarto deste hotel'}
                </p>
                {!searchTerm && activeFilter === 'all' && (
                  <Link
                    href={`/room-types/new?hotelId=${selectedHotelId}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Criar Primeiro Tipo de Quarto
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredRoomTypes.map((roomType) => (
                  <div
                    key={roomType.id}
                    className="group overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-dark-2"
                  >
                    <div className={`relative overflow-hidden p-6 ${roomType.active ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700' : 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600'}`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
                      
                      <div className="relative flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-white">
                            {roomType.name}
                          </h3>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                              {roomType.code}
                            </span>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold shadow-lg ${roomType.active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                              {roomType.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {roomType.description && (
                        <p className="mb-4 text-sm text-body-color dark:text-dark-6 line-clamp-2">
                          {roomType.description}
                        </p>
                      )}

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-3 dark:from-blue-900/20 dark:to-blue-800/20">
                            <div className="flex items-center gap-2">
                              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400">Capacidade</p>
                                <p className="text-lg font-bold text-blue-800 dark:text-blue-300">
                                  {roomType.capacityAdults + roomType.capacityChildren}
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                  {roomType.capacityAdults} adultos, {roomType.capacityChildren} crianças
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-3 dark:from-green-900/20 dark:to-green-800/20">
                            <div className="flex items-center gap-2">
                              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="text-xs text-green-600 dark:text-green-400">Preço Base</p>
                                <p className="text-lg font-bold text-green-800 dark:text-green-300">
                                  R$ {roomType.basePrice.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {roomType.occupancyPrices && roomType.occupancyPrices.length > 0 && (
                          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-dark-3 dark:bg-dark-3">
                            <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                              Preços por Ocupação:
                            </p>
                            <div className="space-y-1">
                              {roomType.occupancyPrices.slice(0, 3).map((price) => (
                                <div key={price.occupancy} className="flex justify-between text-xs">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {price.occupancy} {price.occupancy === 1 ? 'hóspede' : 'hóspedes'}
                                  </span>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    R$ {price.pricePerNight.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                              {roomType.occupancyPrices.length > 3 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  +{roomType.occupancyPrices.length - 3} mais
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex gap-3">
                        <Link
                          href={`/room-types/${roomType.id}/edit`}
                          className="group/btn flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                        >
                          <svg className="h-4 w-4 transition-transform group-hover/btn:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(roomType.id)}
                          className="rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 font-bold text-red-700 transition-all hover:border-red-400 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              Você precisa cadastrar um hotel antes de criar tipos de quartos
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

export default function RoomTypesPage() {
  return (
    <Suspense fallback={
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
    }>
      <RoomTypesPageContent />
    </Suspense>
  );
}
