/**
 * Testes: Hotel Schema
 * Testa validação de schemas de hotéis usando Zod
 */

import { hotelCreateSchema, hotelUpdateSchema } from '../hotelSchema';

describe('Hotel Schema', () => {
  describe('hotelCreateSchema', () => {
    const validHotelData = {
      name: 'Hotel Test',
      tradeName: 'Hotel Test LTDA',
      cnpj: '12.345.678/0001-90',
      email: 'test@hotel.com',
      phoneE164: '+5511999999999',
      timezone: 'America/Sao_Paulo',
      addressLine1: 'Rua Test, 123',
      addressLine2: 'Apto 45',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01234-567',
      countryCode: 'BR',
    };

    it('deve validar dados completos válidos', () => {
      const result = hotelCreateSchema.safeParse(validHotelData);
      expect(result.success).toBe(true);
    });

    it('deve validar dados mínimos obrigatórios', () => {
      const minimalData = {
        name: 'Hotel Minimal',
        cnpj: '12345678000190',
        email: 'minimal@hotel.com',
        phoneE164: '+5511999999999',
        addressLine1: 'Rua Test, 123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01234567',
      };
      
      const result = hotelCreateSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar nome muito curto', () => {
      const invalidData = {
        ...validHotelData,
        name: 'AB',
      };
      
      const result = hotelCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar CNPJ inválido', () => {
      const invalidData = {
        ...validHotelData,
        cnpj: '123',
      };
      
      const result = hotelCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar CNPJ formatado (com pontos, barra e traço)', () => {
      const validData = {
        ...validHotelData,
        cnpj: '12.345.678/0001-90',
      };
      
      const result = hotelCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        // Deve remover formatação
        expect(result.data.cnpj).toBe('12345678000190');
      }
    });

    it('deve aceitar CNPJ sem formatação', () => {
      const validData = {
        ...validHotelData,
        cnpj: '12345678000190',
      };
      
      const result = hotelCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar email inválido', () => {
      const invalidData = {
        ...validHotelData,
        email: 'invalid-email',
      };
      
      const result = hotelCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar telefone em formato inválido', () => {
      const invalidData = {
        ...validHotelData,
        phoneE164: '11999999999', // Sem o +55
      };
      
      const result = hotelCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar estado com mais de 2 caracteres', () => {
      const invalidData = {
        ...validHotelData,
        state: 'SPA',
      };
      
      const result = hotelCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve converter estado para uppercase', () => {
      const data = {
        ...validHotelData,
        state: 'sp',
      };
      
      const result = hotelCreateSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.state).toBe('SP');
      }
    });

    it('deve aceitar CEP formatado (com traço)', () => {
      const validData = {
        ...validHotelData,
        postalCode: '01234-567',
      };
      
      const result = hotelCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        // Deve remover formatação
        expect(result.data.postalCode).toBe('01234567');
      }
    });

    it('deve aceitar CEP sem formatação', () => {
      const validData = {
        ...validHotelData,
        postalCode: '01234567',
      };
      
      const result = hotelCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve usar America/Sao_Paulo como padrão para timezone', () => {
      const data = {
        ...validHotelData,
        timezone: undefined,
      };
      
      const result = hotelCreateSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.timezone).toBe('America/Sao_Paulo');
      }
    });

    it('deve converter countryCode para uppercase', () => {
      const data = {
        ...validHotelData,
        countryCode: 'br',
      };
      
      const result = hotelCreateSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.countryCode).toBe('BR');
      }
    });

    it('deve usar BR como padrão para countryCode', () => {
      const data = {
        ...validHotelData,
        countryCode: undefined,
      };
      
      const result = hotelCreateSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.countryCode).toBe('BR');
      }
    });
  });

  describe('hotelUpdateSchema', () => {
    it('deve permitir atualização parcial', () => {
      const updateData = {
        name: 'Novo Nome',
      };
      
      const result = hotelUpdateSchema.safeParse(updateData);
      expect(result.success).toBe(true);
    });

    it('deve permitir atualizar apenas alguns campos', () => {
      const updateData = {
        name: 'Novo Nome',
        email: 'novo@email.com',
      };
      
      const result = hotelUpdateSchema.safeParse(updateData);
      expect(result.success).toBe(true);
    });
  });
});

