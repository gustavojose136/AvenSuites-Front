

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { hotelCreateSchema, type HotelFormData } from '@/shared/validators/hotelSchema';

interface HotelFormProps {
  onSubmit: (data: HotelFormData) => Promise<void>;
  initialData?: Partial<HotelFormData>;
  loading?: boolean;
  isEdit?: boolean;
}

export const HotelForm: React.FC<HotelFormProps> = ({
  onSubmit,
  initialData,
  loading = false,
  isEdit = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<HotelFormData>({
    resolver: zodResolver(hotelCreateSchema),
    defaultValues: initialData,
  });

  const isLoading = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Informações Básicas
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Nome do Hotel <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="Ex: Hotel Avenida"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Nome Fantasia
            </label>
            <input
              {...register('tradeName')}
              type="text"
              placeholder="Ex: Avenida Hotel & Spa"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.tradeName && (
              <p className="mt-1 text-sm text-red-500">{errors.tradeName.message}</p>
            )}
          </div>

          {}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              CNPJ <span className="text-red-500">*</span>
            </label>
            <input
              {...register('cnpj')}
              type="text"
              placeholder="00.000.000/0000-00"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.cnpj && (
              <p className="mt-1 text-sm text-red-500">{errors.cnpj.message}</p>
            )}
          </div>

          {}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Fuso Horário <span className="text-red-500">*</span>
            </label>
            <select
              {...register('timezone')}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            >
              <option value="America/Sao_Paulo">América/São Paulo (GMT-3)</option>
              <option value="America/Manaus">América/Manaus (GMT-4)</option>
              <option value="America/Rio_Branco">América/Rio Branco (GMT-5)</option>
            </select>
            {errors.timezone && (
              <p className="mt-1 text-sm text-red-500">{errors.timezone.message}</p>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Informações de Contato
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="contato@hotel.com"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Telefone <span className="text-red-500">*</span>
            </label>
            <input
              {...register('phoneE164')}
              type="tel"
              placeholder="+5511999999999"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.phoneE164 && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneE164.message}</p>
            )}
            <p className="mt-1 text-xs text-body-color dark:text-dark-6">
              Formato internacional: +55 (código do país) + DDD + número
            </p>
          </div>
        </div>
      </div>

      {}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Endereço
        </h3>

        <div className="space-y-4">
          {}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Endereço <span className="text-red-500">*</span>
            </label>
            <input
              {...register('addressLine1')}
              type="text"
              placeholder="Rua, Avenida, número"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.addressLine1 && (
              <p className="mt-1 text-sm text-red-500">{errors.addressLine1.message}</p>
            )}
          </div>

          {}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Complemento
            </label>
            <input
              {...register('addressLine2')}
              type="text"
              placeholder="Apartamento, sala, etc."
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.addressLine2 && (
              <p className="mt-1 text-sm text-red-500">{errors.addressLine2.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {}
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Cidade <span className="text-red-500">*</span>
              </label>
              <input
                {...register('city')}
                type="text"
                placeholder="São Paulo"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
                disabled={isLoading}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            {}
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Estado (UF) <span className="text-red-500">*</span>
              </label>
              <input
                {...register('state')}
                type="text"
                placeholder="SP"
                maxLength={2}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3 uppercase"
                disabled={isLoading}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>

            {}
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                CEP <span className="text-red-500">*</span>
              </label>
              <input
                {...register('postalCode')}
                type="text"
                placeholder="00000-000"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
                disabled={isLoading}
              />
              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          {}
          <div className="md:w-1/3">
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              País
            </label>
            <input
              {...register('countryCode')}
              type="text"
              placeholder="BR"
              maxLength={2}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3 uppercase"
              disabled={isLoading}
            />
            {errors.countryCode && (
              <p className="mt-1 text-sm text-red-500">{errors.countryCode.message}</p>
            )}
          </div>
        </div>
      </div>

      {}
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
            <span>{isEdit ? 'Atualizar Hotel' : 'Criar Hotel'}</span>
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

