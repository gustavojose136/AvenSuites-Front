export type DocumentType = 'CPF' | 'RG' | 'CNH' | 'Passport';

export const applyDocumentMask = (value: string, documentType: DocumentType): string => {
  const numbers = value.replace(/\D/g, '');

  switch (documentType) {
    case 'CPF':
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
      if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;

    case 'RG':
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
      if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}-${numbers.slice(8, 9)}`;

    case 'CNH':
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
      if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;

    case 'Passport':
      const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      return cleaned.slice(0, 9);

    default:
      return numbers;
  }
};

export const validateCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, '');

  if (numbers.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numbers)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(numbers.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(numbers.charAt(10))) return false;

  return true;
};

export const validateRG = (rg: string): boolean => {
  const numbers = rg.replace(/\D/g, '');
  return numbers.length >= 6 && numbers.length <= 9;
};

export const validateCNH = (cnh: string): boolean => {
  const numbers = cnh.replace(/\D/g, '');
  return numbers.length === 11;
};

export const validatePassport = (passport: string): boolean => {
  const cleaned = passport.replace(/\s/g, '').toUpperCase();
  if (cleaned.length < 6 || cleaned.length > 9) return false;
  return /^[A-Z0-9]+$/.test(cleaned);
};

export const validateDocument = (document: string, documentType: DocumentType): boolean => {
  const cleaned = document.replace(/\D/g, '');

  if (cleaned.length === 0) return false;

  switch (documentType) {
    case 'CPF':
      return validateCPF(document);
    case 'RG':
      return validateRG(document);
    case 'CNH':
      return validateCNH(document);
    case 'Passport':
      return validatePassport(document);
    default:
      return cleaned.length >= 3;
  }
};

export const getDocumentMaxLength = (documentType: DocumentType): number => {
  switch (documentType) {
    case 'CPF':
      return 14;
    case 'RG':
      return 12;
    case 'CNH':
      return 14;
    case 'Passport':
      return 9;
    default:
      return 20;
  }
};

export const getDocumentPlaceholder = (documentType: DocumentType): string => {
  switch (documentType) {
    case 'CPF':
      return '000.000.000-00';
    case 'RG':
      return '00.000.000-0';
    case 'CNH':
      return '000.000.000-00';
    case 'Passport':
      return 'AB123456';
    default:
      return 'Número do documento';
  }
};

