/**
 * Testes: Room Price Calculator
 * Testa o cálculo de preços de quartos baseado em ocupação
 * SOLID - Single Responsibility: Testa apenas a lógica de cálculo
 */

import {
  calculatePricePerNight,
  calculateRoomPrice,
  formatRoomPrice,
} from '../roomPriceCalculator';
import { RoomTypeSummary, RoomTypeOccupancyPrice } from '@/application/dto/Room.dto';

describe('Room Price Calculator', () => {
  const mockRoomType: RoomTypeSummary = {
    id: '1',
    code: 'STD',
    name: 'Standard',
    description: 'Quarto padrão',
    capacityAdults: 2,
    capacityChildren: 1,
    basePrice: 150,
    active: true,
  };

  const mockRoomTypeWithOccupancy: RoomTypeSummary = {
    ...mockRoomType,
    occupancyPrices: [
      { id: '1', occupancy: 1, pricePerNight: 100 },
      { id: '2', occupancy: 2, pricePerNight: 150 },
      { id: '3', occupancy: 3, pricePerNight: 200 },
    ] as RoomTypeOccupancyPrice[],
  };

  describe('calculatePricePerNight', () => {
    it('deve retornar 0 quando roomType é undefined', () => {
      expect(calculatePricePerNight(undefined, 2)).toBe(0);
    });

    it('deve retornar basePrice quando não há occupancyPrices', () => {
      expect(calculatePricePerNight(mockRoomType, 2)).toBe(150);
    });

    it('deve retornar preço específico quando há occupancyPrices para a ocupação', () => {
      expect(calculatePricePerNight(mockRoomTypeWithOccupancy, 2)).toBe(150);
    });

    it('deve retornar basePrice quando não encontra preço específico na ocupação', () => {
      expect(calculatePricePerNight(mockRoomTypeWithOccupancy, 4)).toBe(150);
    });

    it('deve retornar preço correto para ocupação de 1 pessoa', () => {
      expect(calculatePricePerNight(mockRoomTypeWithOccupancy, 1)).toBe(100);
    });

    it('deve retornar preço correto para ocupação de 3 pessoas', () => {
      expect(calculatePricePerNight(mockRoomTypeWithOccupancy, 3)).toBe(200);
    });
  });

  describe('calculateRoomPrice', () => {
    it('deve calcular preço total para múltiplas noites', () => {
      const pricePerNight = calculatePricePerNight(mockRoomType, 2);
      const total = calculateRoomPrice(mockRoomType, 2, 3);
      expect(total).toBe(pricePerNight * 3);
    });

    it('deve retornar 0 quando roomType é undefined', () => {
      expect(calculateRoomPrice(undefined, 2, 3)).toBe(0);
    });

    it('deve calcular corretamente com preços de ocupação', () => {
      const total = calculateRoomPrice(mockRoomTypeWithOccupancy, 2, 2);
      expect(total).toBe(300); // 150 * 2
    });
  });

  describe('formatRoomPrice', () => {
    it('deve formatar preço em BRL por padrão', () => {
      const formatted = formatRoomPrice(150.50);
      expect(formatted).toContain('R$');
      expect(formatted).toContain('150');
    });

    it('deve formatar preço com duas casas decimais', () => {
      const formatted = formatRoomPrice(150);
      expect(formatted).toMatch(/150[,.]00/);
    });

    it('deve formatar preço com moeda diferente', () => {
      const formatted = formatRoomPrice(150, 'USD');
      expect(formatted).toContain('$');
    });
  });
});

