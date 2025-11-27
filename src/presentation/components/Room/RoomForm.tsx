/**
 * Component: RoomForm
 * Formulário completo de quarto com validação
 */

'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomCreateSchema, type RoomFormData } from '@/shared/validators/roomSchema';

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
  const { 
    register, 
    handleSubmit,
    reset,
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

  // Atualiza o formulário quando initialData mudar (importante para edição)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset({
        hotelId,
        roomNumber: initialData.roomNumber || '',
        floor: initialData.floor ?? undefined,
        roomTypeId: initialData.roomTypeId ?? undefined,
        status: initialData.status || 'Available',
        maxOccupancy: initialData.maxOccupancy ?? undefined,
        bedType: initialData.bedType ?? undefined,
        basePrice: initialData.basePrice ?? undefined,
        notes: initialData.notes ?? undefined,
      });
    }
  }, [initialData, hotelId, reset]);

  const isLoading = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Informações do Quarto
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Número do Quarto */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Número do Quarto <span className="text-red-500">*</span>
            </label>
            <input
              {...register('roomNumber')}
              type="text"
              placeholder="101"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.roomNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.roomNumber.message}</p>
            )}
          </div>

          {/* Andar */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Andar
            </label>
            <input
              {...register('floor', { valueAsNumber: true })}
              type="number"
              placeholder="1"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.floor && (
              <p className="mt-1 text-sm text-red-500">{errors.floor.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register('status')}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            >
              <option value="Available">Disponível</option>
              <option value="Occupied">Ocupado</option>
              <option value="Maintenance">Manutenção</option>
              <option value="OutOfOrder">Fora de Serviço</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          {/* Capacidade */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Capacidade (pessoas)
            </label>
            <input
              {...register('maxOccupancy', { valueAsNumber: true })}
              type="number"
              placeholder="2"
              min="1"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.maxOccupancy && (
              <p className="mt-1 text-sm text-red-500">{errors.maxOccupancy.message}</p>
            )}
          </div>

          {/* Tipo de Cama */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Tipo de Cama
            </label>
            <select
              {...register('bedType')}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            >
              <option value="">Selecione...</option>
              <option value="Single">Solteiro</option>
              <option value="Double">Casal</option>
              <option value="Queen">Queen</option>
              <option value="King">King</option>
              <option value="Twin">Twin</option>
            </select>
            {errors.bedType && (
              <p className="mt-1 text-sm text-red-500">{errors.bedType.message}</p>
            )}
          </div>

          {/* Preço Base */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Preço Base (R$)
            </label>
            <input
              {...register('basePrice', { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="200.00"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.basePrice && (
              <p className="mt-1 text-sm text-red-500">{errors.basePrice.message}</p>
            )}
          </div>
        </div>

        {/* Observações */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Observações
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Informações adicionais sobre o quarto..."
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
            disabled={isLoading}
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 md:flex-initial md:min-w-[200px]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Salvando...
            </span>
          ) : (
            <span>{isEdit ? 'Atualizar Quarto' : 'Criar Quarto'}</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={isLoading}
          className="rounded-lg border border-stroke bg-transparent px-6 py-3 font-medium text-dark transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

