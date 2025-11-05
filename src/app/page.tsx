import ScrollUp from "@/components/Common/ScrollUp";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AvenSuites - Sistema de Gestão Hoteleira Completo",
  description: "Plataforma moderna e completa para gestão de hotéis, reservas, quartos e hóspedes. Simplifique sua operação hoteleira com o AvenSuites.",
};

export default function Home() {
  return (
    <main>
      <ScrollUp />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-[120px] md:pt-[130px] lg:pt-[160px]">
        <div className="container">
          <div className="flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-6/12">
              <div className="hero-content">
                <h1 className="mb-5 text-4xl font-bold leading-snug text-dark dark:text-white sm:text-5xl sm:leading-snug md:text-6xl md:leading-snug">
                  Gestão Hoteleira
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> Moderna e Completa</span>
                </h1>
                <p className="mb-8 max-w-[480px] text-base text-body-color dark:text-dark-6">
                  Simplifique a gestão do seu hotel com nossa plataforma all-in-one. Controle reservas, quartos, hóspedes e muito mais em um único lugar.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/user-type"
                    className="rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white duration-300 hover:bg-primary/90"
                  >
                    Acessar Sistema
                  </Link>
                  <Link
                    href="/about"
                    className="rounded-lg border-2 border-stroke bg-white px-8 py-4 text-base font-semibold text-dark duration-300 hover:border-primary hover:bg-primary/5 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  >
                    Saiba Mais
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden w-full px-4 lg:block lg:w-6/12">
              <div className="lg:ml-auto lg:text-right">
                <div className="relative z-10 inline-block pt-11 lg:pt-0">
                  <div className="absolute -left-9 bottom-0 z-[-1]">
                    <svg
                      width="134"
                      height="106"
                      viewBox="0 0 134 106"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="1.66667"
                        cy="104"
                        r="1.66667"
                        transform="rotate(-90 1.66667 104)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="16.3333"
                        cy="104"
                        r="1.66667"
                        transform="rotate(-90 16.3333 104)"
                        fill="#3056D3"
                      />
                      <circle
                        cx="31"
                        cy="104"
                        r="1.66667"
                        transform="rotate(-90 31 104)"
                        fill="#3056D3"
                      />
                    </svg>
                  </div>
                  <div className="relative rounded-lg bg-primary/5 p-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-dark-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-body-color dark:text-dark-6">Hotéis Ativos</p>
                          <p className="text-2xl font-bold text-dark dark:text-white">12</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-dark-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                          <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-body-color dark:text-dark-6">Reservas Hoje</p>
                          <p className="text-2xl font-bold text-dark dark:text-white">48</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-dark-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                          <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-body-color dark:text-dark-6">Taxa de Ocupação</p>
                          <p className="text-2xl font-bold text-dark dark:text-white">87%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-8 pt-20 dark:bg-dark lg:pb-[70px] lg:pt-[120px]">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-4xl md:text-[45px]">
              Recursos Principais
            </h2>
            <p className="text-base text-body-color dark:text-dark-6">
              Tudo que você precisa para gerenciar seu hotel com eficiência
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="group rounded-lg border border-stroke bg-white p-6 transition hover:border-primary hover:shadow-lg dark:border-dark-3 dark:bg-dark-2">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 transition group-hover:bg-primary">
                <svg className="h-7 w-7 text-primary transition group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                Gestão de Hotéis
              </h3>
              <p className="text-body-color dark:text-dark-6">
                Cadastre e gerencie múltiplos hotéis em uma única plataforma
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-lg border border-stroke bg-white p-6 transition hover:border-primary hover:shadow-lg dark:border-dark-3 dark:bg-dark-2">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 transition group-hover:bg-blue-600 dark:bg-blue-900/20">
                <svg className="h-7 w-7 text-blue-600 transition group-hover:text-white dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                Controle de Quartos
              </h3>
              <p className="text-body-color dark:text-dark-6">
                Gerencie disponibilidade, status e informações de cada quarto
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-lg border border-stroke bg-white p-6 transition hover:border-primary hover:shadow-lg dark:border-dark-3 dark:bg-dark-2">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-green-100 transition group-hover:bg-green-600 dark:bg-green-900/20">
                <svg className="h-7 w-7 text-green-600 transition group-hover:text-white dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                Sistema de Reservas
              </h3>
              <p className="text-body-color dark:text-dark-6">
                Reservas inteligentes com verificação automática de disponibilidade
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-lg border border-stroke bg-white p-6 transition hover:border-primary hover:shadow-lg dark:border-dark-3 dark:bg-dark-2">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-yellow-100 transition group-hover:bg-yellow-600 dark:bg-yellow-900/20">
                <svg className="h-7 w-7 text-yellow-600 transition group-hover:text-white dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                Cadastro de Hóspedes
              </h3>
              <p className="text-body-color dark:text-dark-6">
                Mantenha um banco de dados completo de todos os seus hóspedes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <h3 className="mb-2 text-4xl font-bold text-white">500+</h3>
              <p className="text-white/80">Hotéis Gerenciados</p>
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-4xl font-bold text-white">10K+</h3>
              <p className="text-white/80">Reservas/Mês</p>
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-4xl font-bold text-white">98%</h3>
              <p className="text-white/80">Satisfação</p>
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-4xl font-bold text-white">24/7</h3>
              <p className="text-white/80">Suporte</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="pb-8 pt-20 dark:bg-dark lg:pb-[70px] lg:pt-[120px]">
        <div className="container">
          <div className="flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <div className="mb-12 lg:mb-0">
                <h2 className="mb-5 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-4xl md:text-[45px]">
                  Por que escolher o AvenSuites?
                </h2>
                <p className="mb-8 text-base text-body-color dark:text-dark-6">
                  Nossa plataforma foi desenvolvida pensando nas necessidades reais dos gestores hoteleiros.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-dark dark:text-white">Interface Intuitiva</h4>
                      <p className="text-sm text-body-color dark:text-dark-6">Design moderno e fácil de usar</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-dark dark:text-white">Automação Inteligente</h4>
                      <p className="text-sm text-body-color dark:text-dark-6">Processos automatizados que economizam tempo</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-dark dark:text-white">Dashboard Completo</h4>
                      <p className="text-sm text-body-color dark:text-dark-6">Métricas e KPIs em tempo real</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-dark dark:text-white">Segurança Avançada</h4>
                      <p className="text-sm text-body-color dark:text-dark-6">Proteção de dados e controle de acesso por roles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-dark dark:text-white">Rápido</h4>
                  <p className="text-sm text-body-color dark:text-dark-6">Performance otimizada</p>
                </div>

                <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-dark dark:text-white">Seguro</h4>
                  <p className="text-sm text-body-color dark:text-dark-6">Dados protegidos</p>
                </div>

                <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-dark dark:text-white">Confiável</h4>
                  <p className="text-sm text-body-color dark:text-dark-6">99.9% uptime</p>
                </div>

                <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                    <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-dark dark:text-white">Escalável</h4>
                  <p className="text-sm text-body-color dark:text-dark-6">Cresce com você</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Portal Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 dark:from-dark-2 dark:via-dark dark:to-dark-2 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-2">
            <div className="grid gap-0 md:grid-cols-2">
              {/* Left Side - Info */}
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-dark dark:text-white">
                  Portal do Hóspede
                </h2>
                <p className="mb-6 text-base text-body-color dark:text-dark-6">
                  Já é nosso hóspede? Acesse sua conta para acompanhar suas reservas, ver histórico e gerenciar suas estadias.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-body-color dark:text-dark-6">
                      Visualize todas as suas reservas
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-body-color dark:text-dark-6">
                      Acompanhe o status em tempo real
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-body-color dark:text-dark-6">
                      Gerencie seus dados pessoais
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - CTA */}
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary to-blue-600 p-8 lg:p-12">
                <div className="text-center">
                  <div className="mb-6">
                    <svg className="mx-auto h-20 w-20 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white">
                    Acesse sua Conta
                  </h3>
                  <p className="mb-6 text-sm text-white/90">
                    Faça login para gerenciar suas reservas
                  </p>
                  <Link
                    href="/guest/login"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary transition-all duration-300 hover:bg-white/90 hover:shadow-lg"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Entrar no Portal
                  </Link>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-white/80">
                      Ainda não tem conta?{' '}
                      <Link
                        href="/guest/search"
                        className="font-semibold text-white underline hover:no-underline"
                      >
                        Faça sua reserva
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 py-16 lg:py-24">
        <div className="container">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-[45px]">
              Pronto para transformar sua gestão hoteleira?
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Comece a usar o AvenSuites hoje e veja a diferença
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-lg bg-white px-8 py-4 text-base font-semibold text-primary duration-300 hover:bg-white/90"
              >
                Começar Agora
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border-2 border-white bg-transparent px-8 py-4 text-base font-semibold text-white duration-300 hover:bg-white/10"
              >
                Falar com Vendas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
