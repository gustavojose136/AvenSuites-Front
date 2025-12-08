

import { z } from 'zod';

export const bookingCreateSchema = z.object({
  hotelId: z
    .string()
    .uuid('ID do hotel inválido'),

  primaryGuestId: z
    .string()
    .uuid('ID do hóspede inválido'),

  checkInDate: z
    .string()
    .refine((date) => {
      const checkIn = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return checkIn >= today;
    }, 'Data de check-in não pode ser no passado'),

  checkOutDate: z
    .string(),

  guestCount: z
    .number()
    .int('Número de hóspedes deve ser inteiro')
    .min(1, 'Mínimo de 1 hóspede')
    .max(20, 'Máximo de 20 hóspedes'),

  rooms: z
    .array(z.object({
      roomId: z.string().uuid(),
      guestIds: z.array(z.string().uuid()).optional(),
    }))
    .min(1, 'Selecione pelo menos 1 quarto')
    .optional(),

  specialRequests: z
    .string()
    .max(1000, 'Solicitações devem ter no máximo 1000 caracteres')
    .optional()
    .nullable(),
}).refine((data) => {
  const checkIn = new Date(data.checkInDate);
  const checkOut = new Date(data.checkOutDate);
  return checkOut > checkIn;
}, {
  message: 'Data de check-out deve ser após check-in',
  path: ['checkOutDate'],
});

export const bookingUpdateSchema = bookingCreateSchema.partial().omit({ hotelId: true });

export type BookingFormData = z.infer<typeof bookingCreateSchema>;

