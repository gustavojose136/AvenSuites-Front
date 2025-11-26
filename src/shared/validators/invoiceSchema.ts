/**
 * Schemas de Validação: Invoice
 */

import { z } from 'zod';

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(200, 'Descrição deve ter no máximo 200 caracteres'),
  quantity: z.number().int('Quantidade deve ser inteira').min(1, 'Quantidade mínima é 1').max(9999, 'Quantidade máxima é 9999'),
  unitPrice: z.number().min(0, 'Preço unitário deve ser maior ou igual a zero').max(999999, 'Preço unitário máximo é 999999'),
  totalPrice: z.number().min(0, 'Preço total deve ser maior ou igual a zero').max(999999, 'Preço total máximo é 999999'),
});

export const invoiceCreateSchema = z.object({
  bookingId: z
    .string()
    .uuid('ID da reserva inválido'),
  
  guestId: z
    .string()
    .uuid('ID do hóspede inválido'),
  
  hotelId: z
    .string()
    .uuid('ID do hotel inválido'),
  
  amount: z
    .number()
    .min(0.01, 'Valor deve ser maior que zero')
    .max(999999, 'Valor máximo é 999999'),
  
  taxAmount: z
    .number()
    .min(0, 'Valor de imposto deve ser maior ou igual a zero')
    .max(999999, 'Valor de imposto máximo é 999999')
    .optional()
    .default(0),
  
  dueDate: z
    .string()
    .refine((date) => {
      const due = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return due >= today;
    }, 'Data de vencimento não pode ser no passado'),
  
  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  
  items: z
    .array(invoiceItemSchema)
    .optional(),
  
  notes: z
    .string()
    .max(1000, 'Notas devem ter no máximo 1000 caracteres')
    .optional(),
}).refine((data) => {
  if (data.items && data.items.length > 0) {
    const itemsTotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0);
    return Math.abs(itemsTotal - data.amount) < 0.01;
  }
  return true;
}, {
  message: 'O valor total dos itens deve corresponder ao valor da nota fiscal',
  path: ['items'],
});

export const invoiceUpdateSchema = invoiceCreateSchema.partial().omit({ bookingId: true, guestId: true, hotelId: true });

export type InvoiceFormData = z.infer<typeof invoiceCreateSchema>;
export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;

