/**
 * DTO: Hotel
 * Data Transfer Object para Hotéis
 */

export interface Hotel {
  id: string;
  name: string;
  tradeName?: string;
  cnpj?: string;
  email?: string;
  phoneE164?: string;
  timezone: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface HotelCreateRequest {
  name: string;
  tradeName?: string;
  cnpj?: string;
  email?: string;
  phoneE164?: string;
  timezone: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode: string;
  status?: string;
}

export interface HotelUpdateRequest extends Partial<HotelCreateRequest> {}

