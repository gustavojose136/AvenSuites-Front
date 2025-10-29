/**
 * Página de Diagnóstico da API
 * Testa quais endpoints estão disponíveis
 */

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { diagnoseAPI, DiagnosticResult } from '@/utils/api-diagnostics';

export default function DiagnosticsPage() {
  const { data: session, status } = useSession();
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const diagnosticResults = await diagnoseAPI();
      setResults(diagnosticResults);
    } catch (error) {
      console.error('Erro ao executar diagnóstico:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-dark dark:to-dark-2 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-body-color dark:text-dark-6">Verificando autenticação...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const successCount = results.filter(r => r.status === 'success').length;
  const notFoundCount = results.filter(r => r.status === 'not_found').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-dark dark:to-dark-2 py-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
            <span>/</span>
            <span>Diagnóstico da API</span>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark dark:text-white lg:text-4xl">
                🔬 Diagnóstico da API
              </h1>
              <p className="mt-2 text-body-color dark:text-dark-6">
                Teste quais endpoints estão disponíveis na sua API
              </p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={loading}
              className="flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Testando...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Executar Diagnóstico
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instruções */}
        {results.length === 0 && (
          <div className="mb-8 rounded-2xl border border-stroke bg-white p-8 dark:border-dark-3 dark:bg-dark-2">
            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
              Como usar este diagnóstico
            </h2>
            <ul className="space-y-3 text-body-color dark:text-dark-6">
              <li className="flex items-start gap-3">
                <span className="text-primary">1.</span>
                <span>Certifique-se que sua API está rodando em <code className="rounded bg-gray-100 px-2 py-1 dark:bg-dark-3">{process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7000/api'}</code></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">2.</span>
                <span>Clique em <strong>"Executar Diagnóstico"</strong> para testar todos os endpoints comuns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">3.</span>
                <span>Veja quais endpoints estão disponíveis e ajuste o código se necessário</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">4.</span>
                <span>Abra o Console do navegador (F12) para ver logs detalhados</span>
              </li>
            </ul>
          </div>
        )}

        {/* Resumo */}
        {results.length > 0 && (
          <div className="mb-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Encontrados</p>
                  <h3 className="mt-2 text-4xl font-bold text-green-600">{successCount}</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/20">
                  <svg className="h-7 w-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Não Encontrados</p>
                  <h3 className="mt-2 text-4xl font-bold text-red-600">{notFoundCount}</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/20">
                  <svg className="h-7 w-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Outros Erros</p>
                  <h3 className="mt-2 text-4xl font-bold text-yellow-600">{errorCount}</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/20">
                  <svg className="h-7 w-7 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabela de Resultados */}
        {results.length > 0 && (
          <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2">
            <div className="border-b border-stroke p-6 dark:border-dark-3">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                Resultados dos Testes
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stroke bg-gray-50 dark:border-dark-3 dark:bg-dark">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                      Endpoint
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                      HTTP Code
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                      Registros
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                      Observações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr
                      key={index}
                      className="border-b border-stroke transition hover:bg-gray-50 dark:border-dark-3 dark:hover:bg-dark"
                    >
                      <td className="px-6 py-4">
                        <code className="font-mono text-sm text-dark dark:text-white">
                          {result.endpoint}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        {result.status === 'success' && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Disponível
                          </span>
                        )}
                        {result.status === 'not_found' && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 dark:bg-red-900/20 dark:text-red-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Não Encontrado
                          </span>
                        )}
                        {result.status === 'error' && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                            </svg>
                            Erro
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-body-color dark:text-dark-6">
                        {result.statusCode}
                      </td>
                      <td className="px-6 py-4 font-semibold text-dark dark:text-white">
                        {result.recordCount !== undefined ? result.recordCount : '-'}
                      </td>
                      <td className="px-6 py-4 text-body-color dark:text-dark-6">
                        {result.error || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dicas */}
        {results.length > 0 && successCount === 0 && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/20 dark:bg-red-900/10">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-800 dark:text-red-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Nenhum endpoint encontrado!
            </h3>
            <p className="mb-4 text-red-700 dark:text-red-300">
              Verifique os seguintes pontos:
            </p>
            <ul className="space-y-2 text-red-700 dark:text-red-300">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Sua API está rodando?</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>A URL está correta no <code className="rounded bg-red-100 px-2 py-1 dark:bg-red-900/20">.env.local</code>?</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Você está autenticado (token válido)?</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Os nomes dos controllers estão corretos?</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

