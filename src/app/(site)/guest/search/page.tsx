'use client';

import { useState, useEffect } from 'react';
import { httpClient } from '@/infrastructure/http/HttpClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Hotel {
  id: string;
  name: string;
  legalName?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export default function GuestSearchPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      console.log('🏨 Buscando hotéis disponíveis...');
      
      // Tenta primeiro com /Hotels
      let data: Hotel[] = [];
      try {
        data = await httpClient.get<Hotel[]>('/Hotels');
        console.log('✅ Hotéis recebidos de /Hotels:', data);
      } catch (err) {
        console.log('⚠️ Tentando endpoint /Hotel...');
        data = await httpClient.get<Hotel[]>('/Hotel');
        console.log('✅ Hotéis recebidos de /Hotel:', data);
      }
      
      console.log('📊 Total de hotéis recebidos:', data.length);
      console.log('📊 Estrutura do primeiro hotel:', data[0]);
      
      // Filtra apenas hotéis ativos
      const activeHotels = data.filter(h => {
        console.log(`Hotel ${h.name}: isActive = ${h.isActive}`);
        return h.isActive === true;
      });
      
      console.log('✅ Hotéis ativos:', activeHotels.length);
      setHotels(activeHotels);
      
      if (activeHotels.length === 0 && data.length > 0) {
        console.warn('⚠️ Há hotéis cadastrados mas nenhum está ativo!');
        toast('Nenhum hotel ativo encontrado. Exibindo todos...', { icon: 'ℹ️' });
        setHotels(data); // Mostra todos se nenhum estiver ativo
      }
    } catch (error) {
      console.error('❌ Erro ao buscar hotéis:', error);
      toast.error('Erro ao carregar hotéis disponíveis');
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSelect = (hotelId: string) => {
    if (!checkInDate || !checkOutDate) {
      toast.error('Por favor, selecione as datas de check-in e check-out');
      return;
    }

    // Valida datas
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      toast.error('A data de check-in não pode ser no passado');
      return;
    }

    if (checkOut <= checkIn) {
      toast.error('A data de check-out deve ser após o check-in');
      return;
    }

    // Redireciona para a página de registro com os dados
    const params = new URLSearchParams({
      hotelId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests.toString(),
    });
    router.push(`/guest/register?${params.toString()}`);
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Define data mínima como hoje
  const today = new Date().toISOString().split('T')[0];
  const minCheckOut = checkInDate || today;

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:via-dark-2 dark:to-dark py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-black text-dark dark:text-white md:text-5xl">
            Encontre seu <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Hotel Perfeito</span>
          </h1>
          <p className="text-lg text-body-color dark:text-dark-6">
            Escolha as datas da sua estadia e descubra os melhores hotéis disponíveis
          </p>
        </div>

        {/* Search Box com Calendário Visual */}
        <div className="mx-auto mb-12 max-w-6xl">
          <div className="rounded-2xl border-2 border-white bg-white p-6 shadow-2xl dark:border-dark-3 dark:bg-dark-2 md:p-8">
            {/* Calendário Visual de Preview */}
            {checkInDate && checkOutDate && (
              <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 to-blue-600/5 p-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  {/* Check-in Visual */}
                  <div className="flex-1 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      CHECK-IN
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-md dark:bg-dark-2">
                      <p className="text-xs text-body-color dark:text-dark-6">
                        {new Date(checkInDate).toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}
                      </p>
                      <p className="text-3xl font-black text-dark dark:text-white">
                        {new Date(checkInDate).getDate()}
                      </p>
                      <p className="text-sm font-semibold text-body-color dark:text-dark-6">
                        {new Date(checkInDate).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Seta e Noites */}
                  <div className="flex flex-col items-center gap-2">
                    <svg className="h-8 w-8 text-primary md:rotate-0 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="rounded-full bg-gradient-to-r from-primary to-blue-600 px-4 py-2">
                      <p className="text-sm font-bold text-white">
                        {calculateNights()} {calculateNights() === 1 ? 'noite' : 'noites'}
                      </p>
                    </div>
                  </div>

                  {/* Check-out Visual */}
                  <div className="flex-1 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-blue-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      CHECK-OUT
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-md dark:bg-dark-2">
                      <p className="text-xs text-body-color dark:text-dark-6">
                        {new Date(checkOutDate).toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}
                      </p>
                      <p className="text-3xl font-black text-dark dark:text-white">
                        {new Date(checkOutDate).getDate()}
                      </p>
                      <p className="text-sm font-semibold text-body-color dark:text-dark-6">
                        {new Date(checkOutDate).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
              {/* Check-in */}
              <div>
                <label className="mb-2 block text-sm font-bold text-dark dark:text-white">
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Check-in
                  </span>
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={today}
                  className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                />
              </div>

              {/* Check-out */}
              <div>
                <label className="mb-2 block text-sm font-bold text-dark dark:text-white">
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Check-out
                  </span>
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={minCheckOut}
                  className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                />
              </div>

              {/* Hóspedes */}
              <div>
                <label className="mb-2 block text-sm font-bold text-dark dark:text-white">
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Hóspedes
                  </span>
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'pessoa' : 'pessoas'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Hotéis */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-body-color dark:text-dark-6">Carregando hotéis...</p>
            </div>
          </div>
        ) : hotels.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-xl dark:bg-dark-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
              <svg className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
              Nenhum hotel disponível
            </h3>
            <p className="text-body-color dark:text-dark-6">
              No momento não há hotéis cadastrados no sistema.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-dark-2"
              >
                {/* Header com Gradiente */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-24 w-24 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <h3 className="mb-2 text-2xl font-bold text-dark dark:text-white">
                    {hotel.name}
                  </h3>
                  
                  {/* Informações */}
                  <div className="mb-4 space-y-2">
                    {hotel.city && hotel.state && (
                      <div className="flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
                        <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {hotel.city}, {hotel.state}
                      </div>
                    )}
                    
                    {hotel.phone && (
                      <div className="flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
                        <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {hotel.phone}
                      </div>
                    )}
                  </div>

                  {/* Botão */}
                  <button
                    onClick={() => handleHotelSelect(hotel.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Selecionar Hotel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Link de Volta */}
        <div className="mt-12 text-center">
          <Link
            href="/user-type"
            className="inline-flex items-center gap-2 text-body-color transition-colors hover:text-primary dark:text-dark-6 dark:hover:text-primary"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </Link>
        </div>
      </div>
    </section>
  );
}

