/**
 * Utilitário de Diagnóstico da API
 * Testa quais endpoints estão disponíveis
 */

import { httpClient } from '@/infrastructure/http/HttpClient';

export interface DiagnosticResult {
  endpoint: string;
  status: 'success' | 'not_found' | 'error';
  statusCode?: number;
  recordCount?: number;
  error?: string;
}

/**
 * Testa um endpoint específico
 */
async function testEndpoint(endpoint: string): Promise<DiagnosticResult> {
  try {
    const data = await httpClient.get<any[]>(endpoint);
    
    return {
      endpoint,
      status: 'success',
      statusCode: 200,
      recordCount: Array.isArray(data) ? data.length : undefined,
    };
  } catch (error: any) {
    const statusCode = error.response?.status || 0;
    
    if (statusCode === 404) {
      return {
        endpoint,
        status: 'not_found',
        statusCode: 404,
      };
    }
    
    return {
      endpoint,
      status: 'error',
      statusCode,
      error: error.message,
    };
  }
}

/**
 * Testa todos os endpoints comuns
 */
export async function diagnoseAPI(): Promise<DiagnosticResult[]> {

  const endpointsToTest = [
    // Hotéis
    '/Hotel',
    '/Hotels',
    '/hotel',
    '/hotels',
    
    // Quartos
    '/Room',
    '/Rooms',
    '/Quarto',
    '/Quartos',
    '/room',
    '/rooms',
    
    // Hóspedes
    '/Guest',
    '/Guests',
    '/Hospede',
    '/Hospedes',
    '/guest',
    '/guests',
    
    // Reservas
    '/Booking',
    '/Bookings',
    '/Reserva',
    '/Reservas',
    '/booking',
    '/bookings',
    
    // Notas Fiscais
    '/Invoice',
    '/Invoices',
    '/NotaFiscal',
    '/NotasFiscais',
    '/invoice',
    '/invoices',
  ];

  const results: DiagnosticResult[] = [];

  for (const endpoint of endpointsToTest) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    // Pequeno delay para não sobrecarregar a API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Resumo
  const successCount = results.filter(r => r.status === 'success').length;
  const notFoundCount = results.filter(r => r.status === 'not_found').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return results;
}

/**
 * Exibe resultado formatado no console
 */
export function printDiagnosticResults(results: DiagnosticResult[]) {
  console.table(
    results.map(r => ({
      Endpoint: r.endpoint,
      Status: r.status === 'success' ? '✅ OK' : r.status === 'not_found' ? '❌ 404' : '⚠️ Erro',
      'Status Code': r.statusCode,
      'Registros': r.recordCount || '-',
      Erro: r.error || '-',
    }))
  );
}

