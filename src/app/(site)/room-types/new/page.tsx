'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { httpClient } from '@/infrastructure/http/HttpClient';

interface Hotel {
  id: string;
  tradingName: string;
  city: string;
  state: string;
}

interface OccupancyPrice {
  occupancy: number;
  pricePerNight: number;
}

interface RoomTypeFormData {
  hotelId: string;
  code: string;
  name: string;
  description: string;
  capacityAdults: number;
  capacityChildren: number;
  basePrice: number;
  active: boolean;
  occupancyPrices: OccupancyPrice[];
}

function NewRoomTypePageContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<RoomTypeFormData>({
    hotelId: searchParams.get('hotelId') || '',
    code: '',
    name: '',
    description: '',
    capacityAdults: 2,
    capacityChildren: 0,
    basePrice: 0,
    active: true,
    occupancyPrices: [],
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchHotels();
    }
  }, [status]);

  const fetchHotels = async () => {
    try {
      const data = await httpClient.get<Hotel[]>('/Hotels');
      setHotels(data);
      
      if (data.length > 0 && !formData.hotelId) {
        setFormData(prev => ({ ...prev, hotelId: data[0].id }));
      }
    } catch (error) {
      toast.error('Erro ao carregar hotéis');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? (value === '' ? 0 : parseFloat(value)) :
              value
    }));
  };

  const handleAddOccupancyPrice = () => {
    setFormData(prev => ({
      ...prev,
      occupancyPrices: [
        ...prev.occupancyPrices,
        { occupancy: 1, pricePerNight: 0 }
      ]
    }));
  };

  const handleRemoveOccupancyPrice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      occupancyPrices: prev.occupancyPrices.filter((_, i) => i !== index)
    }));
  };

  const handleOccupancyPriceChange = (index: number, field: 'occupancy' | 'pricePerNight', value: number) => {
    setFormData(prev => ({
      ...prev,
      occupancyPrices: prev.occupancyPrices.map((price, i) => 
        i === index ? { ...price, [field]: value } : price
      )
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.hotelId) {
      toast.error('Selecione um hotel');
      return false;
    }
    if (!formData.code.trim()) {
      toast.error('O código é obrigatório');
      return false;
    }
    if (formData.code.length > 30) {
      toast.error('O código deve ter no máximo 30 caracteres');
      return false;
    }
    if (!formData.name.trim()) {
      toast.error('O nome é obrigatório');
      return false;
    }
    if (formData.name.length > 120) {
      toast.error('O nome deve ter no máximo 120 caracteres');
      return false;
    }
    if (formData.basePrice < 0) {
      toast.error('O preço base deve ser maior ou igual a zero');
      return false;
    }
    
    for (const price of formData.occupancyPrices) {
      if (price.occupancy < 1 || price.occupancy > 20) {
        toast.error('A ocupação deve estar entre 1 e 20 pessoas');
        return false;
      }
      if (price.pricePerNight < 0) {
        toast.error('O preço por noite deve ser maior ou igual a zero');
        return false;
      }
    }

    const occupancies = formData.occupancyPrices.map(p => p.occupancy);
    if (new Set(occupancies).size !== occupancies.length) {
      toast.error('Não é possível ter preços duplicados para a mesma ocupação');
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
        code: formData.code.trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        capacityAdults: formData.capacityAdults,
        capacityChildren: formData.capacityChildren,
        basePrice: formData.basePrice,
        active: formData.active,
        occupancyPrices: formData.occupancyPrices.length > 0 ? formData.occupancyPrices : undefined,
      };

      await httpClient.post('/RoomTypes', payload);
      toast.success('Tipo de quarto criado com sucesso!');
      router.push(`/room-types?hotelId=${formData.hotelId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar tipo de quarto');
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
            <Link href="/room-types" className="hover:text-primary">Tipos de Quartos</Link>
            <span>/</span>
            <span>Novo</span>
          </div>
          
          <h1 className="text-3xl font-bold text-dark dark:text-white lg:text-4xl">
            Novo Tipo de Quarto
          </h1>
          <p className="mt-2 text-body-color dark:text-dark-6">
            Crie um novo tipo de quarto e configure seus preços por ocupação
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-dark-2">
            <h2 className="mb-6 text-xl font-bold text-dark dark:text-white">
              Informações Básicas
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                  Hotel *
                </label>
                <select
                  name="hotelId"
                  value={formData.hotelId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                  <option value="">Selecione um hotel...</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.tradingName} - {hotel.city}/{hotel.state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                    Código * (máx. 30 caracteres)
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    maxLength={30}
                    placeholder="Ex: STD, DLX, SUITE"
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                    Nome * (máx. 120 caracteres)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={120}
                    placeholder="Ex: Standard, Deluxe, Suíte"
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Descreva as características do tipo de quarto..."
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                    Capacidade de Adultos
                  </label>
                  <input
                    type="number"
                    name="capacityAdults"
                    value={formData.capacityAdults}
                    onChange={handleChange}
                    min={1}
                    max={20}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                    Capacidade de Crianças
                  </label>
                  <input
                    type="number"
                    name="capacityChildren"
                    value={formData.capacityChildren}
                    onChange={handleChange}
                    min={0}
                    max={20}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                    Preço Base (R$) *
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleChange}
                    required
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="active" className="text-sm font-medium text-dark dark:text-white">
                  Tipo de quarto ativo
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-dark-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-dark dark:text-white">
                  Preços por Ocupação
                </h2>
                <p className="mt-1 text-sm text-body-color dark:text-dark-6">
                  Configure preços específicos baseados na quantidade de hóspedes (opcional)
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddOccupancyPrice}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Adicionar Preço
              </button>
            </div>

            {formData.occupancyPrices.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-dark-3">
                <p className="text-sm text-body-color dark:text-dark-6">
                  Nenhum preço por ocupação configurado. O preço base será usado para todas as ocupações.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.occupancyPrices.map((price, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border-2 border-gray-200 bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3"
                  >
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Ocupação (1-20 pessoas)
                      </label>
                      <input
                        type="number"
                        value={price.occupancy}
                        onChange={(e) => handleOccupancyPriceChange(index, 'occupancy', parseInt(e.target.value) || 1)}
                        min={1}
                        max={20}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Preço por Noite (R$)
                      </label>
                      <input
                        type="number"
                        value={price.pricePerNight}
                        onChange={(e) => handleOccupancyPriceChange(index, 'pricePerNight', parseFloat(e.target.value) || 0)}
                        min={0}
                        step="0.01"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveOccupancyPrice(index)}
                      className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Link
              href={`/room-types${formData.hotelId ? `?hotelId=${formData.hotelId}` : ''}`}
              className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
            >
              {submitting ? 'Salvando...' : 'Criar Tipo de Quarto'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function NewRoomTypePage() {
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
      <NewRoomTypePageContent />
    </Suspense>
  );
}
