

'use client';

import { useEffect } from 'react';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Common/Breadcrumb';

export default function AdminDashboardPage() {
  const { canAccessAdmin, isLoading, user } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !canAccessAdmin()) {
      router.push('/unauthorized');
    }
  }, [isLoading, canAccessAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!canAccessAdmin()) {
    return null;

  }

  return (
    <>
      <Breadcrumb pageName="Administração" />

      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto space-y-8">
          {}
          <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
            <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
              Painel Administrativo
            </h1>
            <p className="text-body-color dark:text-dark-6">
              Bem-vindo, {user?.name}! Esta é a área administrativa do sistema.
            </p>
          </div>

          {}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {}
            <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-dark-3 dark:bg-dark-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                Gestão de Usuários
              </h3>
              <p className="mb-4 text-sm text-body-color dark:text-dark-6">
                Gerenciar usuários do sistema, roles e permissões
              </p>
              <button className="text-sm font-medium text-primary hover:text-primary/80">
                Acessar →
              </button>
            </div>

            {}
            <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-dark-3 dark:bg-dark-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <svg
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                Relatórios
              </h3>
              <p className="mb-4 text-sm text-body-color dark:text-dark-6">
                Visualizar e exportar relatórios do sistema
              </p>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-600/80 dark:text-blue-400">
                Acessar →
              </button>
            </div>

            {}
            <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-dark-3 dark:bg-dark-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                Configurações
              </h3>
              <p className="mb-4 text-sm text-body-color dark:text-dark-6">
                Configurar sistema, integrações e preferências
              </p>
              <button className="text-sm font-medium text-green-600 hover:text-green-600/80 dark:text-green-400">
                Acessar →
              </button>
            </div>

            {}
            <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-dark-3 dark:bg-dark-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                <svg
                  className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                Logs do Sistema
              </h3>
              <p className="mb-4 text-sm text-body-color dark:text-dark-6">
                Visualizar logs de auditoria e atividades
              </p>
              <button className="text-sm font-medium text-yellow-600 hover:text-yellow-600/80 dark:text-yellow-400">
                Acessar →
              </button>
            </div>

            {}
            <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-dark-3 dark:bg-dark-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <svg
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                Backup & Restore
              </h3>
              <p className="mb-4 text-sm text-body-color dark:text-dark-6">
                Gerenciar backups e restauração de dados
              </p>
              <button className="text-sm font-medium text-purple-600 hover:text-purple-600/80 dark:text-purple-400">
                Acessar →
              </button>
            </div>

            {}
            <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-dark-3 dark:bg-dark-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                Integrações
              </h3>
              <p className="mb-4 text-sm text-body-color dark:text-dark-6">
                Configurar integrações com serviços externos
              </p>
              <button className="text-sm font-medium text-red-600 hover:text-red-600/80 dark:text-red-400">
                Acessar →
              </button>
            </div>
          </div>

          {}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/20 dark:bg-yellow-900/10">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ <strong>Em Desenvolvimento:</strong> As funcionalidades administrativas
              estão sendo implementadas. Os cards acima são placeholders para futuras funcionalidades.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

