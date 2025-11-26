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
  
  // Nome completo (será enviado como fullName)
  firstName: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(75, 'Nome deve ter no máximo 75 caracteres'),
  
  lastName: z
    .string()
    .min(2, 'Sobrenome deve ter no mínimo 2 caracteres')
    .max(75, 'Sobrenome deve ter no máximo 75 caracteres'),
  
  // Email (max 320 conforme API)
  email: z
    .string()
    .email('E-mail inválido')
    .max(320, 'E-mail deve ter no máximo 320 caracteres')
    .optional()
    .nullable(),
  
  // Telefone E.164 (max 20 conforme API)
  phoneE164: z
    .string()
    .regex(phoneE164Regex, 'Telefone inválido. Use formato: +5511999999999')
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional()
    .nullable(),
  
  // Tipo de documento (max 30 conforme API)
  documentType: z
    .enum(['CPF', 'Passport', 'RG', 'CNH'], {
      errorMap: () => ({ message: 'Tipo de documento inválido' }),
    } as any)
    .default('CPF')
    .optional(),
  
  // Número do documento sem formatação (max 32 conforme API)
  documentNumber: z
    .string()
    .min(5, 'Número do documento é obrigatório')
    .max(32, 'Número do documento deve ter no máximo 32 caracteres'),
  
  // Data de nascimento
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
  
  // Endereço linha 1 (max 160 conforme API)
  address: z
    .string()
    .max(160, 'Endereço deve ter no máximo 160 caracteres')
    .optional()
    .nullable(),
  
  // Endereço linha 2 (max 160 conforme API)
  addressLine2: z
    .string()
    .max(160, 'Complemento deve ter no máximo 160 caracteres')
    .optional()
    .nullable(),
  
  // Cidade (max 120 conforme API)
  city: z
    .string()
    .max(120, 'Cidade deve ter no máximo 120 caracteres')
    .optional()
    .nullable(),
  
  // Estado (max 60 conforme API)
  state: z
    .string()
    .max(60, 'Estado deve ter no máximo 60 caracteres')
    .optional()
    .nullable(),
  
  // CEP (max 20 conforme API)
  postalCode: z
    .string()
    .max(20, 'CEP deve ter no máximo 20 caracteres')
    .optional()
    .nullable(),
  
  // Código do país (max 2 conforme API, default BR)
  countryCode: z
    .string()
    .length(2, 'Código do país deve ter 2 letras')
    .default('BR')
    .transform(val => val.toUpperCase())
    .optional(),
  
  // Consentimento de marketing
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

