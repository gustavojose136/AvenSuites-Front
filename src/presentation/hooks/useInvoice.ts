/**
 * Hook: useInvoice
 * Custom hook para gerenciar notas fiscais
 * Princípio: Single Responsibility - Responsável apenas por lógica de invoices
 */

'use client';

import { useState, useCallback } from 'react';
import { IInvoiceService } from '@/domain/services/IInvoiceService';
import { Invoice, InvoiceCreateRequest, InvoiceUpdateRequest, InvoicePayRequest } from '@/application/dto/Invoice.dto';

export const useInvoice = (invoiceService: IInvoiceService) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async (params?: { status?: string; startDate?: string; endDate?: string; guestId?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await invoiceService.getInvoices(params);
      setInvoices(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar notas fiscais';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [invoiceService]);

  const fetchInvoiceById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await invoiceService.getInvoice(id);
      setSelectedInvoice(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar nota fiscal';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [invoiceService]);

  const createInvoice = useCallback(async (data: InvoiceCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newInvoice = await invoiceService.createInvoice(data);
      setInvoices(prev => [...prev, newInvoice]);
      return newInvoice;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar nota fiscal';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [invoiceService]);

  const updateInvoice = useCallback(async (id: string, data: InvoiceUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedInvoice = await invoiceService.updateInvoice(id, data);
      setInvoices(prev => prev.map(i => i.id === id ? updatedInvoice : i));
      if (selectedInvoice?.id === id) {
        setSelectedInvoice(updatedInvoice);
      }
      return updatedInvoice;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar nota fiscal';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [invoiceService, selectedInvoice]);

  const payInvoice = useCallback(async (id: string, data: InvoicePayRequest) => {
    setLoading(true);
    setError(null);
    try {
      const paidInvoice = await invoiceService.payInvoice(id, data);
      setInvoices(prev => prev.map(i => i.id === id ? paidInvoice : i));
      if (selectedInvoice?.id === id) {
        setSelectedInvoice(paidInvoice);
      }
      return paidInvoice;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao registrar pagamento';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [invoiceService, selectedInvoice]);

  const deleteInvoice = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await invoiceService.deleteInvoice(id);
      setInvoices(prev => prev.filter(i => i.id !== id));
      if (selectedInvoice?.id === id) {
        setSelectedInvoice(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar nota fiscal';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [invoiceService, selectedInvoice]);

  return {
    invoices,
    selectedInvoice,
    loading,
    error,
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoice,
    payInvoice,
    deleteInvoice,
  };
};

