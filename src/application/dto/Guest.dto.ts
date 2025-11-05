/**
 * DTO: Guest
 * Data Transfer Object para Hóspedes
 */

export interface Guest {
  id: string;
  hotelId: string;
  fullName: string;
  email?: string;
  phoneE164?: string;
  documentType?: string;
  documentPlain?: string;
  birthDate?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode: string;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuestCreateRequest {
  hotelId: string;
  fullName: string;
  email?: string;
  phoneE164?: string;
  documentType?: string;
  documentPlain?: string;
  birthDate?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  marketingConsent?: boolean;
}

export interface GuestUpdateRequest extends Partial<GuestCreateRequest> {}

