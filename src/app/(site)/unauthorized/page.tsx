/**
 * Página: Acesso Não Autorizado
 */

import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const metadata: Metadata = {
  title: "Acesso Negado | AvenSuites",
  description: "Você não tem permissão para acessar esta página",
};

export default function UnauthorizedPage() {
  return (
    <>
      <Breadcrumb pageName="Acesso Negado" />
      
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="max-w-lg text-center">
              {/* Ícone de bloqueio */}
              <div className="mb-8 flex justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <svg
                    className="h-16 w-16 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>

              {/* Mensagem */}
              <h1 className="mb-4 text-4xl font-bold text-dark dark:text-white">
                Acesso Negado
              </h1>
              
              <p className="mb-8 text-lg text-body-color dark:text-dark-6">
                Você não tem permissão para acessar esta página. Entre em contato com o
                administrador do sistema se você acredita que deveria ter acesso.
              </p>

              {/* Botões */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/"
                  className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90"
                >
                  Voltar para Home
                </Link>
                
                <Link
                  href="/contact"
                  className="rounded-lg border border-stroke bg-white px-6 py-3 text-base font-medium text-dark hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
                >
                  Contatar Suporte
                </Link>
              </div>

              {/* Informações adicionais */}
              <div className="mt-12 rounded-lg border border-stroke bg-gray-50 p-6 dark:border-dark-3 dark:bg-dark-3">
                <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">
                  Precisa de mais acesso?
                </h3>
                <p className="text-sm text-body-color dark:text-dark-6">
                  Se você precisa de permissões adicionais, solicite ao administrador do
                  sistema que atribua as roles necessárias ao seu usuário.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

