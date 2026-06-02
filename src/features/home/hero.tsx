import Link from "next/link"
import { ChevronRight, TrendingUp, Zap, Shield, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-bg-dark">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.07)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-white/5 to-primary/10 px-4 py-1.5 text-xs font-medium text-text-muted shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Resultados medibles en 90 días
          </div>

          <h1 className="mt-6 text-[28px] font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Tu negocio es diferente.{" "}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Tu software también debería de serlo
            </span>
          </h1>
          <p className="mt-4 text-base text-text-muted sm:text-lg">
            Diseñamos software que se adapta a tu operación, no operaciones que
            se adapten al software
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contacto"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-hover px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] sm:w-auto"
            >
              Agendar Consulta Gratuita
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/servicios"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-7 py-3 text-sm font-medium text-text-muted shadow-lg backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white sm:w-auto"
            >
              Nuestros servicios
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-success" />
              Software diseñado para tu negocio
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              +50 proyectos entregados
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-1.5">
              <Zap className="h-3.5 w-3.5 text-warning" />
              Resultados en semanas, no meses
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
