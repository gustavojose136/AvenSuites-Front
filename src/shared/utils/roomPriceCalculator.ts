

import { RoomTypeSummary, RoomTypeOccupancyPrice } from '@/application/dto/Room.dto';

export function calculatePricePerNight(
  roomType: RoomTypeSummary | undefined,
  totalGuests: number
): number {
  if (!roomType) {
    return 0;
  }

  const occupancyPrice = roomType.occupancyPrices?.find(
    (op: RoomTypeOccupancyPrice) => op.occupancy === totalGuests
  );

  return occupancyPrice ? occupancyPrice.pricePerNight : roomType.basePrice;
}

export function calculateRoomPrice(
  roomType: RoomTypeSummary | undefined,
  totalGuests: number,
  numberOfNights: number
): number {
  const pricePerNight = calculatePricePerNight(roomType, totalGuests);
  return pricePerNight * numberOfNights;
}

export function formatRoomPrice(price: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(price);
}


