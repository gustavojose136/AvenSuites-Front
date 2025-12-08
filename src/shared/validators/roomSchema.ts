

import { z } from 'zod';

export const roomCreateSchema = z.object({
  hotelId: z
    .string()
    .uuid('ID do hotel inválido'),

  roomNumber: z
    .string()
    .min(1, 'Número do quarto é obrigatório')
    .max(20, 'Número do quarto deve ter no máximo 20 caracteres'),

  floor: z
    .string()
    .max(10, 'Andar deve ter no máximo 10 caracteres')
    .optional()
    .nullable(),

  roomTypeId: z
    .string()
    .uuid('ID do tipo de quarto inválido')
    .optional()
    .nullable(),

  status: z
    .enum(['Available', 'Occupied', 'Maintenance', 'OutOfOrder'], {
      errorMap: () => ({ message: 'Status inválido' }),
    } as any)
    .default('Available')
    .optional(),
});

export const roomUpdateSchema = roomCreateSchema.partial().omit({ hotelId: true });

export type RoomFormData = z.infer<typeof roomCreateSchema>;

