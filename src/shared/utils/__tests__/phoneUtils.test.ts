import {
  applyPhoneMask,
  validatePhone,
  formatPhoneForAPI,
  getPhonePlaceholder,
} from '../phoneUtils';

describe('phoneUtils', () => {
  describe('applyPhoneMask', () => {
    it('deve aplicar máscara de telefone corretamente', () => {
      expect(applyPhoneMask('11987654321')).toBe('(11) 98765-4321');
      expect(applyPhoneMask('1133334444')).toBe('(11) 3333-4444');
      expect(applyPhoneMask('11')).toBe('(11)');
      expect(applyPhoneMask('119')).toBe('(11) 9');
      expect(applyPhoneMask('11987')).toBe('(11) 987');
      expect(applyPhoneMask('1198765')).toBe('(11) 9876-5');
    });

    it('deve remover caracteres não numéricos antes de aplicar máscara', () => {
      expect(applyPhoneMask('(11) 98765-4321')).toBe('(11) 98765-4321');
      expect(applyPhoneMask('abc11987654321def')).toBe('(11) 98765-4321');
    });

    it('deve retornar string vazia para entrada vazia', () => {
      expect(applyPhoneMask('')).toBe('');
    });
  });

  describe('validatePhone', () => {
    it('deve validar telefone celular válido', () => {
      expect(validatePhone('(11) 98765-4321')).toBe(true);
      expect(validatePhone('11987654321')).toBe(true);
      expect(validatePhone('(21) 99999-9999')).toBe(true);
    });

    it('deve validar telefone fixo válido', () => {
      expect(validatePhone('(11) 3333-4444')).toBe(true);
      expect(validatePhone('1133334444')).toBe(true);
      expect(validatePhone('(21) 2222-3333')).toBe(true);
    });

    it('deve rejeitar telefone com DDD inválido', () => {
      expect(validatePhone('(00) 98765-4321')).toBe(false);
      expect(validatePhone('(10) 3333-4444')).toBe(false);
    });

    it('deve rejeitar telefone com tamanho incorreto', () => {
      expect(validatePhone('(11) 9876-543')).toBe(false);
      expect(validatePhone('119876543')).toBe(false);
      expect(validatePhone('(11) 98765-43212')).toBe(false);
    });

    it('deve rejeitar celular que não começa com 9', () => {
      expect(validatePhone('(11) 88765-4321')).toBe(false);
      expect(validatePhone('(11) 78765-4321')).toBe(false);
    });

    it('deve rejeitar fixo que começa com 0 ou 1', () => {
      expect(validatePhone('(11) 0333-4444')).toBe(false);
      expect(validatePhone('(11) 1333-4444')).toBe(false);
    });
  });

  describe('formatPhoneForAPI', () => {
    it('deve formatar telefone para API com +55', () => {
      expect(formatPhoneForAPI('(11) 98765-4321')).toBe('+5511987654321');
      expect(formatPhoneForAPI('11987654321')).toBe('+5511987654321');
      expect(formatPhoneForAPI('(11) 3333-4444')).toBe('+551133334444');
    });

    it('deve manter formato se já tiver +55', () => {
      expect(formatPhoneForAPI('+5511987654321')).toBe('+5511987654321');
    });

    it('deve retornar string original se não conseguir formatar', () => {
      expect(formatPhoneForAPI('invalid')).toBe('invalid');
    });
  });

  describe('getPhonePlaceholder', () => {
    it('deve retornar placeholder correto', () => {
      expect(getPhonePlaceholder()).toBe('(00) 00000-0000');
    });
  });
});

