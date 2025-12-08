

import { z } from 'zod';

const cpfRegex = /^(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{11})$/;

const phoneE164Regex = /^\+\d{1,3}\d{10,14}$/;

export const guestCreateSchema = z.object({
  hotelId: z
    .string()
    .uuid('ID do hotel inválido'),

  firstName: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(75, 'Nome deve ter no máximo 75 caracteres'),

  lastName: z
    .string()
    .min(2, 'Sobrenome deve ter no mínimo 2 caracteres')
    .max(75, 'Sobrenome deve ter no máximo 75 caracteres'),

  email: z
    .string()
    .email('E-mail inválido')
    .max(320, 'E-mail deve ter no máximo 320 caracteres')
    .optional()
    .nullable(),

  phoneE164: z
    .string()
    .regex(phoneE164Regex, 'Telefone inválido. Use formato: +5511999999999')
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional()
    .nullable(),

  documentType: z
    .enum(['CPF', 'Passport', 'RG', 'CNH'], {
      errorMap: () => ({ message: 'Tipo de documento inválido' }),
    } as any)
    .default('CPF')
    .optional(),

  documentNumber: z
    .string()
    .min(5, 'Número do documento é obrigatório')
    .max(32, 'Número do documento deve ter no máximo 32 caracteres'),

  birthDate: z
    .string()
    .optional()
    .nullable()
    .refine((date) => {
      if (!date) return true;
      const birth = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      return age >= 18 && age <= 120;
    }, 'Hóspede deve ter entre 18 e 120 anos'),

  address: z
    .string()
    .max(160, 'Endereço deve ter no máximo 160 caracteres')
    .optional()
    .nullable(),

  addressLine2: z
    .string()
    .max(160, 'Complemento deve ter no máximo 160 caracteres')
    .optional()
    .nullable(),

  city: z
    .string()
    .max(120, 'Cidade deve ter no máximo 120 caracteres')
    .optional()
    .nullable(),

  state: z
    .string()
    .max(60, 'Estado deve ter no máximo 60 caracteres')
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
    .transform(val => val.toUpperCase())
    .optional(),

  marketingConsent: z
    .boolean()
    .default(false)
    .optional(),
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

