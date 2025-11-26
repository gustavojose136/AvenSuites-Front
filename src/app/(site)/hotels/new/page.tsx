/**
 * Página: Novo Hotel
 */

'use client';

import { useRouter } from 'next/navigation';
import { useHotel } from '@/presentation/hooks/useHotel';
import { container } from '@/shared/di/Container';
import { HotelForm } from '@/presentation/components/Hotel/HotelForm';
import { showToast } from '@/shared/utils/toast';
import Breadcrumb from '@/components/Common/Breadcrumb';
import type { HotelCreateRequest } from '@/application/dto/Hotel.dto';
import type { HotelFormData } from '@/shared/validators/hotelSchema';

export default function NewHotelPage() {
  const router = useRouter();
  const { createHotel, loading } = useHotel(container.getHotelService());

  const handleSubmit = async (formData: HotelFormData) => {
    try {
      // Converte HotelFormData para HotelCreateRequest
      const apiRequest: HotelCreateRequest = {
        name: formData.name,
        tradeName: formData.tradeName || undefined,
        cnpj: formData.cnpj || undefined,
        email: formData.email,
        phoneE164: formData.phoneE164,
        timezone: formData.timezone || 'America/Sao_Paulo',
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode || undefined,
        countryCode: formData.countryCode || 'BR',
        status: 'ACTIVE',
      };
      
      const hotel = await createHotel(apiRequest);
      showToast.success(`Hotel "${hotel.name}" criado com sucesso!`);
      router.push(`/hotels/${hotel.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar hotel';
      showToast.error(message);
      throw error;
    }
  };

  return (
    <>
      <Breadcrumb 
        pageName="Novo Hotel"
        pageDescription="Cadastrar um novo hotel no sistema"
      />
      
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
              Cadastrar Novo Hotel
            </h1>
            <p className="text-body-color dark:text-dark-6">
              Preencha os dados abaixo para cadastrar um novo hotel no sistema.
            </p>
          </div>

          <HotelForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </section>
    </>
  );
}

