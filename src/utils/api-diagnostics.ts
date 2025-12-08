

import { httpClient } from '@/infrastructure/http/HttpClient';

export interface DiagnosticResult {
  endpoint: string;
  status: 'success' | 'not_found' | 'error';
  statusCode?: number;
  recordCount?: number;
  error?: string;
}

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

export async function diagnoseAPI(): Promise<DiagnosticResult[]> {

  const endpointsToTest = [

    '/Hotel',
    '/Hotels',
    '/hotel',
    '/hotels',

    '/Room',
    '/Rooms',
    '/Quarto',
    '/Quartos',
    '/room',
    '/rooms',

    '/Guest',
    '/Guests',
    '/Hospede',
    '/Hospedes',
    '/guest',
    '/guests',

    '/Booking',
    '/Bookings',
    '/Reserva',
    '/Reservas',
    '/booking',
    '/bookings',

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

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const successCount = results.filter(r => r.status === 'success').length;
  const notFoundCount = results.filter(r => r.status === 'not_found').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return results;
}

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

