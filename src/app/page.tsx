"use client"

import ScrollUp from "@/components/Common/ScrollUp"
import ThemeToggleButton from "@/components/Common/ThemeToggleButton"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const FeatureIcon1 = () => (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )

  const FeatureIcon2 = () => (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )

  const FeatureIcon3 = () => (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )

  const FeatureIcon4 = () => (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )

  const features = [
    {
      icon: <FeatureIcon1 />,
      title: "Gestão de Hotéis",
      description: "Cadastre e gerencie múltiplos hotéis em uma única plataforma",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <FeatureIcon2 />,
      title: "Controle de Quartos",
      description: "Gerencie disponibilidade, status e informações de cada quarto",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: <FeatureIcon3 />,
      title: "Sistema de Reservas",
      description: "Reservas inteligentes com verificação automática de disponibilidade",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: <FeatureIcon4 />,
      title: "Cadastro de Hóspedes",
      description: "Mantenha um banco de dados completo de todos os seus hóspedes",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
  ]

  const stats = [
    { value: "500+", label: "Hotéis Gerenciados", icon: "🏨" },
    { value: "10K+", label: "Reservas/Mês", icon: "📅" },
    { value: "98%", label: "Satisfação", icon: "⭐" },
    { value: "24/7", label: "Suporte", icon: "💬" },
  ]

  const BenefitIcon1 = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )

  const BenefitIcon2 = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )

  const BenefitIcon3 = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )

  const BenefitIcon4 = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )

  const benefits = [
    {
      icon: <BenefitIcon1 />,
      title: "Rápido",
      description: "Performance otimizada para máxima velocidade",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: <BenefitIcon2 />,
      title: "Seguro",
      description: "Dados protegidos com criptografia avançada",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <BenefitIcon3 />,
      title: "Confiável",
      description: "99.9% uptime garantido",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: <BenefitIcon4 />,
      title: "Escalável",
      description: "Cresce com o seu negócio",
      color: "from-amber-500 to-orange-600",
    },
  ]

  return (
    <main className="overflow-x-hidden">
      <ScrollUp />
      <ThemeToggleButton />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        <motion.div
          style={{ opacity, scale }}
          className="container relative z-10 mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-32"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="mx-auto max-w-5xl text-center"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-block rounded-lg bg-white/10 px-4 py-2 text-sm text-blue-100 backdrop-blur-sm">
                Gestão hoteleira simplificada
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
            >
              Gerencie seu hotel
              <br />
              <span className="text-blue-300">
                de forma simples e eficiente
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mb-10 max-w-xl text-base text-blue-100 sm:text-lg"
            >
              Uma plataforma completa para gerenciar reservas, quartos e hóspedes. Tudo que você precisa em um só lugar.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/user-type"
                className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
              >
                Acessar Sistema
              </Link>
              <Link
                href="/about"
                className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Conhecer mais
              </Link>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={itemVariants}
              className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="mb-1 text-xl">{stat.icon}</div>
                  <div className="text-xl font-semibold text-white">{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-20 dark:from-slate-900 dark:to-slate-800 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              O que oferecemos
            </h2>
            <p className="mx-auto max-w-xl text-slate-600 dark:text-slate-300">
              Ferramentas práticas para facilitar o dia a dia do seu hotel
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} text-white`}>
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative overflow-hidden bg-blue-600 py-16 md:py-24">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
              Nossos números
            </h2>
            <p className="mx-auto max-w-xl text-white/90">
              Resultados de hotéis que usam nossa plataforma
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-lg bg-white/10 p-6 text-center backdrop-blur-sm"
              >
                <div className="mb-3 text-3xl">{stat.icon}</div>
                <div className="mb-1 text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20 dark:bg-slate-900 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                Por que escolher o AvenSuites?
              </h2>
              <p className="mb-6 text-slate-600 dark:text-slate-300">
                Desenvolvemos uma plataforma pensando nas necessidades reais dos gestores hoteleiros. Cada funcionalidade foi criada para facilitar o seu trabalho.
              </p>

              <div className="space-y-3">
                {[
                  { title: "Interface simples", desc: "Fácil de usar, sem complicações" },
                  { title: "Automação inteligente", desc: "Processos que economizam seu tempo" },
                  { title: "Dashboard completo", desc: "Acompanhe métricas importantes" },
                  { title: "Segurança garantida", desc: "Seus dados protegidos" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="mb-0.5 font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${benefit.color} text-white`}>
                    {benefit.icon}
                  </div>
                  <h4 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">{benefit.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guest Portal Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 dark:from-slate-900 dark:via-indigo-900/20 dark:to-slate-800 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-slate-800">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                  Portal do Hóspede
                </h2>
                <p className="mb-6 text-slate-600 dark:text-slate-300">
                  Já é nosso hóspede? Acesse sua conta para acompanhar suas reservas, ver histórico e gerenciar suas estadias.
                </p>

                <div className="space-y-3">
                  {[
                    "Visualize todas as suas reservas",
                    "Acompanhe o status em tempo real",
                    "Gerencie seus dados pessoais",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <svg className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-slate-600 dark:text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-blue-600 p-8 lg:p-12">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                      <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">Acesse sua Conta</h3>
                  <p className="mb-6 text-white/90">Faça login para gerenciar suas reservas</p>
                  <Link
                    href="/guest/login"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Entrar no Portal
                  </Link>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-white/80">
                      Ainda não tem conta?{" "}
                      <Link href="/guest/search" className="font-semibold text-white underline hover:no-underline">
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
      <section className="relative overflow-hidden bg-blue-600 py-16 md:py-24">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Pronto para começar?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-white/90">
            Comece a usar o AvenSuites hoje e veja como pode facilitar a gestão do seu hotel.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/user-type"
              className="rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Começar Agora
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Falar com Vendas
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
