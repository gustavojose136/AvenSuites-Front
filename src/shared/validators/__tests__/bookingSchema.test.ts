/**
 * Testes: Booking Schema
 * Testa validação de schemas de reservas usando Zod
 */

import { bookingCreateSchema, bookingUpdateSchema } from '../bookingSchema';

describe('Booking Schema', () => {
  describe('bookingCreateSchema', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const validBookingData = {
      hotelId: '123e4567-e89b-12d3-a456-426614174000',
      primaryGuestId: '123e4567-e89b-12d3-a456-426614174001',
      checkInDate: tomorrow.toISOString().split('T')[0],
      checkOutDate: dayAfterTomorrow.toISOString().split('T')[0],
      guestCount: 2,
      rooms: [
        {
          roomId: '123e4567-e89b-12d3-a456-426614174002',
          guestIds: ['123e4567-e89b-12d3-a456-426614174001'],
        },
      ],
      specialRequests: 'Quarto com vista para o mar',
    };

    it('deve validar dados completos válidos', () => {
      const result = bookingCreateSchema.safeParse(validBookingData);
      expect(result.success).toBe(true);
    });

    it('deve validar dados mínimos obrigatórios', () => {
      const minimalData = {
        hotelId: '123e4567-e89b-12d3-a456-426614174000',
        primaryGuestId: '123e4567-e89b-12d3-a456-426614174001',
        checkInDate: tomorrow.toISOString().split('T')[0],
        checkOutDate: dayAfterTomorrow.toISOString().split('T')[0],
        guestCount: 1,
      };
      
      const result = bookingCreateSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar hotelId inválido (não UUID)', () => {
      const invalidData = {
        ...validBookingData,
        hotelId: 'invalid-id',
      };
      
      const result = bookingCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar primaryGuestId inválido (não UUID)', () => {
      const invalidData = {
        ...validBookingData,
        primaryGuestId: 'invalid-id',
      };
      
      const result = bookingCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar checkInDate no passado', () => {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const invalidData = {
        ...validBookingData,
        checkInDate: yesterday.toISOString().split('T')[0],
      };
      
      const result = bookingCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar checkInDate hoje', () => {
      const validData = {
        ...validBookingData,
        checkInDate: today.toISOString().split('T')[0],
      };
      
      const result = bookingCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar checkOutDate antes de checkInDate', () => {
      const invalidData = {
        ...validBookingData,
        checkInDate: dayAfterTomorrow.toISOString().split('T')[0],
        checkOutDate: tomorrow.toISOString().split('T')[0],
      };
      
      const result = bookingCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const checkOutError = result.error.errors.find(err => err.path.includes('checkOutDate'));
        expect(checkOutError).toBeDefined();
      }
    });

    it('deve rejeitar guestCount menor que 1', () => {
      const invalidData = {
        ...validBookingData,
        guestCount: 0,
      };
      
      const result = bookingCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar guestCount maior que 20', () => {
      const invalidData = {
        ...validBookingData,
        guestCount: 21,
      };
      
      const result = bookingCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar guestCount não inteiro', () => {
      const invalidData = {
        ...validBookingData,
        guestCount: 2.5,
      };
      
      const result = bookingCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar rooms vazio', () => {
      const invalidData = {
        ...validBookingData,
        rooms: [],
      };
      
      const result = bookingCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar roomId inválido (não UUID)', () => {
      const invalidData = {
        ...validBookingData,
        rooms: [
          {
            roomId: 'invalid-id',
          },
        ],
      };
      
      const result = bookingCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar rooms como opcional', () => {
      const dataWithoutRooms = {
        ...validBookingData,
        rooms: undefined,
      };
      
      const result = bookingCreateSchema.safeParse(dataWithoutRooms);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar specialRequests muito longo', () => {
      const invalidData = {
        ...validBookingData,
        specialRequests: 'A'.repeat(1001),
      };
      
      const result = bookingCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar specialRequests como opcional', () => {
      const dataWithoutRequests = {
        ...validBookingData,
        specialRequests: undefined,
      };
      
      const result = bookingCreateSchema.safeParse(dataWithoutRequests);
      expect(result.success).toBe(true);
    });

    it('deve aceitar specialRequests como null', () => {
      const dataWithNullRequests = {
        ...validBookingData,
        specialRequests: null,
      };
      
      const result = bookingCreateSchema.safeParse(dataWithNullRequests);
      expect(result.success).toBe(true);
    });
  });

  describe('bookingUpdateSchema', () => {
    it('deve permitir atualização parcial', () => {
      const updateData = {
        guestCount: 3,
      };
      
      const result = bookingUpdateSchema.safeParse(updateData);
      expect(result.success).toBe(true);
    });

    it('deve não permitir atualizar hotelId', () => {
      const updateData = {
        hotelId: '123e4567-e89b-12d3-a456-426614174000',
        guestCount: 3,
      };
      
      const result = bookingUpdateSchema.safeParse(updateData);
      // hotelId deve ser omitido
      if (result.success) {
        expect(result.data.hotelId).toBeUndefined();
      }
    });
  });
});

