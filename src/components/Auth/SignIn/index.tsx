"use client"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import Image from "next/image"

const Signin = () => {
  const router = useRouter()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const hotelImages = [
    {
      src: "/images/hero/hero-image.jpg",
      title: "Gestão Hoteleira Moderna",
      description: "Controle total do seu hotel em uma única plataforma"
    },
    {
      src: "/images/about/about-image-01.jpg",
      title: "Interface Intuitiva",
      description: "Dashboard completo com métricas em tempo real"
    },
    {
      src: "/images/about/about-image-02.jpg",
      title: "Reservas Simplificadas",
      description: "Sistema inteligente de gestão de reservas"
    },
    {
      src: "/images/about/modern-hotel-management-dashboard-interface-with-b.jpg",
      title: "Dashboard Completo",
      description: "Visualize todos os dados importantes do seu hotel"
    }
  ]

  // Carousel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === hotelImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [hotelImages.length])

  const loginUser = async (e: any) => {
    e.preventDefault()

    console.log("🚀 Login iniciado com dados:", loginData)
    setLoading(true)
    
    try {
      // Limpa tokens antigos
      localStorage.removeItem('guestToken')
      localStorage.removeItem('guestUser')
      
      // Faz login via NextAuth
      const callback = await signIn("credentials", { ...loginData, redirect: false })
      
      if (callback?.error) {
        toast.error(callback?.error)
        console.log(callback?.error)
        setLoading(false)
        return
      }

      if (callback?.ok && !callback?.error) {
        // Busca a sessão e salva o token no localStorage
        const { getSession } = await import('next-auth/react')
        const session = await getSession()
        
        if (session?.accessToken) {
          console.log('✅ Salvando token Admin no localStorage')
          localStorage.setItem('guestToken', session.accessToken as string)
          localStorage.setItem('guestUser', JSON.stringify({
            id: session.user?.id,
            name: session.user?.name,
            email: session.user?.email,
          }))
        }
        
        toast.success("Login realizado com sucesso!")
        setLoading(false)
        router.push("/dashboard")
      }
    } catch (err: any) {
      setLoading(false)
      console.log(err.message)
      toast.error(err.message)
    }
  }

  return (
    <section className="min-h-screen flex">
      {/* Lado Esquerdo - Imagens do Hotel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
        {/* Overlay de gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent z-10" />
        
        {/* Imagens do Carousel */}
        {hotelImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Conteúdo sobre a imagem */}
        <div className="relative z-20 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">AvenSuites</div>
              <div className="text-blue-200 text-xs">Hotel Management System</div>
            </div>
          </Link>

          {/* Texto Principal */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white leading-tight">
                {hotelImages[currentImageIndex].title}
              </h2>
              <p className="text-xl text-blue-100">
                {hotelImages[currentImageIndex].description}
              </p>
            </div>

            {/* Indicadores do Carousel */}
            <div className="flex gap-2">
              {hotelImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'w-12 bg-white' 
                      : 'w-6 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-blue-200">Hotéis Gerenciados</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-blue-200">Reservas/Mês</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-sm text-blue-200">Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-dark">
        <div className="w-full max-w-md space-y-8">
          {/* Logo Mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-dark dark:text-white">AvenSuites</div>
                <div className="text-primary text-xs">Hotel Management</div>
              </div>
            </Link>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-dark dark:text-white">
              Bem-vindo de volta!
            </h1>
            <p className="text-body-color dark:text-dark-6">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={loginUser} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark dark:text-white">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-stroke dark:border-dark-3 rounded-lg bg-transparent text-dark dark:text-white placeholder:text-body-color dark:placeholder:text-dark-6 outline-none transition focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark dark:text-white">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-stroke dark:border-dark-3 rounded-lg bg-transparent text-dark dark:text-white placeholder:text-body-color dark:placeholder:text-dark-6 outline-none transition focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-body-color dark:text-dark-6">
                  Lembrar-me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stroke dark:border-dark-3" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-dark text-body-color dark:text-dark-6">
                Ainda não tem uma conta?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            href="/signup"
            className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-stroke dark:border-dark-3 px-6 py-3.5 text-base font-semibold text-dark dark:text-white transition-all duration-300 hover:border-primary hover:bg-primary/5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Criar uma Conta
          </Link>

          {/* Support Link */}
          <p className="text-center text-sm text-body-color dark:text-dark-6">
            Precisa de ajuda?{" "}
            <Link href="/contact" className="font-medium text-primary hover:underline">
              Entre em contato
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Signin
