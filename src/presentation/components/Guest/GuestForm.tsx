/**
 * Component: GuestForm
 * Formulário completo de hóspede com validação
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { guestCreateSchema, type GuestFormData } from '@/shared/validators/guestSchema';
import { GuestCreateRequest } from '@/application/dto/Guest.dto';

interface GuestFormProps {
  hotelId: string;
  onSubmit: (data: GuestCreateRequest) => Promise<void>;
  initialData?: Partial<GuestFormData>;
  loading?: boolean;
  isEdit?: boolean;
}

export const GuestForm: React.FC<GuestFormProps> = ({ 
  hotelId,
  onSubmit, 
  initialData,
  loading = false,
  isEdit = false,
}) => {
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestCreateSchema),
    defaultValues: {
      ...initialData,
      hotelId,
      documentType: initialData?.documentType || 'CPF',
      countryCode: initialData?.countryCode || 'BR',
      marketingConsent: initialData?.marketingConsent || false,
    },
  });

  const documentType = watch('documentType');
  const isLoading = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dados Pessoais */}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Dados Pessoais
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Nome */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              {...register('firstName')}
              type="text"
              placeholder="João"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          {/* Sobrenome */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Sobrenome <span className="text-red-500">*</span>
            </label>
            <input
              {...register('lastName')}
              type="text"
              placeholder="Silva"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          {/* Data de Nascimento */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Data de Nascimento <span className="text-red-500">*</span>
            </label>
            <input
              {...register('birthDate')}
              type="date"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-500">{errors.birthDate.message}</p>
            )}
            <p className="mt-1 text-xs text-body-color dark:text-dark-6">
              Hóspede deve ter 18 anos ou mais
            </p>
          </div>

          {/* País */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              País
            </label>
            <select
              {...register('countryCode')}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            >
              <option value="BR">Brasil</option>
              <option value="US">Estados Unidos</option>
              <option value="AR">Argentina</option>
              <option value="UY">Uruguai</option>
              <option value="PY">Paraguai</option>
              <option value="CL">Chile</option>
              <option value="PT">Portugal</option>
              <option value="ES">Espanha</option>
            </select>
            {errors.countryCode && (
              <p className="mt-1 text-sm text-red-500">{errors.countryCode.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Documentação */}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Documentação
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Tipo de Documento */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Tipo de Documento <span className="text-red-500">*</span>
            </label>
            <select
              {...register('documentType')}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            >
              <option value="CPF">CPF</option>
              <option value="RG">RG</option>
              <option value="CNH">CNH</option>
              <option value="Passport">Passaporte</option>
            </select>
            {errors.documentType && (
              <p className="mt-1 text-sm text-red-500">{errors.documentType.message}</p>
            )}
          </div>

          {/* Número do Documento */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Número do Documento <span className="text-red-500">*</span>
            </label>
            <input
              {...register('documentNumber')}
              type="text"
              placeholder={documentType === 'CPF' ? '000.000.000-00' : 'Número do documento'}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.documentNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.documentNumber.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Informações de Contato
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="joao@email.com"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Telefone */}
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

      {/* Endereço (Opcional) */}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Endereço <span className="text-sm font-normal text-body-color">(Opcional)</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Endereço
            </label>
            <input
              {...register('address')}
              type="text"
              placeholder="Rua, Avenida, número"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Complemento
            </label>
            <input
              {...register('addressLine2')}
              type="text"
              placeholder="Apto, Bloco, Sala (opcional)"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Cidade
              </label>
              <input
                {...register('city')}
                type="text"
                placeholder="São Paulo"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Estado
              </label>
              <input
                {...register('state')}
                type="text"
                placeholder="SP"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                CEP
              </label>
              <input
                {...register('postalCode')}
                type="text"
                placeholder="00000-000"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Consentimentos */}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Consentimentos
        </h3>
        
        <div className="flex items-start gap-3">
          <input
            {...register('marketingConsent')}
            type="checkbox"
            id="marketingConsent"
            className="mt-1 h-5 w-5 rounded border-stroke text-primary focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3"
            disabled={isLoading}
          />
          <label htmlFor="marketingConsent" className="cursor-pointer text-sm text-dark dark:text-white">
            <span className="font-medium">Aceito receber comunicações de marketing</span>
            <p className="mt-1 text-xs text-body-color dark:text-dark-6">
              Concordo em receber e-mails promocionais, ofertas especiais e novidades sobre o hotel.
              Você pode cancelar a qualquer momento.
            </p>
          </label>
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
            <span>{isEdit ? 'Atualizar Hóspede' : 'Cadastrar Hóspede'}</span>
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

