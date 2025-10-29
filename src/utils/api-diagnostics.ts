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
    console.log(`🔍 Testando: ${endpoint}`);
    const data = await httpClient.get<any[]>(endpoint);
    console.log(`✅ ${endpoint}: ${Array.isArray(data) ? data.length : 'OK'} registros`);
    
    return {
      endpoint,
      status: 'success',
      statusCode: 200,
      recordCount: Array.isArray(data) ? data.length : undefined,
    };
  } catch (error: any) {
    const statusCode = error.response?.status || 0;
    
    if (statusCode === 404) {
      console.log(`❌ ${endpoint}: 404 - Não encontrado`);
      return {
        endpoint,
        status: 'not_found',
        statusCode: 404,
      };
    }
    
    console.log(`❌ ${endpoint}: ${statusCode} - ${error.message}`);
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
  console.log('\n🔬 ============================================');
  console.log('🔬 DIAGNÓSTICO DA API');
  console.log('🔬 ============================================\n');

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
  console.log('\n📊 ============================================');
  console.log('📊 RESUMO DO DIAGNÓSTICO');
  console.log('📊 ============================================\n');

  const successCount = results.filter(r => r.status === 'success').length;
  const notFoundCount = results.filter(r => r.status === 'not_found').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  console.log(`✅ Endpoints encontrados: ${successCount}`);
  console.log(`❌ Endpoints não encontrados (404): ${notFoundCount}`);
  console.log(`⚠️  Outros erros: ${errorCount}`);

  console.log('\n✅ ENDPOINTS DISPONÍVEIS:');
  results
    .filter(r => r.status === 'success')
    .forEach(r => {
      console.log(`   ${r.endpoint} (${r.recordCount} registros)`);
    });

  if (successCount === 0) {
    console.log('\n⚠️  ATENÇÃO: Nenhum endpoint foi encontrado!');
    console.log('   Verifique:');
    console.log('   1. Se a API está rodando');
    console.log('   2. Se a URL está correta em .env.local');
    console.log('   3. Se você está autenticado');
    console.log('   4. Se os nomes dos controllers estão corretos');
  }

  console.log('\n🔬 ============================================\n');

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

