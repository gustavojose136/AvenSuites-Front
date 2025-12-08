

'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingCreateSchema, type BookingFormData } from '@/shared/validators/bookingSchema';
import { BookingCreateRequest } from '@/application/dto/Booking.dto';
import { useRoom } from '@/presentation/hooks/useRoom';
import { useGuest } from '@/presentation/hooks/useGuest';
import { container } from '@/shared/di/Container';
import { calculateRoomPrice } from '@/shared/utils/roomPriceCalculator';

interface BookingFormProps {
  hotelId: string;
  onSubmit: (data: BookingCreateRequest) => Promise<void>;
  initialData?: Partial<BookingFormData>;
  loading?: boolean;
  isEdit?: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
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
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingCreateSchema),
    defaultValues: {
      ...initialData,
      hotelId,
      guestCount: initialData?.guestCount || 1,
    },
  });

  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');
  const guestCount = watch('guestCount');

  const { availableRooms, checkAvailability, loading: loadingRooms } =
    useRoom(container.getRoomService());

  const { guests, fetchGuestsByHotel } =
    useGuest(container.getGuestService());

  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const isLoading = loading || isSubmitting;

  useEffect(() => {
    fetchGuestsByHotel(hotelId);
  }, [hotelId]);

  useEffect(() => {
    if (checkInDate && checkOutDate && guestCount) {

      checkAvailability({
        hotelId,
        checkInDate,
        checkOutDate,
        adults: guestCount,
        children: 0,
      });
    }
  }, [checkInDate, checkOutDate, guestCount, hotelId, checkAvailability]);

  const handleRoomToggle = (roomId: string) => {
    setSelectedRooms(prev => {
      if (prev.includes(roomId)) {
        return prev.filter(id => id !== roomId);
      } else {
        return [...prev, roomId];
      }
    });
  };

  const handleFormSubmit = (data: BookingFormData) => {
    const roomsData = selectedRooms.map(roomId => ({ roomId }));

    return onSubmit({
      hotelId: data.hotelId,
      mainGuestId: data.primaryGuestId,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      adults: data.guestCount,
      children: 0,
      roomIds: roomsData.map(r => r.roomId),
      source: 'WEB',
      currency: 'BRL',
      notes: data.specialRequests || undefined,
    });
  };

  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate || selectedRooms.length === 0) return 0;

    const nights = Math.ceil(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const totalGuests = guestCount || 1;

    const roomsTotal = selectedRooms.reduce((total, roomId) => {
      const room = availableRooms.find(r => r.roomId === roomId);
      if (!room || !room.roomType) {
        return total;
      }

      const roomPrice = calculateRoomPrice(room.roomType, totalGuests, nights);
      return total + roomPrice;
    }, 0);

    return roomsTotal;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Hóspede Principal
        </h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Selecione o Hóspede <span className="text-red-500">*</span>
          </label>
          <select
            {...register('primaryGuestId')}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
            disabled={isLoading}
          >
            <option value="">Selecione um hóspede...</option>
            {guests.map((guest) => (
              <option key={guest.id} value={guest.id}>
                {guest.fullName} {guest.email ? `- ${guest.email}` : ''}
              </option>
            ))}
          </select>
          {errors.primaryGuestId && (
            <p className="mt-1 text-sm text-red-500">{errors.primaryGuestId.message}</p>
          )}
          <p className="mt-2 text-sm text-body-color dark:text-dark-6">
            Não encontrou o hóspede? <a href="/guests/new" className="text-primary hover:underline">Cadastre um novo hóspede</a>
          </p>
        </div>
      </div>

      {}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Período da Reserva
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          {}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Check-in <span className="text-red-500">*</span>
            </label>
            <input
              {...register('checkInDate')}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.checkInDate && (
              <p className="mt-1 text-sm text-red-500">{errors.checkInDate.message}</p>
            )}
          </div>

          {}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Check-out <span className="text-red-500">*</span>
            </label>
            <input
              {...register('checkOutDate')}
              type="date"
              min={checkInDate || new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.checkOutDate && (
              <p className="mt-1 text-sm text-red-500">{errors.checkOutDate.message}</p>
            )}
          </div>

          {}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Número de Hóspedes <span className="text-red-500">*</span>
            </label>
            <input
              {...register('guestCount', { valueAsNumber: true })}
              type="number"
              min="1"
              placeholder="2"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.guestCount && (
              <p className="mt-1 text-sm text-red-500">{errors.guestCount.message}</p>
            )}
          </div>
        </div>
      </div>

      {}
      {checkInDate && checkOutDate && (
        <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Quartos Disponíveis
          </h3>

          {loadingRooms ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : availableRooms.length === 0 ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/20 dark:bg-yellow-900/10">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Nenhum quarto disponível para as datas selecionadas.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableRooms.map((room) => (
                <label
                  key={room.roomId}
                  className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition ${
                    selectedRooms.includes(room.roomId)
                      ? 'border-primary bg-primary/5'
                      : 'border-stroke hover:border-primary/50 dark:border-dark-3'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedRooms.includes(room.roomId)}
                      onChange={() => handleRoomToggle(room.roomId)}
                      className="h-5 w-5 rounded border-stroke text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="font-medium text-dark dark:text-white">
                        Quarto {room.roomNumber}
                      </p>
                      {room.roomType && (
                        <p className="text-sm text-body-color dark:text-dark-6">
                          {room.roomType.name} • Capacidade: {room.roomType.capacityAdults + room.roomType.capacityChildren} pessoa(s)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {checkInDate && checkOutDate && room.roomType ? (
                      <>
                        <p className="font-semibold text-primary">
                          {(() => {
                            const nights = Math.ceil(
                              (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)
                            );
                            const totalGuests = guestCount || 1;
                            const price = calculateRoomPrice(room.roomType, totalGuests, nights);
                            return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                          })()}
                        </p>
                        <p className="text-xs text-body-color dark:text-dark-6">
                          total do período ({guestCount || 1} {guestCount === 1 ? 'hóspede' : 'hóspedes'})
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-primary">
                          R$ {room.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                        </p>
                        <p className="text-xs text-body-color dark:text-dark-6">
                          total do período
                        </p>
                      </>
                    )}
                  </div>
                </label>
              ))}

              {selectedRooms.length === 0 && (
                <p className="text-sm text-body-color dark:text-dark-6">
                  Selecione pelo menos um quarto para continuar.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Solicitações Especiais <span className="text-sm font-normal text-body-color">(Opcional)</span>
        </h3>

        <textarea
          {...register('specialRequests')}
          rows={4}
          placeholder="Ex: Quarto no andar alto, cama extra, berço para bebê..."
          className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
          disabled={isLoading}
        />
        {errors.specialRequests && (
          <p className="mt-1 text-sm text-red-500">{errors.specialRequests.message}</p>
        )}
      </div>

      {}
      {selectedRooms.length > 0 && (
        <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Resumo da Reserva
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-body-color dark:text-dark-6">
              <span>Quartos selecionados:</span>
              <span className="font-medium text-dark dark:text-white">{selectedRooms.length}</span>
            </div>
            <div className="flex justify-between text-body-color dark:text-dark-6">
              <span>Hóspedes:</span>
              <span className="font-medium text-dark dark:text-white">{guestCount}</span>
            </div>
            {checkInDate && checkOutDate && (
              <div className="flex justify-between text-body-color dark:text-dark-6">
                <span>Noites:</span>
                <span className="font-medium text-dark dark:text-white">
                  {Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
            )}
            <div className="border-t border-stroke pt-2 dark:border-dark-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-dark dark:text-white">Total:</span>
                <span className="text-lg font-bold text-primary">
                  R$ {calculateTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading || selectedRooms.length === 0}
          className="flex-1 rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 md:flex-initial md:min-w-[200px]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Salvando...
            </span>
          ) : (
            <span>{isEdit ? 'Atualizar Reserva' : 'Criar Reserva'}</span>
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

