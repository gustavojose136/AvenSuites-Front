/**
 * Component: InvoiceForm
 * Formulário completo de nota fiscal com validação
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceCreateSchema, type InvoiceFormData, type InvoiceItemFormData } from '@/shared/validators/invoiceSchema';
import { InvoiceCreateRequest } from '@/application/dto/Invoice.dto';
import { useBooking } from '@/presentation/hooks/useBooking';
import { useGuest } from '@/presentation/hooks/useGuest';
import { useHotel } from '@/presentation/hooks/useHotel';
import { container } from '@/shared/di/Container';

interface InvoiceFormProps {
  onSubmit: (data: InvoiceCreateRequest) => Promise<void>;
  initialData?: Partial<InvoiceFormData>;
  loading?: boolean;
  isEdit?: boolean;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ 
  onSubmit, 
  initialData,
  loading = false,
  isEdit = false,
}) => {
  const { 
    register, 
    handleSubmit, 
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceCreateSchema),
    defaultValues: {
      ...initialData,
      taxAmount: initialData?.taxAmount || 0,
      items: initialData?.items || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const amount = watch('amount') || 0;
  const taxAmount = watch('taxAmount') || 0;
  const items = watch('items') || [];
  const bookingId = watch('bookingId');
  const hotelId = watch('hotelId');

  const { bookings, fetchBookingsByHotel } = useBooking(container.getBookingService());
  const { guests, fetchGuestsByHotel } = useGuest(container.getGuestService());
  const { hotels, fetchHotels } = useHotel(container.getHotelService());

  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (hotelId) {
      fetchGuestsByHotel(hotelId);
      fetchBookingsByHotel(hotelId);
    }
  }, [hotelId, fetchGuestsByHotel, fetchBookingsByHotel]);

  useEffect(() => {
    if (bookingId) {
      const booking = bookings.find(b => b.id === bookingId);
      setSelectedBooking(booking);
      if (booking) {
        // Preencher automaticamente guestId e hotelId se não estiverem preenchidos
        if (!watch('guestId') && booking.mainGuestId) {
          // Não podemos usar setValue aqui diretamente, mas podemos sugerir
        }
      }
    }
  }, [bookingId, bookings]);

  const calculateItemsTotal = () => {
    return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  const calculateTotalAmount = () => {
    const itemsTotal = calculateItemsTotal();
    const finalAmount = itemsTotal > 0 ? itemsTotal : amount;
    return finalAmount + taxAmount;
  };

  const addItem = () => {
    append({
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    });
  };

  const handleItemChange = (index: number, field: 'quantity' | 'unitPrice', value: number) => {
    const currentItems = watch('items') || [];
    if (!currentItems[index]) return;
    
    const item = currentItems[index];
    const qty = field === 'quantity' ? value : (item.quantity || 1);
    const price = field === 'unitPrice' ? value : (item.unitPrice || 0);
    const totalPrice = qty * price;
    
    // Atualizar o item usando setValue
    setValue(`items.${index}.quantity`, qty);
    setValue(`items.${index}.unitPrice`, price);
    setValue(`items.${index}.totalPrice`, totalPrice);
    
    // Atualizar o valor total se houver itens
    if (currentItems.length > 0) {
      const updatedItems = [...currentItems];
      updatedItems[index] = {
        ...item,
        quantity: qty,
        unitPrice: price,
        totalPrice,
      };
      const newAmount = updatedItems.reduce((sum, i) => sum + (i.totalPrice || 0), 0);
      setValue('amount', newAmount);
    }
  };

  const isLoading = loading || isSubmitting;

  const handleFormSubmit = (data: InvoiceFormData) => {
    const request: InvoiceCreateRequest = {
      bookingId: data.bookingId,
      guestId: data.guestId,
      hotelId: data.hotelId,
      amount: data.amount,
      taxAmount: data.taxAmount || 0,
      dueDate: data.dueDate,
      description: data.description,
      items: data.items?.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      notes: data.notes,
    };
    
    return onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Informações Básicas */}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Informações Básicas
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Hotel */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Hotel <span className="text-red-500">*</span>
            </label>
            <select
              {...register('hotelId')}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            >
              <option value="">Selecione um hotel...</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
            {errors.hotelId && (
              <p className="mt-1 text-sm text-red-500">{errors.hotelId.message}</p>
            )}
          </div>

          {/* Reserva */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Reserva <span className="text-red-500">*</span>
            </label>
            <select
              {...register('bookingId')}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading || !hotelId}
            >
              <option value="">Selecione uma reserva...</option>
              {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.code} - {new Date(booking.checkInDate).toLocaleDateString('pt-BR')} a {new Date(booking.checkOutDate).toLocaleDateString('pt-BR')}
                  </option>
                ))}
            </select>
            {errors.bookingId && (
              <p className="mt-1 text-sm text-red-500">{errors.bookingId.message}</p>
            )}
          </div>

          {/* Hóspede */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Hóspede <span className="text-red-500">*</span>
            </label>
            <select
              {...register('guestId')}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading || !hotelId}
            >
              <option value="">Selecione um hóspede...</option>
              {guests.map((guest) => (
                <option key={guest.id} value={guest.id}>
                  {guest.fullName} {guest.email ? `- ${guest.email}` : ''}
                </option>
              ))}
            </select>
            {errors.guestId && (
              <p className="mt-1 text-sm text-red-500">{errors.guestId.message}</p>
            )}
          </div>

          {/* Data de Vencimento */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Data de Vencimento <span className="text-red-500">*</span>
            </label>
            <input
              {...register('dueDate')}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-500">{errors.dueDate.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Valores
        </h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          {/* Valor */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Valor (R$) <span className="text-red-500">*</span>
            </label>
            <input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0.01"
              max="999999"
              placeholder="0.00"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading || items.length > 0}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
            )}
            {items.length > 0 && (
              <p className="mt-1 text-xs text-body-color dark:text-dark-6">
                Valor calculado automaticamente pelos itens
              </p>
            )}
          </div>

          {/* Imposto */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Imposto (R$)
            </label>
            <input
              {...register('taxAmount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              max="999999"
              placeholder="0.00"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.taxAmount && (
              <p className="mt-1 text-sm text-red-500">{errors.taxAmount.message}</p>
            )}
          </div>

          {/* Total */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Total (R$)
            </label>
            <div className="rounded-lg border border-stroke bg-gray-50 px-4 py-3 text-lg font-bold text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
              R$ {calculateTotalAmount().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Itens da Nota Fiscal */}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Itens da Nota Fiscal
          </h3>
          <button
            type="button"
            onClick={addItem}
            disabled={isLoading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Adicionar Item
          </button>
        </div>

        {fields.length === 0 ? (
          <p className="text-sm text-body-color dark:text-dark-6">
            Nenhum item adicionado. Clique em "Adicionar Item" para começar.
          </p>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-dark dark:text-white">Item {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={isLoading}
                    className="rounded-lg bg-red-100 px-3 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400"
                  >
                    Remover
                  </button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Descrição <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register(`items.${index}.description`)}
                      type="text"
                      placeholder="Ex: Hospedagem - 4 diárias"
                      className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                    />
                    {errors.items?.[index]?.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.items[index]?.description?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Quantidade <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="9999"
                      placeholder="1"
                      className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        handleItemChange(index, 'quantity', value);
                      }}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        handleItemChange(index, 'quantity', value);
                      }}
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="mt-1 text-sm text-red-500">{errors.items[index]?.quantity?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Preço Unit. (R$) <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      min="0"
                      max="999999"
                      placeholder="0.00"
                      className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        handleItemChange(index, 'unitPrice', value);
                      }}
                      onBlur={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        handleItemChange(index, 'unitPrice', value);
                      }}
                    />
                    {errors.items?.[index]?.unitPrice && (
                      <p className="mt-1 text-sm text-red-500">{errors.items[index]?.unitPrice?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Total (R$)
                    </label>
                    <div className="rounded-lg border border-stroke bg-gray-100 px-4 py-3 font-semibold text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                      R$ {((watch(`items.${index}.quantity`) || 0) * (watch(`items.${index}.unitPrice`) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Descrição e Notas */}
      <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Informações Adicionais
        </h3>
        
        <div className="space-y-4">
          {/* Descrição */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Descrição
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Ex: Hospedagem de 4 diárias no quarto 101"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Notas */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Notas
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Observações adicionais sobre a nota fiscal"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-dark-3 dark:text-white dark:focus:border-primary dark:disabled:bg-dark-3"
              disabled={isLoading}
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={isLoading}
          className="rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : isEdit ? 'Atualizar Nota Fiscal' : 'Criar Nota Fiscal'}
        </button>
      </div>
    </form>
  );
};

