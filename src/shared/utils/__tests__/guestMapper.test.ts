/**
 * Testes: Guest Mapper
 * Testa funções de mapeamento de dados de hóspedes
 */

import { mapFormDataToApiRequest, mapApiResponseToFormData } from '../guestMapper';
import { GuestFormData } from '../../validators/guestSchema';

describe('Guest Mapper', () => {
  describe('mapFormDataToApiRequest', () => {
    it('deve mapear dados do formulário para formato da API', () => {
      const formData: GuestFormData = {
        hotelId: 'hotel-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneE164: '+5511999999999',
        documentType: 'CPF',
        documentNumber: '123.456.789-00',
        birthDate: '1990-01-01',
        address: 'Rua Test, 123',
        addressLine2: 'Apto 45',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01234567',
        countryCode: 'BR',
        marketingConsent: true,
      };

      const apiRequest = mapFormDataToApiRequest(formData);

      expect(apiRequest).toEqual({
        hotelId: 'hotel-123',
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneE164: '+5511999999999',
        documentType: 'CPF',
        documentPlain: '12345678900',
        birthDate: '1990-01-01',
        addressLine1: 'Rua Test, 123',
        addressLine2: 'Apto 45',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01234567',
        countryCode: 'BR',
        marketingConsent: true,
      });
    });

    it('deve remover formatação do documento', () => {
      const formData: GuestFormData = {
        hotelId: 'hotel-123',
        firstName: 'Jane',
        lastName: 'Smith',
        documentType: 'CPF',
        documentNumber: '987.654.321-00',
      };

      const apiRequest = mapFormDataToApiRequest(formData);

      expect(apiRequest.documentPlain).toBe('98765432100');
    });

    it('deve concatenar firstName e lastName corretamente', () => {
      const formData: GuestFormData = {
        hotelId: 'hotel-123',
        firstName: 'Maria',
        lastName: 'Silva Santos',
        documentType: 'CPF',
        documentNumber: '11122233344',
      };

      const apiRequest = mapFormDataToApiRequest(formData);

      expect(apiRequest.fullName).toBe('Maria Silva Santos');
    });

    it('deve usar BR como padrão para countryCode', () => {
      const formData: GuestFormData = {
        hotelId: 'hotel-123',
        firstName: 'Test',
        lastName: 'User',
        documentType: 'CPF',
        documentNumber: '12345678900',
      };

      const apiRequest = mapFormDataToApiRequest(formData);

      expect(apiRequest.countryCode).toBe('BR');
    });

    it('deve lidar com campos opcionais ausentes', () => {
      const formData: GuestFormData = {
        hotelId: 'hotel-123',
        firstName: 'Minimal',
        lastName: 'User',
        documentType: 'CPF',
        documentNumber: '12345678900',
      };

      const apiRequest = mapFormDataToApiRequest(formData);

      expect(apiRequest.email).toBeUndefined();
      expect(apiRequest.phoneE164).toBeUndefined();
      expect(apiRequest.birthDate).toBeUndefined();
    });
  });

  describe('mapApiResponseToFormData', () => {
    it('deve mapear dados da API para formato do formulário', () => {
      const apiData = {
        hotelId: 'hotel-123',
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneE164: '+5511999999999',
        documentType: 'CPF',
        documentPlain: '12345678900',
        birthDate: '1990-01-01',
        addressLine1: 'Rua Test, 123',
        addressLine2: 'Apto 45',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01234567',
        countryCode: 'BR',
        marketingConsent: true,
      };

      const formData = mapApiResponseToFormData(apiData);

      expect(formData).toEqual({
        hotelId: 'hotel-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneE164: '+5511999999999',
        documentType: 'CPF',
        documentNumber: '12345678900',
        birthDate: '1990-01-01',
        address: 'Rua Test, 123',
        addressLine2: 'Apto 45',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01234567',
        countryCode: 'BR',
        marketingConsent: true,
      });
    });

    it('deve separar fullName em firstName e lastName', () => {
      const apiData = {
        hotelId: 'hotel-123',
        fullName: 'Maria Silva Santos',
        documentType: 'CPF',
        documentPlain: '11122233344',
      };

      const formData = mapApiResponseToFormData(apiData);

      expect(formData.firstName).toBe('Maria');
      expect(formData.lastName).toBe('Silva Santos');
    });

    it('deve lidar com nome único (sem sobrenome)', () => {
      const apiData = {
        hotelId: 'hotel-123',
        fullName: 'Madonna',
        documentType: 'Passport',
        documentPlain: 'AB123456',
      };

      const formData = mapApiResponseToFormData(apiData);

      expect(formData.firstName).toBe('Madonna');
      expect(formData.lastName).toBe('');
    });

    it('deve usar CPF como padrão para documentType', () => {
      const apiData = {
        hotelId: 'hotel-123',
        fullName: 'Test User',
        documentPlain: '12345678900',
      };

      const formData = mapApiResponseToFormData(apiData);

      expect(formData.documentType).toBe('CPF');
    });

    it('deve usar BR como padrão para countryCode', () => {
      const apiData = {
        hotelId: 'hotel-123',
        fullName: 'Test User',
        documentType: 'CPF',
        documentPlain: '12345678900',
      };

      const formData = mapApiResponseToFormData(apiData);

      expect(formData.countryCode).toBe('BR');
    });

    it('deve lidar com campos opcionais ausentes', () => {
      const apiData = {
        hotelId: 'hotel-123',
        fullName: 'Minimal User',
        documentType: 'CPF',
        documentPlain: '12345678900',
      };

      const formData = mapApiResponseToFormData(apiData);

      expect(formData.email).toBeUndefined();
      expect(formData.phoneE164).toBeUndefined();
      expect(formData.birthDate).toBeUndefined();
    });
  });
});

