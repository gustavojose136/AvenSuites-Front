

import { GuestFormData } from '../validators/guestSchema';
import { GuestCreateRequest } from '@/application/dto/Guest.dto';

export function mapFormDataToApiRequest(formData: GuestFormData): GuestCreateRequest {

  const fullName = `${formData.firstName} ${formData.lastName}`.trim();

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

export function mapApiResponseToFormData(apiData: any): Partial<GuestFormData> {

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

