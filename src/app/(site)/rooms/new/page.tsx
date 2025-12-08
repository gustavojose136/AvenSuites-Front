'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { httpClient } from '@/infrastructure/http/HttpClient';

interface RoomType {
  id: string;
  code: string;
  name: string;
  description?: string;
  capacityAdults: number;
  capacityChildren: number;
  basePrice: number;
  active: boolean;
  occupancyPrices?: {
    occupancy: number;
    pricePerNight: number;
  }[];
}

interface RoomFormData {
  hotelId: string;
  roomTypeId: string;
  roomNumber: string;
  floor: string;
  status: string;
}

function NewRoomPageContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [showRoomTypeInfo, setShowRoomTypeInfo] = useState(false);

  const [formData, setFormData] = useState<RoomFormData>({
    hotelId: searchParams.get('hotelId') || '',
    roomTypeId: '',
    roomNumber: '',
    floor: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (status === 'authenticated' && formData.hotelId) {
      fetchRoomTypes();
    }
  }, [status, formData.hotelId]);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const data = await httpClient.get<RoomType[]>(`/RoomTypes/hotel/${formData.hotelId}?activeOnly=true`);
      setRoomTypes(data);
    } catch (error) {
      toast.error('Erro ao carregar tipos de quartos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.roomTypeId) {
      const roomType = roomTypes.find(rt => rt.id === formData.roomTypeId);
      setSelectedRoomType(roomType || null);
    } else {
      setSelectedRoomType(null);
    }
  }, [formData.roomTypeId, roomTypes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.hotelId) {
      toast.error('Selecione um hotel');
      return false;
    }
    if (!formData.roomTypeId) {
      toast.error('Selecione um tipo de quarto');
      return false;
    }
    if (!formData.roomNumber.trim()) {
      toast.error('O número do quarto é obrigatório');
      return false;
    }
    if (formData.roomNumber.length > 20) {
      toast.error('O número do quarto deve ter no máximo 20 caracteres');
      return false;
    }
    if (formData.floor && formData.floor.length > 10) {
      toast.error('O andar deve ter no máximo 10 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        hotelId: formData.hotelId,
        roomTypeId: formData.roomTypeId,
        roomNumber: formData.roomNumber.trim(),
        floor: formData.floor.trim() || undefined,
        status: formData.status,
      };

      await httpClient.post('/Rooms', payload);
      toast.success('Quarto criado com sucesso!');
      router.push(`/rooms?hotelId=${formData.hotelId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar quarto');
    } finally {
      setSubmitting(false);
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

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:to-dark-2 py-20">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
            <span>/</span>
            <Link href="/rooms" className="hover:text-primary">Quartos</Link>
            <span>/</span>
            <span>Novo</span>
          </div>

          <h1 className="text-3xl font-bold text-dark dark:text-white lg:text-4xl">
            Novo Quarto
          </h1>
          <p className="mt-2 text-body-color dark:text-dark-6">
            Crie um novo quarto e associe a um tipo de quarto
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-dark-2">
            <h2 className="mb-6 text-xl font-bold text-dark dark:text-white">
              Informações do Quarto
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                  Hotel ID
                </label>
                <input
                  type="text"
                  value={formData.hotelId}
                  disabled
                  className="w-full rounded-lg border-2 border-gray-300 bg-gray-100 px-4 py-3 text-dark opacity-60 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                  Tipo de Quarto *
                </label>
                <div className="relative">
                  <select
                    name="roomTypeId"
                    value={formData.roomTypeId}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 pr-10 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  >
                    <option value="">Selecione um tipo de quarto...</option>
                    {roomTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} ({type.code}) - R$ {type.basePrice.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  {formData.roomTypeId && (
                    <button
                      type="button"
                      onClick={() => setShowRoomTypeInfo(!showRoomTypeInfo)}
                      className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-primary hover:bg-primary/10 transition"
                      title="Ver informações do tipo de quarto"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                </div>
                {showRoomTypeInfo && selectedRoomType && (
                  <div className="mt-3 rounded-lg border-2 border-primary/20 bg-primary/5 p-4 dark:bg-primary/10">
                    <h4 className="mb-2 font-semibold text-dark dark:text-white">
                      {selectedRoomType.name} ({selectedRoomType.code})
                    </h4>
                    {selectedRoomType.description && (
                      <p className="mb-3 text-sm text-body-color dark:text-dark-6">
                        {selectedRoomType.description}
                      </p>
                    )}
                    <div className="mb-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-body-color dark:text-dark-6">Capacidade</p>
                        <p className="font-semibold text-dark dark:text-white">
                          {selectedRoomType.capacityAdults + selectedRoomType.capacityChildren} pessoas
                        </p>
                        <p className="text-xs text-body-color dark:text-dark-6">
                          {selectedRoomType.capacityAdults} adultos, {selectedRoomType.capacityChildren} crianças
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-body-color dark:text-dark-6">Preço Base</p>
                        <p className="font-semibold text-dark dark:text-white">
                          R$ {selectedRoomType.basePrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {selectedRoomType.occupancyPrices && selectedRoomType.occupancyPrices.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold text-body-color dark:text-dark-6">
                          Preços por Ocupação:
                        </p>
                        <div className="space-y-1">
                          {selectedRoomType.occupancyPrices.map((price) => (
                            <div key={price.occupancy} className="flex justify-between text-sm">
                              <span className="text-body-color dark:text-dark-6">
                                {price.occupancy} {price.occupancy === 1 ? 'hóspede' : 'hóspedes'}
                              </span>
                              <span className="font-semibold text-dark dark:text-white">
                                R$ {price.pricePerNight.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                    Número do Quarto * (máx. 20 caracteres)
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    required
                    maxLength={20}
                    placeholder="Ex: 101, 202, 301"
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                    Andar (máx. 10 caracteres)
                  </label>
                  <input
                    type="text"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Ex: 1, 2, 3"
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                  <option value="ACTIVE">Disponível</option>
                  <option value="MAINTENANCE">Manutenção</option>
                  <option value="INACTIVE">Inativo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href={`/rooms${formData.hotelId ? `?hotelId=${formData.hotelId}` : ''}`}
              className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting || loading}
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
            >
              {submitting ? 'Criando...' : 'Criar Quarto'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function NewRoomPage() {
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
      <NewRoomPageContent />
    </Suspense>
  );
}

