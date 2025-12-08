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

  const features = [
    {
      icon: "🏨",
      title: "Gestão de Hotéis",
      description: "Cadastre e gerencie múltiplos hotéis em uma única plataforma",
      gradient: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    },
    {
      icon: "🔑",
      title: "Controle de Quartos",
      description: "Gerencie disponibilidade, status e informações de cada quarto",
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: "📅",
      title: "Sistema de Reservas",
      description: "Reservas inteligentes com verificação automática de disponibilidade",
      gradient: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: "👤",
      title: "Cadastro de Hóspedes",
      description: "Mantenha um banco de dados completo de todos os seus hóspedes",
      gradient: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
  ]

  const stats = [
    { value: "500+", label: "Hotéis Gerenciados", icon: "🏨" },
    { value: "10K+", label: "Reservas/Mês", icon: "📅" },
    { value: "98%", label: "Satisfação", icon: "⭐" },
    { value: "24/7", label: "Suporte", icon: "💬" },
  ]

  const benefits = [
    {
      icon: "⚡",
      title: "Rápido",
      description: "Performance otimizada para máxima velocidade",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: "🔒",
      title: "Seguro",
      description: "Dados protegidos com criptografia avançada",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: "✅",
      title: "Confiável",
      description: "99.9% uptime garantido",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: "📈",
      title: "Escalável",
      description: "Cresce com o seu negócio",
      gradient: "from-amber-500 to-orange-600",
    },
  ]

  return (
    <main className="overflow-x-hidden">
      <ScrollUp />
      <ThemeToggleButton />

      {}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
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
              <span className="inline-block rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur-md border border-cyan-400/30">
                ✨ Gestão hoteleira simplificada
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="relative mb-6">
              <motion.div
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1, 1.2, 1],
                  y: [-30, 30, -30],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -top-20 -left-32 w-72 h-72 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-40"
              />
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.8, 1.1, 0.8],
                  y: [30, -30, 30],
                  x: [20, -20, 20],
                }}
                transition={{
                  duration: 7,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-20 -right-32 w-80 h-80 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-30"
              />
              <h1 className="relative z-10 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
                Gerencie seu hotel
                <br />
                <span className="block">de forma inteligente</span>
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mx-auto mb-10 max-w-xl text-base text-blue-100/90 sm:text-lg leading-relaxed"
            >
              Uma plataforma completa para gerenciar reservas, quartos e hóspedes. Tudo que você precisa em um só lugar,
              com tecnologia de ponta.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/user-type"
                className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
              >
                Acessar Sistema
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ translateY: -8 }}
                  className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-4 transition-all"
                >
                  <div className="mb-2 text-3xl">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">O que oferecemos</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Ferramentas práticas para facilitar o dia a dia do seu hotel com recursos modernos e intuitivos
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ translateY: -8 }}
                className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 transition-all hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                />
                <div className="relative z-10">
                  <div
                    className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} text-2xl`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 py-20 md:py-32">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Nossos números falam</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Resultados reais de hotéis que usam nossa plataforma
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-xl bg-white/15 backdrop-blur-md border border-white/30 p-8 text-center hover:bg-white/20 transition-all"
              >
                <div className="mb-4 text-4xl">{stat.icon}</div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-white/90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="bg-white dark:bg-slate-900 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-6 text-4xl font-bold text-slate-900 dark:text-white">Por que escolher AvenSuites?</h2>
              <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                Desenvolvemos uma plataforma pensando nas necessidades reais dos gestores hoteleiros. Cada
                funcionalidade foi criada para facilitar seu trabalho e aumentar a eficiência.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Interface Intuitiva", desc: "Fácil de usar, sem complicações ou treinamento complexo" },
                  { title: "Automação Inteligente", desc: "Processos automáticos que economizam seu tempo valioso" },
                  { title: "Dashboard Completo", desc: "Acompanhe todas as métricas importantes em tempo real" },
                  { title: "Suporte Premium", desc: "Tim de suporte disponível 24/7 em português" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  whileHover={{ translateY: -8 }}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-6 hover:shadow-lg transition-all"
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${benefit.gradient} text-2xl`}
                  >
                    {benefit.icon}
                  </div>
                  <h4 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{benefit.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-800 dark:via-purple-900/20 dark:to-slate-900 py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 left-0 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl"
          >
            <div className="grid gap-0 md:grid-cols-2">
              {}
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <motion.div
                  whileInView={{ scale: [0.9, 1] }}
                  transition={{ duration: 0.6 }}
                  className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl"
                >
                  👤
                </motion.div>
                <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">Portal do Hóspede</h2>
                <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                  Seus hóspedes podem acompanhar reservas, modificar estadias e gerenciar tudo de forma fácil e segura.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    "Visualize todas as suas reservas em detalhes",
                    "Acompanhe status em tempo real",
                    "Gerencie seus dados pessoais com segurança",
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-shrink-0 text-purple-600 dark:text-purple-400 text-xl">✓</div>
                      <p className="text-slate-600 dark:text-slate-300">{item}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/guest/login"
                    className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-center font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105"
                  >
                    Acessar Portal
                  </Link>
                  <Link
                    href="/guest/search"
                    className="rounded-lg border-2 border-purple-600 px-6 py-3 text-center font-semibold text-purple-600 dark:text-purple-400 transition-all hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    Fazer Reserva
                  </Link>
                </div>
              </div>

              {}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 p-8 lg:p-12"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="text-6xl">🏨</div>
                  <h3 className="text-3xl font-bold text-white text-center">Experiência Premium</h3>
                  <p className="text-lg text-white/90 text-center">Para seus hóspedes</p>
                  <div className="flex gap-4 justify-center">
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white text-sm font-semibold">
                      Reservas
                    </div>
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white text-sm font-semibold">
                      Check-in
                    </div>
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white text-sm font-semibold">
                      Suporte
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">Pronto para começar?</h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100/90">
              Junte-se a centenas de hotéis que já estão melhorando sua eficiência com AvenSuites. Comece sua avaliação
              gratuita hoje.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/user-type"
                className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
              >
                Começar Agora
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 pt-12 border-t border-white/20"
          >
            <p className="text-sm text-blue-100/70">
              ✓ Sem cartão de crédito necessário • ✓ Cancelamento a qualquer momento • ✓ Suporte técnico incluído
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
