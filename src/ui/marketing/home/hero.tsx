import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronDown, Sparkles } from "lucide-react"
import { BotonEspecular } from "@/src/ui/primitivos/boton-especular"

const clientes = [
  { marca: "Parrilla Norteña", sucursal: "Sucursal Lomas" },
  { marca: "Parrilla Norteña", sucursal: "Sucursal Club Punta Nogal" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-bg-dark">
      {/* Rejilla con máscara para que se desvanezca hacia los bordes */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.07)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_50%_35%,black_10%,transparent_75%)]" />

      {/* Resplandor central + halo cónico que gira lento */}
      <div className="absolute left-1/2 top-[36%] h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,54,226,0.30),transparent_62%)] blur-2xl" />
      <div className="absolute left-1/2 top-[36%] h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_90deg,transparent,rgba(120,54,226,0.16),transparent_45%)] blur-3xl motion-safe:animate-[spin_32s_linear_infinite]" />

      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-36 sm:px-6 sm:pb-32 sm:pt-44 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-white/5 to-primary/10 px-4 py-1.5 text-xs font-medium text-text-muted shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Resultados medibles en 90 días
          </div>

          <h1 className="mt-6 text-balance text-[32px] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
            Tu negocio es diferente.{" "}
            <span className="bg-gradient-to-br from-primary-light to-primary bg-clip-text text-transparent">
              Tu software también debería de serlo
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            Diseñamos un software que se adapte a ti, a tu operación, a tu
            entorno.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BotonEspecular
              href="/contacto"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] sm:w-auto"
            >
              Agendar Consulta Gratuita
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </BotonEspecular>
            <Link
              href="/#proyectos"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-medium text-text-muted shadow-lg backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white sm:w-auto"
            >
              Ver proyectos
            </Link>
          </div>

          <div className="mx-auto mt-14 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Nuestros Clientes
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {clientes.map((c) => (
                <div
                  key={c.sucursal}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left shadow-lg backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-white p-2">
                    <Image
                      src="/clientes/parrilla-nortena/logo-arracheras.png"
                      alt={`${c.marca} — ${c.sucursal}`}
                      width={659}
                      height={379}
                      className="max-h-full w-auto object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-white">
                      {c.sucursal}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                      </span>
                      En operación
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <ChevronDown className="h-5 w-5 text-white/25 motion-safe:animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
