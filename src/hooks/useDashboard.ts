/**
 * Hook para gerenciar dados do Dashboard
 */

import { useState, useEffect } from 'react';
import { dashboardService, DashboardStats, Invoice } from '@/services/dashboard.service';
import toast from 'react-hot-toast';

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
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
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
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

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    loading,
    error,
    refetch: fetchInvoices,
  };
}

