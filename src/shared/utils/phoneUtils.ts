export const applyPhoneMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length === 0) return '';

  if (numbers.length <= 2) {
    return numbers.length === 1 ? `(${numbers}` : `(${numbers})`;
  }

  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export const validatePhone = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length < 10) return false;
  if (numbers.length > 11) return false;
  
  const ddd = numbers.slice(0, 2);
  const validDDDs = [
    '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '21', '22', '24', '27', '28',
    '31', '32', '33', '34', '35', '37', '38',
    '41', '42', '43', '44', '45', '46', '47', '48', '49',
    '51', '53', '54', '55',
    '61',
    '62', '63', '64',
    '65', '66', '67', '68', '69',
    '71', '73', '74', '75', '77',
    '79',
    '81', '82', '83', '84', '85', '86', '87', '88', '89',
    '91', '92', '93', '94', '95', '96', '97', '98', '99'
  ];
  
  if (!validDDDs.includes(ddd)) return false;
  
  if (numbers.length === 10) {
    const firstDigit = numbers[2];
    return firstDigit !== '0' && firstDigit !== '1';
  }
  
  if (numbers.length === 11) {
    const firstDigit = numbers[2];
    return firstDigit === '9';
  }
  
  return false;
};

export const formatPhoneForAPI = (phone: string): string => {
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length === 10 || numbers.length === 11) {
    return `+55${numbers}`;
  }
  
  if (phone.startsWith('+55')) {
    return phone;
  }
  
  return phone;
};

export const getPhonePlaceholder = (): string => {
  return '(00) 00000-0000';
};

