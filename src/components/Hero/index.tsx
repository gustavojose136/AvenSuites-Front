import Image from "next/image"
import Link from "next/link"

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-[120px] md:pt-[130px] lg:pt-[160px] pb-16"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full">
              <div className="hero-content mx-auto max-w-[900px] text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center rounded-full bg-blue-800/50 border border-blue-700/50 px-4 py-2 text-sm font-medium text-blue-100">
                    <span className="mr-2 rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                      Novo
                    </span>
                    Gestão Hoteleira Inteligente
                    <Link href="#" className="ml-2 text-blue-300 hover:text-blue-200 hover:underline">
                      Saiba mais
                    </Link>
                  </div>
                </div>

                <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight text-balance">
                  Gestão hoteleira <span className="text-blue-300">super eficiente</span> para cada hotel
                </h1>

                <p className="mx-auto mb-9 max-w-[600px] text-lg font-medium text-blue-100 sm:text-xl sm:leading-relaxed text-pretty">
                  Aven Suits é a plataforma completa de gestão hoteleira que automatiza reservas, otimiza operações e
                  maximiza a satisfação dos seus hóspedes.
                </p>

                <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
                  <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                    Começar Gratuitamente
                  </button>
                  <button className="inline-flex items-center justify-center rounded-lg border border-blue-400/50 bg-transparent px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-800/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                    Agendar Demo
                  </button>
                </div>

                <div className="mb-12">
                  <p className="mb-6 text-center text-base font-medium text-blue-200">
                    Mais de 2.500 hotéis confiam no Aven Suits para otimizar suas operações
                  </p>
                  <div className="flex items-center justify-center gap-8 opacity-60 hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-2 text-lg font-bold text-blue-100">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">H</span>
                      </div>
                      Hilton
                    </div>
                    <div className="flex items-center gap-2 text-lg font-bold text-blue-100">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">M</span>
                      </div>
                      Marriott
                    </div>
                    <div className="flex items-center gap-2 text-lg font-bold text-blue-100">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">A</span>
                      </div>
                      Accor
                    </div>
                    <div className="flex items-center gap-2 text-lg font-bold text-blue-100">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">I</span>
                      </div>
                      IHG
                    </div>
                    <div className="flex items-center gap-2 text-lg font-bold text-blue-100">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">H</span>
                      </div>
                      Hyatt
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="relative z-10 mx-auto max-w-[900px]">
                <div className="mt-8">
                  <div className="relative rounded-xl border border-blue-700/50 bg-slate-800/50 backdrop-blur-sm p-2 shadow-2xl">
                    <Image
                      src="/images/about/modern-hotel-management-dashboard-interface-with-b.jpg"
                      alt="Aven Suits Hotel Management Dashboard"
                      className="w-full rounded-lg"
                      width={800}
                      height={500}
                    />
                    <div className="absolute -left-4 top-1/4 hidden lg:block">
                      <div className="rounded-lg bg-slate-800/90 border border-blue-700/50 backdrop-blur-sm p-3 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-sm font-medium text-white">95% Ocupação</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -right-4 top-1/3 hidden lg:block">
                      <div className="rounded-lg bg-slate-800/90 border border-blue-700/50 backdrop-blur-sm p-3 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <span className="text-sm font-medium text-white">+127 Reservas</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-4 left-1/4 hidden lg:block">
                      <div className="rounded-lg bg-slate-800/90 border border-blue-700/50 backdrop-blur-sm p-3 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <span className="text-sm font-medium text-white">4.9★ Satisfação</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -left-4 top-1/4 z-[-1] opacity-20">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-blue-400 rounded-full"></div>
            ))}
          </div>
        </div>
        <div className="absolute -right-4 top-1/3 z-[-1] opacity-20">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-blue-400 rounded-full"></div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
