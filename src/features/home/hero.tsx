import Link from "next/link"
import { ChevronRight, TrendingUp, Zap, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-bg-dark">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.07)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-text-muted">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Resultados medibles en 90 días
          </div>

          <h1 className="mt-6 text-[28px] font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Tu negocio es diferente. {" "}
            <span className="text-primary">Tu sofware también debería de serlo </span>
          </h1>
          <p className="mt-4 text-base text-text-muted sm:text-lg">
            Diseñamos software que se adapta a tu operación, no operaciones que se adapten al software

          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contacto"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
            >
              Contactanos
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/casos-exito"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-text-muted transition-colors hover:bg-white/10 hover:text-white sm:w-auto"
            >
              Nuestros servicios
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-success" />
              Software diseñado para tu negocio
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" />
              +50 proyectos entregados
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-warning" />
              Resultados en semanas, no meses
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
