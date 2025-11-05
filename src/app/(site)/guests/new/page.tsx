/**
 * Página: Novo Hóspede
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useGuest } from '@/presentation/hooks/useGuest';
import { container } from '@/shared/di/Container';
import { GuestForm } from '@/presentation/components/Guest/GuestForm';
import { showToast } from '@/shared/utils/toast';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { mapFormDataToApiRequest } from '@/shared/utils/guestMapper';
import { GuestFormData } from '@/shared/validators/guestSchema';
import { Suspense } from 'react';

function NewGuestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createGuest, loading } = useGuest(container.getGuestService());

  // Pega hotelId e returnTo da URL
  const hotelId = searchParams.get('hotelId') || '';
  const returnTo = searchParams.get('returnTo') || '/guests';

  const handleSubmit = async (formData: GuestFormData) => {
    if (!hotelId) {
      showToast.error('Hotel não especificado. Por favor, volte e tente novamente.');
      return;
    }

    try {
      // Adiciona o hotelId aos dados do formulário
      const formDataWithHotel = { ...formData, hotelId };
      
      // Transforma dados do formulário para o formato da API
      const apiRequest = mapFormDataToApiRequest(formDataWithHotel);
      
      console.log('📤 Enviando dados para API:', apiRequest);
      
      const guest = await createGuest(apiRequest);
      
      // Extrai nome do fullName para exibir no toast
      const guestName = guest.fullName || 'Hóspede';
      showToast.success(`Hóspede "${guestName}" cadastrado com sucesso!`);
      
      // Redireciona para a página de origem (returnTo) ou para a lista de hóspedes
      router.push(returnTo);
      router.refresh(); // Força refresh para atualizar a lista
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao cadastrar hóspede';
      showToast.error(message);
      console.error('❌ Erro ao cadastrar hóspede:', error);
      throw error;
    }
  };

  return (
    <>
      <Breadcrumb 
        pageName="Novo Hóspede"
        pages={[
          { name: 'Hóspedes', href: '/guests' },
          { name: 'Novo Hóspede', href: '/guests/new' },
        ]}
      />
      
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
              Cadastrar Novo Hóspede
            </h1>
            <p className="text-body-color dark:text-dark-6">
              Preencha os dados abaixo para cadastrar um novo hóspede no sistema.
            </p>
          </div>

          {hotelId ? (
            <GuestForm hotelId={hotelId} onSubmit={handleSubmit} loading={loading} />
          ) : (
            <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-center gap-3">
                <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-800 dark:text-yellow-300">Hotel não especificado</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">Por favor, acesse esta página através da tela de nova reserva.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function NewGuestPage() {
  return (
    <Suspense fallback={
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-body-color dark:text-dark-6">Carregando...</p>
            </div>
          </div>
        </div>
      </section>
    }>
      <NewGuestContent />
    </Suspense>
  );
}

