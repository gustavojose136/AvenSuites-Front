/**
 * Hook para gerenciar dados do Dashboard
 */

import { useState, useEffect, useCallback } from 'react';
import { dashboardService, DashboardStats, Invoice, Booking } from '@/services/dashboard.service';
import toast from 'react-hot-toast';

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [weekBookings, setWeekBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 Buscando estatísticas do dashboard...');
      const data = await dashboardService.getDashboardStats();
      console.log('✅ Estatísticas carregadas:', data);
      setStats(data);
    } catch (err: any) {
      console.error('❌ Erro ao carregar dashboard:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar dados do dashboard';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeekBookings = useCallback(async (hotelId?: string) => {
    try {
      console.log('📅 Buscando reservas da semana...');
      const bookings = await dashboardService.getBookings(hotelId);
      
      // Filtrar reservas da semana atual
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado
      endOfWeek.setHours(23, 59, 59, 999);
      
      const weekBookings = bookings.filter(booking => {
        const checkIn = new Date(booking.checkInDate);
        const checkOut = new Date(booking.checkOutDate);
        
        // Reservas que têm check-in ou check-out na semana
        return (checkIn >= startOfWeek && checkIn <= endOfWeek) ||
               (checkOut >= startOfWeek && checkOut <= endOfWeek) ||
               (checkIn <= startOfWeek && checkOut >= endOfWeek);
      }).sort((a, b) => {
        // Ordenar por data de check-in
        return new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime();
      });
      
      console.log(`✅ ${weekBookings.length} reservas da semana encontradas`);
      setWeekBookings(weekBookings);
    } catch (err: any) {
      console.error('❌ Erro ao buscar reservas da semana:', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    weekBookings,
    loading,
    error,
    refetch: fetchStats,
    refetchWeekBookings: fetchWeekBookings,
  };
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📄 Buscando notas fiscais...');
      const data = await dashboardService.getInvoices();
      console.log('✅ Notas fiscais carregadas:', data.length);
      setInvoices(data);
    } catch (err: any) {
      console.error('❌ Erro ao carregar notas fiscais:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar notas fiscais';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (bookingId: string) => {
    try {
      console.log(`📄 [useInvoices] Criando nota fiscal para reserva ${bookingId}...`);
      const invoice = await dashboardService.createInvoice(bookingId);
      console.log(`✅ [useInvoices] Nota fiscal criada:`, invoice);
      toast.success('Nota fiscal criada com sucesso!');
      
      // Atualizar lista de invoices
      await fetchInvoices();
      
      return invoice;
    } catch (err: any) {
      console.error('❌ [useInvoices] Erro ao criar nota fiscal:', err);
      
      let errorMessage = 'Erro ao criar nota fiscal';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (typeof err.response?.data === 'string') {
        errorMessage = err.response.data;
      }
      
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    loading,
    error,
    refetch: fetchInvoices,
    createInvoice,
  };
}

