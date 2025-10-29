/**
 * Schemas de Validação: Hotel
 * Usando Zod para validação de formulários
 */

import { z } from 'zod';

// Regex para validação de CNPJ (com ou sem formatação)
const cnpjRegex = /^(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}|\d{14})$/;

// Regex para telefone E.164 (+5511999999999)
const phoneE164Regex = /^\+\d{1,3}\d{10,14}$/;

// Regex para CEP (com ou sem formatação)
const cepRegex = /^(\d{5}-?\d{3}|\d{8})$/;

export const hotelCreateSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres'),
  
  tradeName: z
    .string()
    .max(200, 'Nome fantasia deve ter no máximo 200 caracteres')
    .optional()
    .nullable(),
  
  cnpj: z
    .string()
    .regex(cnpjRegex, 'CNPJ inválido. Use formato: 00.000.000/0000-00 ou 14 dígitos')
    .transform(val => val.replace(/\D/g, '')), // Remove formatação
  
  email: z
    .string()
    .email('E-mail inválido')
    .max(100, 'E-mail deve ter no máximo 100 caracteres'),
  
  phoneE164: z
    .string()
    .regex(phoneE164Regex, 'Telefone inválido. Use formato: +5511999999999'),
  
  timezone: z
    .string()
    .default('America/Sao_Paulo'),
  
  addressLine1: z
    .string()
    .min(5, 'Endereço deve ter no mínimo 5 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres'),
  
  addressLine2: z
    .string()
    .max(200, 'Complemento deve ter no máximo 200 caracteres')
    .optional()
    .nullable(),
  
  city: z
    .string()
    .min(2, 'Cidade deve ter no mínimo 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres'),
  
  state: z
    .string()
    .length(2, 'Estado deve ter 2 letras (UF)')
    .toUpperCase(),
  
  postalCode: z
    .string()
    .regex(cepRegex, 'CEP inválido. Use formato: 00000-000 ou 8 dígitos')
    .transform(val => val.replace(/\D/g, '')), // Remove formatação
  
  countryCode: z
    .string()
    .length(2, 'Código do país deve ter 2 letras')
    .default('BR')
    .toUpperCase(),
});

export const hotelUpdateSchema = hotelCreateSchema.partial();

export type HotelFormData = z.infer<typeof hotelCreateSchema>;

