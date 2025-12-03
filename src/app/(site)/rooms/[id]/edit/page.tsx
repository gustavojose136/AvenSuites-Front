/**
 * Página: Editar Quarto
 */

'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/presentation/hooks/useRoom';
import { container } from '@/shared/di/Container';
import { RoomForm } from '@/presentation/components/Room/RoomForm';
import { showToast } from '@/shared/utils/toast';
import Breadcrumb from '@/components/Common/Breadcrumb';
import type { RoomFormData } from '@/shared/validators/roomSchema';
import type { RoomUpdateRequest } from '@/application/dto/Room.dto';

/**
 * Mapeia o status da API para o formato do formulário
 */
const mapStatusToForm = (status: string): 'Available' | 'Occupied' | 'Maintenance' | 'OutOfOrder' => {
  const statusMap: Record<string, 'Available' | 'Occupied' | 'Maintenance' | 'OutOfOrder'> = {
    'ACTIVE': 'Available',
    'OCCUPIED': 'Occupied',
    'MAINTENANCE': 'Maintenance',
    'CLEANING': 'Maintenance', // Cleaning não existe no form, usa Maintenance
    'INACTIVE': 'OutOfOrder',
  };
  return statusMap[status] || 'Available';
};

/**
 * Mapeia o status do formulário para o formato da API
 */
const mapStatusToApi = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Available': 'ACTIVE',
    'Occupied': 'OCCUPIED',
    'Maintenance': 'MAINTENANCE',
    'OutOfOrder': 'INACTIVE',
  };
  return statusMap[status] || 'ACTIVE';
};

/**
 * Converte Room DTO para RoomFormData
 */
const mapRoomToFormData = (room: any): Partial<RoomFormData> => {
  return {
    roomNumber: room.roomNumber,
    floor: room.floor ? (typeof room.floor === 'string' ? parseInt(room.floor) : room.floor) : undefined,
    roomTypeId: room.roomTypeId || undefined,
    status: mapStatusToForm(room.status),
    // Campos que não existem no DTO mas podem estar no form
    maxOccupancy: undefined,
    bedType: undefined,
    basePrice: undefined,
    notes: undefined,
  };
};

/**
 * Converte RoomFormData para RoomUpdateRequest
 */
const mapFormDataToUpdateRequest = (formData: RoomFormData): RoomUpdateRequest => {
  const updateRequest: RoomUpdateRequest = {};
  
  if (formData.roomNumber) {
    updateRequest.roomNumber = formData.roomNumber;
  }
  
  if (formData.floor !== null && formData.floor !== undefined) {
    updateRequest.floor = String(formData.floor);
  }
  
  if (formData.roomTypeId) {
    updateRequest.roomTypeId = formData.roomTypeId;
  }
  
  if (formData.status) {
    updateRequest.status = mapStatusToApi(formData.status);
  }
  
  return updateRequest;
};

