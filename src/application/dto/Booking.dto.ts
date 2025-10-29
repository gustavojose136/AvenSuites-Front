/**
 * DTO: Booking
 * Data Transfer Object para Reservas
 */

export interface GuestSummary {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface BookingRoom {
  id: string;
  roomId: string;
  roomNumber: string;
  roomTypeName: string;
  priceTotal: number;
  notes?: string;
}

export interface BookingPayment {
  id: string;
  method: string;
  status: string;
  amount: number;
  currency: string;
  paidAt?: string;
}

export interface Booking {
  id: string;
  code: string;
  status: string;
  source: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  currency: string;
  totalAmount: number;
  mainGuestId: string;
  channelRef?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  mainGuest?: GuestSummary;
  bookingRooms: BookingRoom[];
  payments: BookingPayment[];
}

export interface BookingCreateRequest {
  hotelId: string;
  mainGuestId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children?: number;
  source?: string;
  currency?: string;
  roomIds: string[];
  channelRef?: string;
  notes?: string;
}

export interface BookingUpdateRequest {
  checkInDate?: string;
  checkOutDate?: string;
  adults?: number;
  children?: number;
  status?: string;
  notes?: string;
}

