/**
 * Testes: JWT Helper
 * Testa funções utilitárias para trabalhar com JWT tokens
 */

import { decodeJwtToken, getHotelIdFromToken, getUserInfoFromToken } from '../jwtHelper';

describe('JWT Helper', () => {
  describe('decodeJwtToken', () => {
    it('deve decodificar um token JWT válido', () => {
      const payload = { userId: '123', role: 'Admin', exp: 1234567890 };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      const decoded = decodeJwtToken(token);
      
      expect(decoded).toEqual(payload);
    });

    it('deve retornar null para token inválido (menos de 3 partes)', () => {
      const token = 'invalid.token';
      
      const decoded = decodeJwtToken(token);
      
      expect(decoded).toBeNull();
    });

    it('deve retornar null para token com formato inválido', () => {
      const token = 'not.a.valid.jwt.token';
      
      const decoded = decodeJwtToken(token);
      
      expect(decoded).toBeNull();
    });

    it('deve lidar com Base64URL corretamente', () => {
      const payload = { test: 'value', number: 123 };
      const base64Payload = btoa(JSON.stringify(payload));
      const token = `header.${base64Payload}.signature`;
      
      const decoded = decodeJwtToken(token);
      
      expect(decoded).toEqual(payload);
    });
  });

  describe('getHotelIdFromToken', () => {
    it('deve extrair HotelId do token', () => {
      const payload = { HotelId: 'hotel-123', role: 'Admin' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      const hotelId = getHotelIdFromToken(token);
      
      expect(hotelId).toBe('hotel-123');
    });

    it('deve extrair hotelId (camelCase) do token', () => {
      const payload = { hotelId: 'hotel-456', role: 'Admin' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      const hotelId = getHotelIdFromToken(token);
      
      expect(hotelId).toBe('hotel-456');
    });

    it('deve extrair hotel_id (snake_case) do token', () => {
      const payload = { hotel_id: 'hotel-789', role: 'Admin' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      const hotelId = getHotelIdFromToken(token);
      
      expect(hotelId).toBe('hotel-789');
    });

    it('deve retornar null quando não há token', () => {
      const hotelId = getHotelIdFromToken(null);
      
      expect(hotelId).toBeNull();
    });

    it('deve retornar null quando não há hotelId no token', () => {
      const payload = { role: 'Admin' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      const hotelId = getHotelIdFromToken(token);
      
      expect(hotelId).toBeNull();
    });
  });

  describe('getUserInfoFromToken', () => {
    it('deve extrair informações do usuário do token', () => {
      const payload = {
        nameid: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        HotelId: 'hotel-123',
        role: 'Admin',
        exp: 1234567890,
      };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      const userInfo = getUserInfoFromToken(token);
      
      expect(userInfo).toEqual({
        userId: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        hotelId: 'hotel-123',
        role: 'Admin',
        exp: 1234567890,
      });
    });

    it('deve usar sub como fallback para userId', () => {
      const payload = {
        sub: 'user-456',
        unique_name: 'Jane Doe',
        role: 'Manager',
      };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      const userInfo = getUserInfoFromToken(token);
      
      expect(userInfo?.userId).toBe('user-456');
      expect(userInfo?.name).toBe('Jane Doe');
    });

    it('deve retornar null quando não há token', () => {
      const userInfo = getUserInfoFromToken(null);
      
      expect(userInfo).toBeNull();
    });

    it('deve retornar null para token inválido', () => {
      const userInfo = getUserInfoFromToken('invalid.token');
      
      expect(userInfo).toBeNull();
    });

    it('deve lidar com campos opcionais ausentes', () => {
      const payload = { role: 'Guest' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      const userInfo = getUserInfoFromToken(token);
      
      expect(userInfo).toEqual({
        userId: null,
        name: null,
        email: null,
        hotelId: null,
        role: 'Guest',
        exp: null,
      });
    });
  });
});

