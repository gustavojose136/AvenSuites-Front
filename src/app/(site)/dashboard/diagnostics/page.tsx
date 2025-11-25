"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { diagnoseAPI, type DiagnosticResult } from "@/utils/api-diagnostics"

export default function DiagnosticsPage() {
  const { data: session, status } = useSession()
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const diagnosticResults = await diagnoseAPI()
      setResults(diagnosticResults)
    } catch (error) {
      console.error("Erro ao executar diagnóstico:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <section className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground">Verificando autenticação...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const successCount = results.filter((r) => r.status === "success").length
  const notFoundCount = results.filter((r) => r.status === "not_found").length
  const errorCount = results.filter((r) => r.status === "error").length

  return (
    <section className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>/</span>
            <span>Diagnóstico da API</span>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-text-balance text-4xl font-bold lg:text-5xl">Diagnóstico da API</h1>
              <p className="mt-2 text-lg text-muted-foreground">Teste quais endpoints estão disponíveis</p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={loading}
              className="flex w-fit items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                  Testando...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Executar Diagnóstico
                </>
              )}
            </button>
          </div>
        </div>

        {results.length === 0 && (
          <div className="mb-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Como usar este diagnóstico</h2>
            <ul className="space-y-3 text-muted-foreground">
              {[
                `Certifique-se que sua API está rodando em ${process.env.NEXT_PUBLIC_API_URL || "https://localhost:7000/api"}`,
                'Clique em "Executar Diagnóstico" para testar todos os endpoints comuns',
                "Veja quais endpoints estão disponíveis e ajuste o código se necessário",
                "Abra o Console do navegador (F12) para ver logs detalhados",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-primary font-semibold">{i + 1}.</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.length > 0 && (
          <div className="mb-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Encontrados</p>
                  <h3 className="mt-2 text-4xl font-bold text-green-600">{successCount}</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10">
                  <svg className="h-7 w-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Não Encontrados</p>
                  <h3 className="mt-2 text-4xl font-bold text-red-600">{notFoundCount}</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10">
                  <svg className="h-7 w-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Outros Erros</p>
                  <h3 className="mt-2 text-4xl font-bold text-yellow-600">{errorCount}</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500/10">
                  <svg className="h-7 w-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-6">
              <h3 className="text-lg font-semibold">Resultados dos Testes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Endpoint</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">HTTP Code</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Registros</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-border transition hover:bg-muted/20">
                      <td className="px-6 py-4">
                        <code className="font-mono text-sm">{result.endpoint}</code>
                      </td>
                      <td className="px-6 py-4">
                        {result.status === "success" && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Disponível
                          </span>
                        )}
                        {result.status === "not_found" && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Não Encontrado
                          </span>
                        )}
                        {result.status === "error" && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-600">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                            </svg>
                            Erro
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{result.statusCode}</td>
                      <td className="px-6 py-4 font-semibold">
                        {result.recordCount !== undefined ? result.recordCount : "-"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{result.error || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {results.length > 0 && successCount === 0 && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-destructive">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Nenhum endpoint encontrado!
            </h3>
            <p className="mb-4 text-destructive/80">Verifique os seguintes pontos:</p>
            <ul className="space-y-2 text-destructive/80">
              {[
                "Sua API está rodando?",
                "A URL está correta no .env.local?",
                "Você está autenticado (token válido)?",
                "Os nomes dos controllers estão corretos?",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </section>
  )
}
