/**
 * Utilitário: Room Price Calculator
 * Calcula preços de quartos baseado em ocupação
 * SOLID - Single Responsibility: Apenas cálculo de preços
 */

import { RoomTypeSummary, RoomTypeOccupancyPrice } from '@/application/dto/Room.dto';

/**
 * Calcula o preço por noite baseado na ocupação
 * @param roomType - Tipo de quarto com preços de ocupação
 * @param totalGuests - Número total de hóspedes (adults + children)
 * @returns Preço por noite
 */
export function calculatePricePerNight(
  roomType: RoomTypeSummary | undefined,
  totalGuests: number
): number {
  if (!roomType) {
    return 0;
  }

  // Busca preço específico para a ocupação
  const occupancyPrice = roomType.occupancyPrices?.find(
    (op: RoomTypeOccupancyPrice) => op.occupancy === totalGuests
  );

  // Se encontrou preço específico, usa ele; senão usa basePrice como fallback
  return occupancyPrice ? occupancyPrice.pricePerNight : roomType.basePrice;
}

/**
 * Calcula o preço total do quarto para o período
 * @param roomType - Tipo de quarto com preços de ocupação
 * @param totalGuests - Número total de hóspedes (adults + children)
 * @param numberOfNights - Número de noites
 * @returns Preço total
 */
export function calculateRoomPrice(
  roomType: RoomTypeSummary | undefined,
  totalGuests: number,
  numberOfNights: number
): number {
  const pricePerNight = calculatePricePerNight(roomType, totalGuests);
  return pricePerNight * numberOfNights;
}

/**
 * Obtém o preço formatado para exibição
 * @param price - Preço em número
 * @param currency - Moeda (padrão: BRL)
 * @returns Preço formatado
 */
export function formatRoomPrice(price: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(price);
}




