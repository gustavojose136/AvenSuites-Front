import {
  applyDocumentMask,
  validateCPF,
  validateRG,
  validateCNH,
  validatePassport,
  validateDocument,
  getDocumentMaxLength,
  getDocumentPlaceholder,
  type DocumentType,
} from '../documentUtils';

describe('documentUtils', () => {
  describe('applyDocumentMask', () => {
    it('deve aplicar máscara de CPF corretamente', () => {
      expect(applyDocumentMask('12345678901', 'CPF')).toBe('123.456.789-01');
      expect(applyDocumentMask('123', 'CPF')).toBe('123');
      expect(applyDocumentMask('123456', 'CPF')).toBe('123.456');
      expect(applyDocumentMask('123456789', 'CPF')).toBe('123.456.789');
    });

    it('deve aplicar máscara de RG corretamente', () => {
      expect(applyDocumentMask('123456789', 'RG')).toBe('12.345.678-9');
      expect(applyDocumentMask('12', 'RG')).toBe('12');
      expect(applyDocumentMask('12345', 'RG')).toBe('12.345');
    });

    it('deve aplicar máscara de CNH corretamente', () => {
      expect(applyDocumentMask('12345678901', 'CNH')).toBe('123.456.789-01');
      expect(applyDocumentMask('123', 'CNH')).toBe('123');
    });

    it('deve aplicar máscara de Passaporte corretamente', () => {
      expect(applyDocumentMask('ab123456', 'Passport')).toBe('AB123456');
      expect(applyDocumentMask('AB123456789', 'Passport')).toBe('AB1234567');
    });

    it('deve remover caracteres não numéricos antes de aplicar máscara', () => {
      expect(applyDocumentMask('123.456.789-01', 'CPF')).toBe('123.456.789-01');
      expect(applyDocumentMask('abc123def456', 'CPF')).toBe('123.456');
    });
  });

  describe('validateCPF', () => {
    it('deve validar CPF válido', () => {
      expect(validateCPF('11144477735')).toBe(true);
      expect(validateCPF('123.456.789-09')).toBe(true);
    });

    it('deve rejeitar CPF inválido', () => {
      expect(validateCPF('11111111111')).toBe(false);
      expect(validateCPF('12345678901')).toBe(false);
      expect(validateCPF('123')).toBe(false);
    });

    it('deve rejeitar CPF com tamanho incorreto', () => {
      expect(validateCPF('123456789')).toBe(false);
      expect(validateCPF('123456789012')).toBe(false);
    });
  });

  describe('validateRG', () => {
    it('deve validar RG com tamanho correto', () => {
      expect(validateRG('123456')).toBe(true);
      expect(validateRG('123456789')).toBe(true);
      expect(validateRG('12.345.678-9')).toBe(true);
    });

    it('deve rejeitar RG com tamanho incorreto', () => {
      expect(validateRG('12345')).toBe(false);
      expect(validateRG('1234567890')).toBe(false);
    });
  });

  describe('validateCNH', () => {
    it('deve validar CNH com 11 dígitos', () => {
      expect(validateCNH('12345678901')).toBe(true);
      expect(validateCNH('123.456.789-01')).toBe(true);
    });

    it('deve rejeitar CNH com tamanho incorreto', () => {
      expect(validateCNH('1234567890')).toBe(false);
      expect(validateCNH('123456789012')).toBe(false);
    });
  });

  describe('validatePassport', () => {
    it('deve validar passaporte válido', () => {
      expect(validatePassport('AB123456')).toBe(true);
      expect(validatePassport('ab123456')).toBe(true);
      expect(validatePassport('AB 123 456')).toBe(true);
    });

    it('deve rejeitar passaporte inválido', () => {
      expect(validatePassport('AB123')).toBe(false);
      expect(validatePassport('AB1234567890')).toBe(false);
      expect(validatePassport('AB@123456')).toBe(false);
      expect(validatePassport('AB')).toBe(false);
      expect(validatePassport('')).toBe(false);
    });
  });

  describe('validateDocument', () => {
    it('deve validar documentos corretamente por tipo', () => {
      expect(validateDocument('11144477735', 'CPF')).toBe(true);
      expect(validateDocument('123456', 'RG')).toBe(true);
      expect(validateDocument('12345678901', 'CNH')).toBe(true);
      expect(validateDocument('AB123456', 'Passport')).toBe(true);
    });

    it('deve rejeitar documentos inválidos', () => {
      expect(validateDocument('11111111111', 'CPF')).toBe(false);
      expect(validateDocument('12345', 'RG')).toBe(false);
      expect(validateDocument('', 'CPF')).toBe(false);
    });
  });

  describe('getDocumentMaxLength', () => {
    it('deve retornar tamanho máximo correto para cada tipo', () => {
      expect(getDocumentMaxLength('CPF')).toBe(14);
      expect(getDocumentMaxLength('RG')).toBe(12);
      expect(getDocumentMaxLength('CNH')).toBe(14);
      expect(getDocumentMaxLength('Passport')).toBe(9);
    });
  });

  describe('getDocumentPlaceholder', () => {
    it('deve retornar placeholder correto para cada tipo', () => {
      expect(getDocumentPlaceholder('CPF')).toBe('000.000.000-00');
      expect(getDocumentPlaceholder('RG')).toBe('00.000.000-0');
      expect(getDocumentPlaceholder('CNH')).toBe('000.000.000-00');
      expect(getDocumentPlaceholder('Passport')).toBe('AB123456');
    });
  });
});

