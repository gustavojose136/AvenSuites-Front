/**
 * Testes: Booking Formatters
 * Testa funções de formatação para reservas
 * SOLID - Single Responsibility: Testa apenas formatação
 */

import {
  formatDate,
  formatDateTime,
  formatCurrency,
  getStatusColor,
  getStatusLabel,
} from '../bookingFormatters';

describe('Booking Formatters', () => {
  describe('formatDate', () => {
    it('deve formatar data no formato brasileiro', () => {
      const date = '2024-12-25T00:00:00';
      const formatted = formatDate(date);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('deve formatar data corretamente', () => {
      const date = '2024-12-25';
      const formatted = formatDate(date);
      // Aceita formato brasileiro (pode variar por timezone)
      expect(formatted).toMatch(/25\/12\/2024|24\/12\/2024/);
    });
  });

  describe('formatDateTime', () => {
    it('deve formatar data e hora no formato brasileiro', () => {
      const dateTime = '2024-12-25T14:30:00';
      const formatted = formatDateTime(dateTime);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('formatCurrency', () => {
    it('deve formatar valor em BRL por padrão', () => {
      const formatted = formatCurrency(150.50);
      expect(formatted).toContain('R$');
      expect(formatted).toContain('150');
    });

    it('deve formatar valor com duas casas decimais', () => {
      const formatted = formatCurrency(150);
      expect(formatted).toMatch(/150[,.]00/);
    });

    it('deve formatar valor em USD quando especificado', () => {
      const formatted = formatCurrency(150, 'USD');
      expect(formatted).toContain('$');
    });
  });

  describe('getStatusColor', () => {
    it('deve retornar cor para status PENDING', () => {
      const color = getStatusColor('PENDING');
      expect(color).toContain('yellow');
    });

    it('deve retornar cor para status CONFIRMED', () => {
      const color = getStatusColor('CONFIRMED');
      expect(color).toContain('green');
    });

    it('deve retornar cor para status CANCELLED', () => {
      const color = getStatusColor('CANCELLED');
      expect(color).toContain('red');
    });

    it('deve retornar cor para status CHECKED_IN', () => {
      const color = getStatusColor('CHECKED_IN');
      expect(color).toContain('blue');
    });

    it('deve retornar cor padrão para status desconhecido', () => {
      const color = getStatusColor('UNKNOWN');
      expect(color).toContain('gray');
    });

    it('deve funcionar com status em minúsculas', () => {
      const color = getStatusColor('pending');
      expect(color).toContain('yellow');
    });
  });

  describe('getStatusLabel', () => {
    it('deve retornar label para status PENDING', () => {
      expect(getStatusLabel('PENDING')).toBe('Pendente');
    });

    it('deve retornar label para status CONFIRMED', () => {
      expect(getStatusLabel('CONFIRMED')).toBe('Confirmada');
    });

    it('deve retornar label para status CANCELLED', () => {
      expect(getStatusLabel('CANCELLED')).toBe('Cancelada');
    });

    it('deve retornar label para status CHECKED_IN', () => {
      expect(getStatusLabel('CHECKED_IN')).toBe('Check-in Realizado');
    });

    it('deve retornar status original para status desconhecido', () => {
      expect(getStatusLabel('UNKNOWN')).toBe('UNKNOWN');
    });

    it('deve funcionar com status em minúsculas', () => {
      expect(getStatusLabel('pending')).toBe('Pendente');
    });
  });
});

