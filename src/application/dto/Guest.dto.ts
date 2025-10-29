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
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuestCreateRequest {
  hotelId: string;
  fullName: string;
  email?: string;
  phoneE164?: string;
  marketingConsent?: boolean;
}

export interface GuestUpdateRequest extends Partial<GuestCreateRequest> {}

