/**
 * Testes: BookingCard Component
 * Testa o componente de card de reserva
 * SOLID - Single Responsibility: Testa apenas renderização e interações
 */

import { render, screen } from '@testing-library/react';
import { BookingCard } from '../BookingCard';
import { Booking } from '@/application/dto/Booking.dto';

// Mock do useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('BookingCard', () => {
  const mockBooking: Booking = {
    id: '1',
    code: 'BK001',
    status: 'CONFIRMED',
    source: 'WEB',
    checkInDate: '2024-12-01',
    checkOutDate: '2024-12-05',
    adults: 2,
    children: 1,
    currency: 'BRL',
    totalAmount: 600,
    mainGuestId: 'guest-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    mainGuest: {
      id: 'guest-1',
      fullName: 'João Silva',
      email: 'joao@example.com',
      phone: '+5511999999999',
    },
    bookingRooms: [],
    payments: [],
  };

  const mockHandlers = {
    onViewDetails: jest.fn(),
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar informações da reserva', () => {
    render(<BookingCard booking={mockBooking} {...mockHandlers} />);

    expect(screen.getByText(/BK001/)).toBeInTheDocument();
    expect(screen.getByText(/João Silva/)).toBeInTheDocument();
    expect(screen.getByText(/Confirmada/)).toBeInTheDocument();
  });

  it('deve exibir email do hóspede quando disponível', () => {
    render(<BookingCard booking={mockBooking} {...mockHandlers} />);

    expect(screen.getByText(/joao@example.com/)).toBeInTheDocument();
  });

  it('deve exibir telefone do hóspede quando disponível', () => {
    render(<BookingCard booking={mockBooking} {...mockHandlers} />);

    expect(screen.getByText(/\+5511999999999/)).toBeInTheDocument();
  });

  it('deve chamar onViewDetails quando botão é clicado', () => {
    render(<BookingCard booking={mockBooking} {...mockHandlers} />);

    const viewButton = screen.getByText(/Ver Detalhes/i);
    if (viewButton) {
      viewButton.click();
      expect(mockHandlers.onViewDetails).toHaveBeenCalledWith('1');
    }
  });

  it('deve exibir botão de confirmar para reservas PENDING', () => {
    const pendingBooking = { ...mockBooking, status: 'PENDING' };
    render(<BookingCard booking={pendingBooking} {...mockHandlers} />);

    expect(screen.getByText(/Confirmar/i)).toBeInTheDocument();
  });

  it('deve exibir botão de cancelar para reservas CONFIRMED', () => {
    render(<BookingCard booking={mockBooking} {...mockHandlers} />);

    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
  });

  it('não deve exibir botão de confirmar para reservas já confirmadas', () => {
    render(<BookingCard booking={mockBooking} {...mockHandlers} />);

    expect(screen.queryByText(/Confirmar/i)).not.toBeInTheDocument();
  });
});

