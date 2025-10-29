/**
 * Página: Novo Hóspede
 */

'use client';

import { useRouter } from 'next/navigation';
import { useGuest } from '@/presentation/hooks/useGuest';
import { container } from '@/shared/di/Container';
import { GuestForm } from '@/presentation/components/Guest/GuestForm';
import { showToast } from '@/shared/utils/toast';
import Breadcrumb from '@/components/Common/Breadcrumb';
import type { GuestCreateRequest } from '@/application/dto/Guest.dto';

export default function NewGuestPage() {
  const router = useRouter();
  const { createGuest, loading } = useGuest(container.getGuestService());

  // TODO: Pegar hotelId do contexto ou sessão do usuário
  const hotelId = 'temp-hotel-id'; // Temporário

  const handleSubmit = async (data: GuestCreateRequest) => {
    try {
      const guest = await createGuest(data);
      showToast.success(`Hóspede "${guest.firstName} ${guest.lastName}" cadastrado com sucesso!`);
      router.push(`/guests/${guest.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao cadastrar hóspede';
      showToast.error(message);
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

          <GuestForm hotelId={hotelId} onSubmit={handleSubmit} loading={loading} />
        </div>
      </section>
    </>
  );
}

