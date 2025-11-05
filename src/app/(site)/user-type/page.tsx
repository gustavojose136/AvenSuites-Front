"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserTypePage() {
  const router = useRouter();

  const handleGuestClick = () => {
    // Redireciona para a página de busca de hotéis
    router.push('/guest/search');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-dark dark:text-white mb-3">
            Bem-vindo ao <span className="text-primary">AvenSuites</span>
          </h1>
          <p className="text-lg text-body-color dark:text-dark-6">
            Como você deseja acessar nossa plataforma?
          </p>
        </div>

        {/* Cards de Seleção */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Card Hóspede */}
          <div className="group relative rounded-2xl border-2 border-stroke bg-white p-8 transition-all duration-300 hover:border-primary hover:shadow-xl dark:border-dark-3 dark:bg-dark-2">
            <div className="text-center">
              {/* Ícone */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 transition-all duration-300 group-hover:scale-110 dark:from-blue-900/30 dark:to-blue-800/30">
                <svg
                  className="h-10 w-10 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              {/* Título */}
              <h2 className="mb-3 text-2xl font-bold text-dark dark:text-white">
                Sou Hóspede
              </h2>

              {/* Descrição */}
              <p className="mb-6 text-body-color dark:text-dark-6">
                Quero fazer uma reserva em um hotel
              </p>

              {/* Lista de Benefícios */}
              <ul className="mb-8 space-y-3 text-left">
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-body-color dark:text-dark-6">
                    Ver hotéis disponíveis
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-body-color dark:text-dark-6">
                    Fazer reservas online
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-body-color dark:text-dark-6">
                    Gerenciar minhas reservas
                  </span>
                </li>
              </ul>

              {/* Botão */}
              <button
                onClick={handleGuestClick}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Buscar Hotéis
              </button>
            </div>
          </div>

          {/* Card Dono do Hotel */}
          <div className="group relative rounded-2xl border-2 border-stroke bg-white p-8 transition-all duration-300 hover:border-primary hover:shadow-xl dark:border-dark-3 dark:bg-dark-2">
            <div className="text-center">
              {/* Ícone */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/20 transition-all duration-300 group-hover:scale-110">
                <svg
                  className="h-10 w-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>

              {/* Título */}
              <h2 className="mb-3 text-2xl font-bold text-dark dark:text-white">
                Sou Dono de Hotel
              </h2>

              {/* Descrição */}
              <p className="mb-6 text-body-color dark:text-dark-6">
                Quero gerenciar meu hotel e suas operações
              </p>

              {/* Lista de Benefícios */}
              <ul className="mb-8 space-y-3 text-left">
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-body-color dark:text-dark-6">
                    Gerenciar hotéis e quartos
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-body-color dark:text-dark-6">
                    Controlar reservas e hóspedes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-body-color dark:text-dark-6">
                    Acessar dashboard completo
                  </span>
                </li>
              </ul>

              {/* Botão */}
              <Link
                href="/signin"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Fazer Login
              </Link>
            </div>
          </div>
        </div>

        {/* Link de Volta */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-body-color transition-colors hover:text-primary dark:text-dark-6 dark:hover:text-primary"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}

