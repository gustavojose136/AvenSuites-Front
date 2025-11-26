/**
 * Schemas de Validação: Room
 */

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
    .number()
    .int('Andar deve ser um número inteiro')
    .min(0, 'Andar não pode ser negativo')
    .max(200, 'Andar inválido')
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
  
  maxOccupancy: z
    .number()
    .int('Capacidade deve ser um número inteiro')
    .min(1, 'Capacidade mínima é 1 pessoa')
    .max(20, 'Capacidade máxima é 20 pessoas')
    .optional()
    .nullable(),
  
  bedType: z
    .enum(['Single', 'Double', 'Queen', 'King', 'Twin'], {
      errorMap: () => ({ message: 'Tipo de cama inválido' }),
    } as any)
    .optional()
    .nullable(),
  
  basePrice: z
    .number()
    .min(0, 'Preço não pode ser negativo')
    .optional()
    .nullable(),
  
  notes: z
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional()
    .nullable(),
});

export const roomUpdateSchema = roomCreateSchema.partial().omit({ hotelId: true });

export type RoomFormData = z.infer<typeof roomCreateSchema>;

