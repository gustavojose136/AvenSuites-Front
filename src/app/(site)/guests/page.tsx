/**
 * Gerenciador de Hóspedes - AvenSuites
 * Lista, visualiza, edita e cria hóspedes
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { httpClient } from '@/infrastructure/http/HttpClient';

interface Hotel {
  id: string;
  tradingName: string;
  city: string;
  state: string;
}

interface Guest {
  id: string;
  hotelId: string;
  fullName: string;
  email: string;
  phone: string;
  documentNumber: string;
  documentType: 'CPF' | 'RG' | 'CNH' | 'PASSPORT';
  dateOfBirth?: string;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
  createdAt: string;
}

export default function GuestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchHotels();
      fetchGuests();
    }
  }, [status]);

  useEffect(() => {
    if (selectedHotelId && selectedHotelId !== 'all') {
      fetchGuests(selectedHotelId);
    } else if (selectedHotelId === 'all') {
      fetchGuests();
    }
  }, [selectedHotelId]);

  const fetchHotels = async () => {
    try {
      console.log('🏨 Buscando hotéis...');
      const data = await httpClient.get<Hotel[]>('/Hotels');
      console.log('✅ Hotéis recebidos:', data);
      setHotels(data);
    } catch (error) {
      console.error('❌ Erro ao buscar hotéis:', error);
      toast.error('Erro ao carregar hotéis');
    }
  };

  const fetchGuests = async (hotelId?: string) => {
    setLoading(true);
    try {
      console.log('👥 Buscando hóspedes...');
      const endpoint = hotelId ? `/Guests?hotelId=${hotelId}` : '/Guests';
      const data = await httpClient.get<Guest[]>(endpoint);
      console.log('✅ Hóspedes recebidos:', data);
      setGuests(data);
    } catch (error) {
      console.error('❌ Erro ao buscar hóspedes:', error);
      toast.error('Erro ao carregar hóspedes');
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter(guest => {
    const searchLower = searchTerm.toLowerCase();
    return (
      guest.fullName?.toLowerCase().includes(searchLower) ||
      guest.email?.toLowerCase().includes(searchLower) ||
      guest.phone?.toLowerCase().includes(searchLower) ||
      guest.documentNumber?.toLowerCase().includes(searchLower)
    );
  });

  const getHotelName = (hotelId: string) => {
    const hotel = hotels.find(h => h.id === hotelId);
    return hotel ? hotel.tradingName : 'N/A';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDocument = (doc?: string, type?: string) => {
    if (!doc) return 'N/A';
    if (type === 'CPF' && doc.length === 11) {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return doc;
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
        
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
            <span>/</span>
            <span>Hóspedes</span>
          </div>
          
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark dark:text-white lg:text-4xl">
                Gerenciador de Hóspedes
              </h1>
              <p className="mt-2 text-body-color dark:text-dark-6">
                Gerencie todos os hóspedes cadastrados
              </p>
            </div>
            
            <Link
              href="/guests/new"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-105"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Novo Hóspede
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-dark-2">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-body-color dark:text-dark-6">Total</p>
                <p className="text-2xl font-bold text-dark dark:text-white">{guests.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white/20 p-3">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-100">Ativos</p>
                <p className="text-2xl font-bold">{guests.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white/20 p-3">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-green-100">Com E-mail</p>
                <p className="text-2xl font-bold">{guests.filter(g => g.email).length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white/20 p-3">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-orange-100">Com Telefone</p>
                <p className="text-2xl font-bold">{guests.filter(g => g.phone).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl dark:bg-dark-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail, telefone ou documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white py-3 pl-12 pr-4 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
                <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filtro de Hotel */}
            <div>
              <select
                value={selectedHotelId}
                onChange={(e) => setSelectedHotelId(e.target.value)}
                className="rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              >
                <option value="all">Todos os Hotéis</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.tradingName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Hóspedes */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-white shadow-xl dark:bg-dark-2">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-body-color dark:text-dark-6">Carregando hóspedes...</p>
            </div>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-xl dark:bg-dark-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
              <svg className="h-8 w-8 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
              Nenhum hóspede encontrado
            </h3>
            <p className="mb-6 text-body-color dark:text-dark-6">
              {searchTerm 
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece cadastrando o primeiro hóspede'}
            </p>
            {!searchTerm && (
              <Link
                href="/guests/new"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Cadastrar Primeiro Hóspede
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGuests.map((guest) => (
              <div
                key={guest.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-dark-2"
              >
                {/* Header do Card */}
                <div className="border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-600 p-6 dark:border-dark-3">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">
                        {guest.fullName}
                      </h3>
                      <p className="mt-1 text-sm text-purple-100">
                        {getHotelName(guest.hotelId)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6">
                  <div className="space-y-3">
                    {/* E-mail */}
                    {guest.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="h-5 w-5 flex-shrink-0 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate text-body-color dark:text-dark-6">{guest.email}</span>
                      </div>
                    )}

                    {/* Telefone */}
                    {guest.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="h-5 w-5 flex-shrink-0 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-body-color dark:text-dark-6">{guest.phone}</span>
                      </div>
                    )}

                    {/* Documento */}
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="h-5 w-5 flex-shrink-0 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <span className="text-body-color dark:text-dark-6">
                        {guest.documentType}: {formatDocument(guest.documentNumber, guest.documentType)}
                      </span>
                    </div>

                    {/* Data de Nascimento */}
                    {guest.dateOfBirth && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="h-5 w-5 flex-shrink-0 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-body-color dark:text-dark-6">
                          Nascimento: {formatDate(guest.dateOfBirth)}
                        </span>
                      </div>
                    )}

                    {/* Endereço */}
                    {guest.city && guest.state && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="h-5 w-5 flex-shrink-0 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-body-color dark:text-dark-6">
                          {guest.city}/{guest.state}
                        </span>
                      </div>
                    )}

                    {/* Cadastro */}
                    <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-dark-3">
                      <p className="text-xs text-body-color dark:text-dark-6">
                        Cadastrado em: {formatDate(guest.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="mt-6 flex gap-2">
                    <Link
                      href={`/guests/${guest.id}`}
                      className="flex-1 rounded-lg border-2 border-gray-300 py-2 text-center font-semibold text-dark transition hover:border-primary hover:text-primary dark:border-dark-3 dark:text-white"
                    >
                      Ver Detalhes
                    </Link>
                    <Link
                      href={`/guests/${guest.id}/edit`}
                      className="flex-1 rounded-lg bg-primary py-2 text-center font-semibold text-white transition hover:bg-primary/90"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
