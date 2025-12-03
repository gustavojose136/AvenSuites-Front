/**
 * Testes: Validate Email
 * Testa função de validação de email
 */

import { validateEmail } from '../validateEmail';

describe('validateEmail', () => {
  it('deve validar email válido', () => {
    expect(validateEmail('test@example.com')).toBeTruthy();
    expect(validateEmail('user.name@example.com')).toBeTruthy();
    expect(validateEmail('user+tag@example.co.uk')).toBeTruthy();
  });

  it('deve rejeitar email inválido', () => {
    expect(validateEmail('invalid-email')).toBeFalsy();
    expect(validateEmail('@example.com')).toBeFalsy();
    expect(validateEmail('user@')).toBeFalsy();
    expect(validateEmail('user @example.com')).toBeFalsy();
  });

  it('deve converter para lowercase', () => {
    const result = validateEmail('TEST@EXAMPLE.COM');
    expect(result).toBeTruthy();
    expect(result?.[0]).toBe('test@example.com');
  });

  it('deve retornar null para string vazia', () => {
    expect(validateEmail('')).toBeFalsy();
  });

  it('deve validar emails com subdomínios', () => {
    expect(validateEmail('user@mail.example.com')).toBeTruthy();
  });

  it('deve validar emails com números', () => {
    expect(validateEmail('user123@example.com')).toBeTruthy();
    expect(validateEmail('123@example.com')).toBeTruthy();
  });
});

