"use client"

import { useState, useEffect } from "react"
import { httpClient } from "@/infrastructure/http/HttpClient"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface Hotel {
  id: string
  name: string
  legalName?: string
  address?: string
  city?: string
  state?: string
  status?: string
  phone?: string
  email?: string
  isActive: boolean
}

interface FilterState {
  amenities: string[]
  priceRange: [number, number]
  rating: number
}

export default function GuestSearchPage() {
  const router = useRouter()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guests, setGuests] = useState(2)
  const [filters, setFilters] = useState<FilterState>({
    amenities: [],
    priceRange: [50, 500],
    rating: 0,
  })
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    fetchHotels()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [hotels, filters])

  const fetchHotels = async () => {
    try {
      setLoading(true)
      let data: Hotel[] = []
      try {
        data = await httpClient.get<Hotel[]>("/Hotels")
      } catch (err) {
        data = await httpClient.get<Hotel[]>("/Hotel")
      }

      const activeHotels = data.filter((h) => h.status === "ACTIVE")
      setHotels(activeHotels.length > 0 ? activeHotels : data)
    } catch (error) {
      console.error("❌ Erro ao buscar hotéis:", error)
      toast.error("Erro ao carregar hotéis disponíveis")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = hotels

    filtered = filtered.filter((hotel) => {
      if (filters.amenities.length > 0) {
        // Simulação de filtro de amenidades (adaptar conforme sua estrutura)
        return true
      }
      return true
    })

    setFilteredHotels(filtered)
  }

  const handleHotelSelect = (hotelId: string) => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Por favor, selecione as datas de check-in e check-out")
      return
    }

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkIn < today) {
      toast.error("A data de check-in não pode ser no passado")
      return
    }

    if (checkOut <= checkIn) {
      toast.error("A data de check-out deve ser após o check-in")
      return
    }

    const params = new URLSearchParams({
      hotelId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests.toString(),
    })
    router.push(`/guest/register?${params.toString()}`)
  }

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const diff = checkOut.getTime() - checkIn.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const today = new Date().toISOString().split("T")[0]
  const minCheckOut = checkInDate || today

  const amenitiesOptions = [
    { id: "wifi", label: "WiFi Grátis" },
    { id: "pool", label: "Piscina" },
    { id: "gym", label: "Academia" },
    { id: "parking", label: "Estacionamento" },
    { id: "restaurant", label: "Restaurante" },
  ]

  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Encontre seu <span className="text-primary">Hotel Perfeito</span>
            </h1>
            <Link
              href="/guest/login"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Login
            </Link>
          </div>
          <p className="text-muted-foreground">Escolha as datas e encontre as melhores opções</p>
        </div>

        {/* Search Box */}
        <div className="mb-8 bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Check-in</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                min={today}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Check-out</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={minCheckOut}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Hóspedes</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "pessoa" : "pessoas"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">&nbsp;</label>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-2 font-semibold hover:bg-primary/90 transition-colors"
              >
                {showFilters ? "Fechar Filtros" : "Mostrar Filtros"}
              </button>
            </div>
          </div>

          {checkInDate && checkOutDate && (
            <div className="mt-4 p-3 bg-muted rounded-lg flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {new Date(checkInDate).toLocaleDateString("pt-BR")} →{" "}
                {new Date(checkOutDate).toLocaleDateString("pt-BR")}
              </span>
              <span className="text-sm font-semibold text-primary">
                {calculateNights()} {calculateNights() === 1 ? "noite" : "noites"}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {showFilters && (
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm sticky top-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Filtros</h3>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Amenidades</h4>
                  <div className="space-y-2">
                    {amenitiesOptions.map((amenity) => (
                      <label key={amenity.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters((prev) => ({
                                ...prev,
                                amenities: [...prev.amenities, amenity.id],
                              }))
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                amenities: prev.amenities.filter((a) => a !== amenity.id),
                              }))
                            }
                          }}
                          className="rounded border-input"
                        />
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                          {amenity.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Preço */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Preço por Noite</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      R$ {filters.priceRange[0]} - R$ {filters.priceRange[1]}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) => {
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [prev.priceRange[0], Number(e.target.value)],
                        }))
                      }}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Avaliação Mínima</h4>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFilters((prev) => ({ ...prev, rating: star }))}
                        className={`text-2xl transition-colors ${
                          star <= filters.rating ? "text-accent" : "text-muted-foreground"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hotels Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary mb-4"></div>
                  <p className="text-muted-foreground">Carregando hotéis...</p>
                </div>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center shadow-sm">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                  <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Nenhum hotel encontrado</h3>
                <p className="text-muted-foreground">Tente ajustar seus filtros de busca</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="h-20 w-20 text-primary/20 group-hover:text-primary/30 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2 py-1 rounded-lg text-xs font-semibold">
                        R$ 150/noite
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {hotel.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-accent text-sm">
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">(248 avaliações)</span>
                      </div>

                      {/* Info */}
                      <div className="space-y-2 mb-4 text-sm">
                        {hotel.city && hotel.state && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                            </svg>
                            <span>
                              {hotel.city}, {hotel.state}
                            </span>
                          </div>
                        )}
                        {hotel.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span>{hotel.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mb-4 flex-wrap">
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">WiFi</span>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Piscina</span>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Academia</span>
                      </div>

                      {/* Button */}
                      <button
                        onClick={() => handleHotelSelect(hotel.id)}
                        className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Selecionar</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-12 text-center">
          <Link
            href="/user-type"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </Link>
        </div>
      </div>
    </section>
  )
}
