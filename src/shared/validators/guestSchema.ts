/**
 * Schemas de Validação: Guest
 */

import { z } from 'zod';

// Regex para CPF (com ou sem formatação)
const cpfRegex = /^(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{11})$/;

// Regex para telefone E.164
const phoneE164Regex = /^\+\d{1,3}\d{10,14}$/;

export const guestCreateSchema = z.object({
  hotelId: z
    .string()
    .uuid('ID do hotel inválido'),
  
  firstName: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  lastName: z
    .string()
    .min(2, 'Sobrenome deve ter no mínimo 2 caracteres')
    .max(100, 'Sobrenome deve ter no máximo 100 caracteres'),
  
  email: z
    .string()
    .email('E-mail inválido')
    .max(100, 'E-mail deve ter no máximo 100 caracteres'),
  
  phoneE164: z
    .string()
    .regex(phoneE164Regex, 'Telefone inválido. Use formato: +5511999999999'),
  
  documentType: z
    .enum(['CPF', 'Passport', 'RG', 'CNH'], {
      errorMap: () => ({ message: 'Tipo de documento inválido' }),
    })
    .default('CPF'),
  
  documentNumber: z
    .string()
    .min(5, 'Número do documento é obrigatório')
    .max(50, 'Número do documento deve ter no máximo 50 caracteres'),
  
  birthDate: z
    .string()
    .refine((date) => {
      const birth = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      return age >= 18 && age <= 120;
    }, 'Hóspede deve ter entre 18 e 120 anos'),
  
  nationality: z
    .string()
    .length(2, 'Código de nacionalidade deve ter 2 letras')
    .default('BR')
    .toUpperCase(),
  
  address: z
    .string()
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .optional()
    .nullable(),
  
  city: z
    .string()
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .optional()
    .nullable(),
  
  state: z
    .string()
    .max(50, 'Estado deve ter no máximo 50 caracteres')
    .optional()
    .nullable(),
  
  postalCode: z
    .string()
    .max(20, 'CEP deve ter no máximo 20 caracteres')
    .optional()
    .nullable(),
  
  countryCode: z
    .string()
    .length(2, 'Código do país deve ter 2 letras')
    .default('BR')
    .toUpperCase()
    .optional()
    .nullable(),
}).refine((data) => {
  if (data.documentType === 'CPF') {
    return cpfRegex.test(data.documentNumber);
  }
  return true;
}, {
  message: 'CPF inválido. Use formato: 000.000.000-00 ou 11 dígitos',
  path: ['documentNumber'],
});

export const guestUpdateSchema = guestCreateSchema.partial().omit({ hotelId: true });

export type GuestFormData = z.infer<typeof guestCreateSchema>;

