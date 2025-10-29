"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserTypePage() {
  const router = useRouter();

  const handleGuestClick = () => {
    // Número do WhatsApp e mensagem inicial
    const phoneNumber = "5547996629988"; // Formato internacional (55 + 47 + número)
    const message = encodeURIComponent(
      "Olá! Gostaria de saber mais informações sobre os hotéis cadastrados no AvenSuites."
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Abre o WhatsApp em uma nova aba
    window.open(whatsappUrl, "_blank");
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
                Busco informações sobre hotéis e reservas disponíveis
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
                    Consultar hotéis disponíveis
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
                    Informações sobre reservas
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
                    Atendimento personalizado
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
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Falar no WhatsApp
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

