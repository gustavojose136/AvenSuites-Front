/**
 * Utility: Guest Mapper
 * Mapeia dados do formulário para o formato da API
 */

import { GuestFormData } from '../validators/guestSchema';
import { GuestCreateRequest } from '@/application/dto/Guest.dto';

/**
 * Transforma dados do formulário para o formato esperado pela API
 */
export function mapFormDataToApiRequest(formData: GuestFormData): GuestCreateRequest {
  // Concatena firstName e lastName para fullName
  const fullName = `${formData.firstName} ${formData.lastName}`.trim();
  
  // Remove formatação do documento (mantém apenas dígitos)
  const documentPlain = formData.documentNumber.replace(/\D/g, '');
  
  return {
    hotelId: formData.hotelId,
    fullName: fullName,
    email: formData.email || undefined,
    phoneE164: formData.phoneE164 || undefined,
    documentType: formData.documentType,
    documentPlain: documentPlain,
    birthDate: formData.birthDate || undefined,
    addressLine1: formData.address || undefined,
    addressLine2: formData.addressLine2 || undefined,
    city: formData.city || undefined,
    state: formData.state || undefined,
    postalCode: formData.postalCode || undefined,
    countryCode: formData.countryCode || 'BR',
    marketingConsent: formData.marketingConsent || false,
  };
}

/**
 * Transforma dados da API para o formato do formulário
 */
export function mapApiResponseToFormData(apiData: any): Partial<GuestFormData> {
  // Separa fullName em firstName e lastName
  const nameParts = (apiData.fullName || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  return {
    hotelId: apiData.hotelId,
    firstName: firstName,
    lastName: lastName,
    email: apiData.email,
    phoneE164: apiData.phoneE164,
    documentType: apiData.documentType || 'CPF',
    documentNumber: apiData.documentPlain || '',
    birthDate: apiData.birthDate,
    address: apiData.addressLine1,
    addressLine2: apiData.addressLine2,
    city: apiData.city,
    state: apiData.state,
    postalCode: apiData.postalCode,
    countryCode: apiData.countryCode || 'BR',
    marketingConsent: apiData.marketingConsent || false,
  };
}

