/**
 * Testes: Room Schema
 * Testa validação de schemas de quartos usando Zod
 */

import { roomCreateSchema, roomUpdateSchema } from '../roomSchema';

describe('Room Schema', () => {
  describe('roomCreateSchema', () => {
    const validRoomData = {
      hotelId: '123e4567-e89b-12d3-a456-426614174000',
      roomNumber: '101',
      floor: 1,
      roomTypeId: '123e4567-e89b-12d3-a456-426614174001',
      status: 'Available' as const,
      maxOccupancy: 2,
      bedType: 'Double' as const,
      basePrice: 150.50,
      notes: 'Quarto com vista para o mar',
    };

    it('deve validar dados completos válidos', () => {
      const result = roomCreateSchema.safeParse(validRoomData);
      expect(result.success).toBe(true);
    });

    it('deve validar dados mínimos obrigatórios', () => {
      const minimalData = {
        hotelId: '123e4567-e89b-12d3-a456-426614174000',
        roomNumber: '101',
      };
      
      const result = roomCreateSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar hotelId inválido (não UUID)', () => {
      const invalidData = {
        ...validRoomData,
        hotelId: 'invalid-id',
      };
      
      const result = roomCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success && result.error.errors.length > 0) {
        const hotelIdError = result.error.errors.find(err => err.path.includes('hotelId'));
        expect(hotelIdError).toBeDefined();
      }
    });

    it('deve rejeitar roomNumber vazio', () => {
      const invalidData = {
        ...validRoomData,
        roomNumber: '',
      };
      
      const result = roomCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar roomNumber muito longo', () => {
      const invalidData = {
        ...validRoomData,
        roomNumber: 'A'.repeat(21),
      };
      
      const result = roomCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar floor negativo', () => {
      const invalidData = {
        ...validRoomData,
        floor: -1,
      };
      
      const result = roomCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar floor muito alto', () => {
      const invalidData = {
        ...validRoomData,
        floor: 201,
      };
      
      const result = roomCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar floor zero (térreo)', () => {
      const validData = {
        ...validRoomData,
        floor: 0,
      };
      
      const result = roomCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar roomTypeId inválido (não UUID)', () => {
      const invalidData = {
        ...validRoomData,
        roomTypeId: 'invalid-id',
      };
      
      const result = roomCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar status válido', () => {
      const statuses = ['Available', 'Occupied', 'Maintenance', 'OutOfOrder'] as const;
      
      statuses.forEach(status => {
        const data = {
          ...validRoomData,
          status,
        };
        
        const result = roomCreateSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('deve usar Available como padrão para status', () => {
      const data = {
        hotelId: '123e4567-e89b-12d3-a456-426614174000',
        roomNumber: '101',
      };
      
      const result = roomCreateSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('Available');
      }
    });

    it('deve rejeitar maxOccupancy menor que 1', () => {
      const invalidData = {
        ...validRoomData,
        maxOccupancy: 0,
      };
      
      const result = roomCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar maxOccupancy maior que 20', () => {
      const invalidData = {
        ...validRoomData,
        maxOccupancy: 21,
      };
      
      const result = roomCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar bedType válido', () => {
      const bedTypes = ['Single', 'Double', 'Queen', 'King', 'Twin'] as const;
      
      bedTypes.forEach(bedType => {
        const data = {
          ...validRoomData,
          bedType,
        };
        
        const result = roomCreateSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('deve rejeitar basePrice negativo', () => {
      const invalidData = {
        ...validRoomData,
        basePrice: -10,
      };
      
      const result = roomCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar basePrice zero', () => {
      const validData = {
        ...validRoomData,
        basePrice: 0,
      };
      
      const result = roomCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar notes muito longas', () => {
      const invalidData = {
        ...validRoomData,
        notes: 'A'.repeat(501),
      };
      
      const result = roomCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('deve aceitar campos opcionais como null', () => {
      const data = {
        hotelId: '123e4567-e89b-12d3-a456-426614174000',
        roomNumber: '101',
        floor: null,
        roomTypeId: null,
        maxOccupancy: null,
        bedType: null,
        basePrice: null,
        notes: null,
      };
      
      const result = roomCreateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('roomUpdateSchema', () => {
    it('deve permitir atualização parcial', () => {
      const updateData = {
        roomNumber: '102',
      };
      
      const result = roomUpdateSchema.safeParse(updateData);
      expect(result.success).toBe(true);
    });

    it('deve não permitir atualizar hotelId', () => {
      const updateData = {
        hotelId: '123e4567-e89b-12d3-a456-426614174000',
        roomNumber: '102',
      };
      
      const result = roomUpdateSchema.safeParse(updateData);
      // hotelId deve ser omitido
      if (result.success) {
        expect(result.data.hotelId).toBeUndefined();
      }
    });
  });
});

