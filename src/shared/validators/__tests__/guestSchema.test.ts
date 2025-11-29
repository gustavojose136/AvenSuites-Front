/**
 * Testes: Guest Schema
 * Testa validação de schemas de hóspedes usando Zod
 */

import { guestCreateSchema, guestUpdateSchema } from '../guestSchema';

describe('Guest Schema', () => {
  describe('guestCreateSchema', () => {
    const validGuestData = {
      hotelId: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneE164: '+5511999999999',
      documentType: 'CPF' as const,
      documentNumber: '123.456.789-00',
      birthDate: '1990-01-01',
      address: 'Rua Test, 123',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01234567',
      countryCode: 'BR',
      marketingConsent: false,
    };

    it('deve validar dados completos válidos', () => {
      const result = guestCreateSchema.safeParse(validGuestData);
      expect(result.success).toBe(true);
    });

    it('deve validar dados mínimos obrigatórios', () => {
      const minimalData = {
        hotelId: '123e4567-e89b-12d3-a456-426614174000',
        firstName: 'John',
        lastName: 'Doe',
        documentType: 'CPF' as const,
        documentNumber: '12345678900',
      };
      
      const result = guestCreateSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar hotelId inválido (não UUID)', () => {
      const invalidData = {
        ...validGuestData,
        hotelId: 'invalid-id',
      };
      
      const result = guestCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('hotelId');
      }
    });

    it('deve rejeitar firstName muito curto', () => {
      const invalidData = {
        ...validGuestData,
        firstName: 'A',
      };
      
      const result = guestCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar lastName muito curto', () => {
      const invalidData = {
        ...validGuestData,
        lastName: 'B',
      };
      
      const result = guestCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar email inválido', () => {
      const invalidData = {
        ...validGuestData,
        email: 'invalid-email',
      };
      
      const result = guestCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar telefone em formato inválido', () => {
      const invalidData = {
        ...validGuestData,
        phoneE164: '11999999999', // Sem o +55
      };
      
      const result = guestCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar CPF inválido', () => {
      const invalidData = {
        ...validGuestData,
        documentType: 'CPF' as const,
        documentNumber: '123', // CPF muito curto
      };
      
      const result = guestCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar CPF formatado (com pontos e traço)', () => {
      const validData = {
        ...validGuestData,
        documentNumber: '123.456.789-00',
      };
      
      const result = guestCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve aceitar CPF sem formatação', () => {
      const validData = {
        ...validGuestData,
        documentNumber: '12345678900',
      };
      
      const result = guestCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar idade menor que 18 anos', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
      const invalidData = {
        ...validGuestData,
        birthDate: birthDate.toISOString().split('T')[0],
      };
      
      const result = guestCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar idade entre 18 e 120 anos', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
      const validData = {
        ...validGuestData,
        birthDate: birthDate.toISOString().split('T')[0],
      };
      
      const result = guestCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve aceitar email como opcional', () => {
      const dataWithoutEmail = {
        ...validGuestData,
        email: undefined,
      };
      
      const result = guestCreateSchema.safeParse(dataWithoutEmail);
      expect(result.success).toBe(true);
    });

    it('deve converter countryCode para uppercase', () => {
      const data = {
        ...validGuestData,
        countryCode: 'br',
      };
      
      const result = guestCreateSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.countryCode).toBe('BR');
      }
    });
  });

  describe('guestUpdateSchema', () => {
    it('deve permitir atualização parcial', () => {
      const updateData = {
        firstName: 'Jane',
      };
      
      const result = guestUpdateSchema.safeParse(updateData);
      expect(result.success).toBe(true);
    });

    it('deve não permitir atualizar hotelId', () => {
      const updateData = {
        hotelId: '123e4567-e89b-12d3-a456-426614174000',
        firstName: 'Jane',
      };
      
      const result = guestUpdateSchema.safeParse(updateData);
      // hotelId deve ser omitido
      if (result.success) {
        expect(result.data.hotelId).toBeUndefined();
      }
    });
  });
});

