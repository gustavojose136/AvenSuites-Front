import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  emailOrCpf: z
    .string()
    .min(1, 'E-mail ou CPF é obrigatório')
    .max(320, 'E-mail ou CPF deve ter no máximo 320 caracteres'),
});

export const resetPasswordSchema = z.object({
  code: z
    .string()
    .min(6, 'Código deve ter 6 dígitos')
    .max(10, 'Código deve ter no máximo 10 caracteres')
    .regex(/^\d+$/, 'Código deve conter apenas números'),
  newPassword: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
  confirmPassword: z
    .string()
    .min(6, 'Confirmação de senha é obrigatória')
    .max(100, 'Confirmação de senha deve ter no máximo 100 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

