import { passwordSchema, passwordWithConfirmationSchema } from '../passwordSchema';

describe('passwordSchema', () => {
  describe('validação de senha', () => {
    it('deve aceitar senha válida com letras e números', () => {
      const result = passwordSchema.safeParse('Senha123');
      expect(result.success).toBe(true);
    });

    it('deve rejeitar senha muito curta', () => {
      const result = passwordSchema.safeParse('Sen1');
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.errors.map(e => e.message).join(' ');
        expect(messages).toContain('mínimo 6 caracteres');
      }
    });

    it('deve rejeitar senha muito longa', () => {
      const longPassword = 'A'.repeat(101);
      const result = passwordSchema.safeParse(longPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.errors.map(e => e.message).join(' ');
        expect(messages).toContain('máximo 100 caracteres');
      }
    });

    it('deve rejeitar senha sem letras', () => {
      const result = passwordSchema.safeParse('123456');
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.errors.map(e => e.message).join(' ');
        expect(messages).toContain('pelo menos uma letra');
      }
    });

    it('deve rejeitar senha sem números', () => {
      const result = passwordSchema.safeParse('SenhaTeste');
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.errors.map((e: any) => e.message).join(' ');
        expect(errorMessages).toContain('pelo menos um número');
      }
    });
  });
});

describe('passwordWithConfirmationSchema', () => {
  describe('validação de senha com confirmação', () => {
    it('deve aceitar senhas que coincidem', () => {
      const result = passwordWithConfirmationSchema.safeParse({
        password: 'Senha123',
        confirmPassword: 'Senha123',
      });
      expect(result.success).toBe(true);
    });

    it('deve rejeitar senhas que não coincidem', () => {
      const result = passwordWithConfirmationSchema.safeParse({
        password: 'Senha123',
        confirmPassword: 'Senha456',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e: any) => e.message).join(' ');
        expect(errorMessages).toContain('não coincidem');
      }
    });

    it('deve rejeitar quando confirmação está vazia', () => {
      const result = passwordWithConfirmationSchema.safeParse({
        password: 'Senha123',
        confirmPassword: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e: any) => e.message).join(' ');
        expect(errorMessages).toContain('obrigatória');
      }
    });
  });
});

