"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { httpClient } from "@/infrastructure/http/HttpClient"
import toast from "react-hot-toast"
import Link from "next/link"

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  documentType: string
  document: string
  birthDate: string
  addressLine1: string
  addressLine2?: string
  city: string
  neighborhood?: string
  state: string
  postalCode: string
  countryCode: string
  marketingConsent: boolean
}

const createLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number)
  return new Date(year, month - 1, day)
}

const formatDateLocal = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  const date = createLocalDate(dateString)
  return date.toLocaleDateString("pt-BR", options)
}

const isStepValid = (step: number, formData: RegisterFormData, birthDay?: string, birthMonth?: string, birthYear?: string): boolean => {
  switch (step) {
    case 1:
      return (
        formData.name.trim() !== "" &&
        formData.birthDate !== "" &&
        birthDay !== "" &&
        birthMonth !== "" &&
        birthYear !== "" &&
        formData.documentType !== "" &&
        formData.document.trim() !== ""
      )
    case 2:
      return formData.email.trim() !== "" && formData.phone.trim() !== ""
    case 3:
      return (
        formData.addressLine1.trim() !== "" &&
        formData.city.trim() !== "" &&
        formData.state.trim() !== "" &&
        formData.postalCode.trim() !== ""
      )
    case 4:
      return (
        formData.password !== "" &&
        formData.confirmPassword !== "" &&
        formData.password === formData.confirmPassword &&
        formData.password.length >= 6
      )
    default:
      return false
  }
}

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [hotelName, setHotelName] = useState("")
  const [currentStep, setCurrentStep] = useState(1)

  const hotelId = searchParams.get("hotelId") || ""
  const checkIn = searchParams.get("checkIn") || ""
  const checkOut = searchParams.get("checkOut") || ""
  const guests = searchParams.get("guests") || "2"

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    documentType: "CPF",
    document: "",
    birthDate: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    neighborhood: "",
    state: "",
    postalCode: "",
    countryCode: "BR",
    marketingConsent: false,
  })

  const [birthDay, setBirthDay] = useState("")
  const [birthMonth, setBirthMonth] = useState("")
  const [birthYear, setBirthYear] = useState("")

  useEffect(() => {
    if (hotelId) {
      fetchHotelName(hotelId)
    }
  }, [hotelId])

  // Sincroniza os campos de data separados com birthDate
  useEffect(() => {
    if (birthDay && birthMonth && birthYear) {
      const day = birthDay.padStart(2, "0")
      const month = birthMonth.padStart(2, "0")
      const year = birthYear
      setFormData((prev) => ({ ...prev, birthDate: `${year}-${month}-${day}` }))
    }
  }, [birthDay, birthMonth, birthYear])

  // Carrega valores iniciais se birthDate já existir
  useEffect(() => {
    if (formData.birthDate && !birthDay && !birthMonth && !birthYear) {
      const [year, month, day] = formData.birthDate.split("-")
      setBirthYear(year || "")
      setBirthMonth(month || "")
      setBirthDay(day || "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.birthDate])

  const fetchHotelName = async (id: string) => {
    try {
      const hotel = await httpClient.get<any>(`/Hotels/${id}`)
      setHotelName(hotel.name)
    } catch (error) {
      console.error("Erro ao buscar hotel:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleNextStep = () => {
    if (isStepValid(currentStep, formData, birthDay, birthMonth, birthYear)) {
      setCurrentStep(currentStep + 1)
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios")
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isStepValid(4, formData, birthDay, birthMonth, birthYear)) {
      toast.error("Por favor, verifique os dados de segurança")
      return
    }

    try {
      setLoading(true)

      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        documentType: formData.documentType,
        document: formData.document,
        birthDate: formData.birthDate,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        neighborhood: formData.neighborhood,
        state: formData.state,
        postalCode: formData.postalCode,
        countryCode: formData.countryCode,
        marketingConsent: formData.marketingConsent,
        hotelId: hotelId,
      }

      const response = await httpClient.post<any>("/Auth/register-guest", registerData)

      toast.success("Cadastro realizado com sucesso!")

      if (response.token) {
        localStorage.setItem("guestToken", response.token)
        localStorage.setItem("guestUser", JSON.stringify(response.user))
      }

      if (checkIn && checkOut) {
        router.push(`/guest/booking?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)
      } else {
        router.push("/guest/portal")
      }
    } catch (error: any) {
      console.error("❌ Erro ao registrar:", error)
      const message = error.response?.data?.message || error.message || "Erro ao realizar cadastro"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    const checkInDate = createLocalDate(checkIn)
    const checkOutDate = createLocalDate(checkOut)
    const diff = checkOutDate.getTime() - checkInDate.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const steps = [
    { number: 1, title: "Dados Pessoais", icon: "👤" },
    { number: 2, title: "Contato", icon: "📧" },
    { number: 3, title: "Endereço", icon: "📍" },
    { number: 4, title: "Segurança", icon: "🔐" },
  ]

  return (
    <section className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Completar Cadastro</h1>
            <p className="text-slate-600 dark:text-slate-400">Finalize seu registro em {steps.length} passos simples</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Progress and Summary */}
            <div className="lg:col-span-1 space-y-6">
              {/* Step Indicator */}
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 sticky top-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Etapas do Cadastro</h3>
                <div className="space-y-3">
                  {steps.map((step) => (
                    <div
                      key={step.number}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        currentStep === step.number
                          ? "bg-slate-900 dark:bg-white"
                          : currentStep > step.number
                            ? "bg-emerald-100 dark:bg-emerald-900/30"
                            : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                          currentStep === step.number
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            : currentStep > step.number
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {currentStep > step.number ? "✓" : step.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            currentStep === step.number
                              ? "text-white dark:text-slate-900"
                              : currentStep > step.number
                                ? "text-emerald-900 dark:text-emerald-100"
                                : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {step.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reservation Summary */}
              {hotelName && checkIn && checkOut && (
                <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Sua Reserva</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Hotel</p>
                      <p className="font-medium text-slate-900 dark:text-white line-clamp-2">{hotelName}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Entrada</p>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {formatDateLocal(checkIn, { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Saída</p>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {formatDateLocal(checkOut, { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Noites</p>
                        <p className="font-medium text-slate-900 dark:text-white">{calculateNights()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Login Link */}
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Já tem uma conta?</p>
                <Link
                  href={`/guest/login?hotelId=${hotelId || ""}&checkIn=${checkIn || ""}&checkOut=${checkOut || ""}&guests=${guests}`}
                  className="w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-lg transition-colors"
                >
                  Fazer Login
                </Link>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 md:p-8"
              >
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Dados Pessoais</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Informações básicas sobre você</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        placeholder="João Silva"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4 text-slate-500 dark:text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Data de Nascimento *
                          </div>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <select
                              value={birthDay}
                              onChange={(e) => setBirthDay(e.target.value)}
                              required
                              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition text-sm"
                            >
                              <option value="">Dia</option>
                              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                <option key={day} value={day.toString()}>
                                  {day.toString().padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <select
                              value={birthMonth}
                              onChange={(e) => setBirthMonth(e.target.value)}
                              required
                              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition text-sm"
                            >
                              <option value="">Mês</option>
                              <option value="1">Janeiro</option>
                              <option value="2">Fevereiro</option>
                              <option value="3">Março</option>
                              <option value="4">Abril</option>
                              <option value="5">Maio</option>
                              <option value="6">Junho</option>
                              <option value="7">Julho</option>
                              <option value="8">Agosto</option>
                              <option value="9">Setembro</option>
                              <option value="10">Outubro</option>
                              <option value="11">Novembro</option>
                              <option value="12">Dezembro</option>
                            </select>
                          </div>
                          <div>
                            <select
                              value={birthYear}
                              onChange={(e) => setBirthYear(e.target.value)}
                              required
                              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition text-sm"
                            >
                              <option value="">Ano</option>
                              {Array.from({ length: 100 }, (_, i) => {
                                const year = new Date().getFullYear() - 18 - i
                                return year >= 1920 ? year : null
                              })
                                .filter((year) => year !== null)
                                .map((year) => (
                                  <option key={year} value={year!.toString()}>
                                    {year}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                        {birthDay && birthMonth && birthYear && (
                          <div className="mt-2 flex items-center gap-2 rounded-md bg-slate-50 dark:bg-slate-800/50 px-3 py-2">
                            <svg
                              className="h-4 w-4 text-slate-500 dark:text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              {new Date(
                                parseInt(birthYear),
                                parseInt(birthMonth) - 1,
                                parseInt(birthDay)
                              ).toLocaleDateString("pt-BR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Tipo de Documento *
                        </label>
                        <select
                          name="documentType"
                          value={formData.documentType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition"
                        >
                          <option value="CPF">CPF</option>
                          <option value="RG">RG</option>
                          <option value="CNH">CNH</option>
                          <option value="Passport">Passaporte</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Número do Documento *
                      </label>
                      <input
                        type="text"
                        name="document"
                        value={formData.document}
                        onChange={handleChange}
                        required
                        maxLength={20}
                        placeholder="000.000.000-00"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Contact */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Informações de Contato</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        Como podemos entrar em contato com você
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+55 11 99999-9999"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Address */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Endereço</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        Onde você deseja receber correspondências
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Logradouro *
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        required
                        maxLength={200}
                        placeholder="Rua Exemplo, 123"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Complemento
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        maxLength={200}
                        placeholder="Apto 45"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Bairro
                        </label>
                        <input
                          type="text"
                          name="neighborhood"
                          value={formData.neighborhood}
                          onChange={handleChange}
                          maxLength={100}
                          placeholder="Centro"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          maxLength={100}
                          placeholder="São Paulo"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Estado *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          maxLength={2}
                          placeholder="SP"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          CEP *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          required
                          maxLength={10}
                          placeholder="01234-567"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Security */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Criar Senha</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        Escolha uma senha segura para sua conta
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Senha *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition"
                      />
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">Mínimo 6 caracteres</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Confirmar Senha *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:focus:border-white dark:focus:ring-white/10 outline-none transition"
                      />
                    </div>

                    {formData.password !== formData.confirmPassword && formData.confirmPassword !== "" && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-800 dark:text-red-200">As senhas não coincidem</p>
                      </div>
                    )}

                    <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <input
                        type="checkbox"
                        name="marketingConsent"
                        checked={formData.marketingConsent}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white cursor-pointer"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Desejo receber ofertas e promoções do hotel por email
                      </span>
                    </label>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
                    >
                      Voltar
                    </button>
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="ml-auto px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium transition-colors"
                    >
                      Próximo
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="ml-auto px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-medium transition-colors"
                    >
                      {loading ? "Cadastrando..." : "Concluir Cadastro"}
                    </button>
                  )}
                </div>

                <p className="text-xs text-center text-slate-600 dark:text-slate-400 mt-6">
                  Ao se cadastrar, você concorda com nossos Termos de Serviço e Política de Privacidade
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
