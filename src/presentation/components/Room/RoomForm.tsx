/**
 * Component: RoomForm
 * Formulário completo de quarto com validação
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomCreateSchema, type RoomFormData } from '@/shared/validators/roomSchema';
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

interface RoomFormProps {
  hotelId: string;
  onSubmit: (data: RoomFormData) => Promise<void>;
  initialData?: Partial<RoomFormData>;
  loading?: boolean;
  isEdit?: boolean;
}

export const RoomForm: React.FC<RoomFormProps> = ({ 
  hotelId,
  onSubmit, 
  initialData,
  loading = false,
  isEdit = false,
}) => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [showRoomTypeInfo, setShowRoomTypeInfo] = useState(false);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);

  const { 
    register, 
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomCreateSchema),
    defaultValues: {
      hotelId,
      roomNumber: '',
      status: 'Available' as const,
      ...initialData,
    },
  });

  const roomTypeId = watch('roomTypeId');

  useEffect(() => {
    if (hotelId) {
      fetchRoomTypes();
    }
  }, [hotelId]);

  const fetchRoomTypes = async () => {
    try {
      setLoadingRoomTypes(true);
      const data = await httpClient.get<RoomType[]>(`/RoomTypes/hotel/${hotelId}?activeOnly=true`);
      setRoomTypes(data);
    } catch (error) {
      setRoomTypes([]);
    } finally {
      setLoadingRoomTypes(false);
    }
  };

  useEffect(() => {
    if (roomTypeId) {
      const roomType = roomTypes.find(rt => rt.id === roomTypeId);
      setSelectedRoomType(roomType || null);
    } else {
      setSelectedRoomType(null);
    }
  }, [roomTypeId, roomTypes]);

  // Atualiza o formulário quando initialData mudar (importante para edição)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset({
        hotelId,
        roomNumber: initialData.roomNumber || '',
        floor: initialData.floor ?? undefined,
        roomTypeId: initialData.roomTypeId ?? undefined,
        status: initialData.status || 'Available',
      });
    }
  }, [initialData, hotelId, reset]);

  const isLoading = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-dark-2">
        <h2 className="mb-6 text-xl font-bold text-dark dark:text-white">
          Informações do Quarto
        </h2>
        
        <div className="space-y-4">
          {/* Tipo de Quarto */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
              {isEdit ? 'Tipo de Quarto (opcional - alterar tipo)' : 'Tipo de Quarto *'}
            </label>
            <div className="relative">
              <select
                {...register('roomTypeId')}
                disabled={isLoading || loadingRoomTypes}
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 pr-10 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              >
                <option value="">{isEdit ? 'Manter tipo atual' : 'Selecione um tipo de quarto...'}</option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.code}) - R$ {type.basePrice.toFixed(2)}
                  </option>
                ))}
              </select>
              {roomTypeId && (
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
            {errors.roomTypeId && (
              <p className="mt-1 text-sm text-red-500">{errors.roomTypeId.message}</p>
            )}
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
            {/* Número do Quarto */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                Número do Quarto * (máx. 20 caracteres)
              </label>
              <input
                {...register('roomNumber')}
                type="text"
                placeholder="Ex: 101, 202, 301"
                maxLength={20}
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                disabled={isLoading}
              />
              {errors.roomNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.roomNumber.message}</p>
              )}
            </div>

            {/* Andar */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
                Andar (máx. 10 caracteres)
              </label>
              <input
                {...register('floor')}
                type="text"
                placeholder="Ex: 1, 2, 3"
                maxLength={10}
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                disabled={isLoading}
              />
              {errors.floor && (
                <p className="mt-1 text-sm text-red-500">{errors.floor.message}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              disabled={isLoading}
            >
              <option value="Available">Disponível</option>
              <option value="Maintenance">Manutenção</option>
              <option value="OutOfOrder">Inativo</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={isLoading}
          className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {isEdit ? 'Atualizando...' : 'Criando...'}
            </span>
          ) : (
            <span>{isEdit ? 'Atualizar Quarto' : 'Criar Quarto'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

