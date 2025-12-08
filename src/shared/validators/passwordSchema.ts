import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(6, 'Senha deve ter no mínimo 6 caracteres')
  .max(100, 'Senha deve ter no máximo 100 caracteres')
  .regex(/[A-Za-z]/, 'Senha deve conter pelo menos uma letra')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número');

export const passwordWithConfirmationSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type PasswordFormData = z.infer<typeof passwordWithConfirmationSchema>;