export default function EditRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { selectedRoom, loading, error, fetchRoomById, updateRoom } = useRoom(container.getRoomService());

  useEffect(() => {
    if (params.id) {
      fetchRoomById(params.id).catch((err) => {
        console.error('❌ Erro ao buscar quarto:', err);
      });
    }
  }, [params.id, fetchRoomById]);

  // Mapeia os dados do quarto para o formato do formulário
  const initialFormData = useMemo(() => {
    if (!selectedRoom) {
      return undefined;
    }
    const formData = mapRoomToFormData(selectedRoom);
    return formData;
  }, [selectedRoom]);

  /**
   * Extrai mensagem de erro da resposta da API
   * Seguindo SOLID: responsabilidade única de extração de mensagens
   */
  const extractErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      // Verifica se é um erro de permissão (403) ou não autorizado (401)
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('forbidden') || errorMessage.includes('403')) {
        return 'Você não tem permissão para editar este quarto';
      }
      if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
        return 'Sessão expirada. Por favor, faça login novamente';
      }
      return error.message;
    }
    
    // Tenta extrair mensagem de erro da resposta HTTP
    if (typeof error === 'object' && error !== null) {
      const httpError = error as any;
      if (httpError.response?.data?.message) {
        return httpError.response.data.message;
      }
      if (typeof httpError.response?.data === 'string') {
        return httpError.response.data;
      }
    }
    
    return 'Erro ao atualizar quarto. Tente novamente';
  };

  /**
   * Handler de submissão do formulário
   * Seguindo SOLID: responsabilidade única de orquestração
   */
  const handleSubmit = async (formData: RoomFormData) => {
    if (!selectedRoom) {
      showToast.error('Quarto não encontrado');
      return;
    }

    try {
      // Converte os dados do formulário para o formato da API
      const updateRequest = mapFormDataToUpdateRequest(formData);
        updateRequest 
      });
      
      // Valida se há pelo menos um campo para atualizar
      if (Object.keys(updateRequest).length === 0) {
        showToast.error('Nenhuma alteração foi feita');
        return;
      }
      
      // Deixa o backend validar permissões e retornar erro se necessário
      await updateRoom(params.id, updateRequest);
      
      showToast.success(`Quarto "${formData.roomNumber || selectedRoom.roomNumber}" atualizado com sucesso!`);
      
      // Redireciona para a página de detalhes do quarto
      router.push(`/rooms/${params.id}`);
      router.refresh();
    } catch (error) {
      // Extrai mensagem de erro (backend pode retornar erro de permissão)
      const errorMessage = extractErrorMessage(error);
      showToast.error(errorMessage);
      console.error('❌ Erro ao atualizar quarto:', error);
      // Não faz throw para não quebrar o formulário
    }
  };

  // Mostra loading apenas na primeira carga (quando não tem selectedRoom ainda)
  if (loading && !selectedRoom && !error) {
    return (
      <>
        <Breadcrumb pageName="Carregando..." />
        <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
          <div className="container mx-auto">
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-body-color dark:text-dark-6">Carregando dados do quarto...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Mostra erro apenas se realmente houver erro E não estiver carregando
  if (error && !loading) {
    return (
      <>
        <Breadcrumb pageName="Erro" />
        <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-lg bg-red-50 p-6 dark:bg-red-900/20">
              <div className="flex items-center gap-3">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-300">Erro ao carregar quarto</p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {error || 'Quarto não encontrado'}
                  </p>
                  <button
                    onClick={() => fetchRoomById(params.id)}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Se não tem selectedRoom mas também não tem erro nem está carregando, mostra mensagem
  if (!selectedRoom && !loading && !error) {
    return (
      <>
        <Breadcrumb pageName="Quarto não encontrado" />
        <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-lg bg-yellow-50 p-6 dark:bg-yellow-900/20">
              <div className="flex items-center gap-3">
                <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-800 dark:text-yellow-300">Quarto não encontrado</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    O quarto com ID {params.id} não foi encontrado.
                  </p>
                  <button
                    onClick={() => router.push('/rooms')}
                    className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    Voltar para Lista de Quartos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Garante que selectedRoom existe antes de renderizar
  if (!selectedRoom) {
    return (
      <>
        <Breadcrumb pageName="Carregando..." />
        <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
          <div className="container mx-auto">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb 
        pageName={`Editar Quarto ${selectedRoom.roomNumber}`}
        pageDescription="Editar informações do quarto"
      />
      
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
              Editar Quarto {selectedRoom.roomNumber}
            </h1>
            <p className="text-body-color dark:text-dark-6">
              Atualize as informações do quarto abaixo.
            </p>
          </div>

          <RoomForm
            hotelId={selectedRoom.hotelId}
            onSubmit={handleSubmit}
            initialData={initialFormData}
            loading={loading}
            isEdit={true}
          />
        </div>
      </section>
    </>
  );
}

