import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"
import { BotonEspecular } from "@/src/ui/primitivos/boton-especular"
import { VeloOscuro } from "@/src/ui/primitivos/velo-oscuro"

// Entrada escalonada (clase motion-safe:animate-aparecer + retraso);
// con reduced-motion todo aparece de inmediato.
const retraso = (ms: number) => ({ animationDelay: `${ms}ms` })

export function HeroSection() {
  return (
    // Al menos una pantalla completa (svh: descuenta la barra del navegador móvil)
    <section className="relative flex min-h-svh items-center overflow-hidden bg-bg-deep">
      {/* Velo animado (WebGL) con sus colores originales sobre negro puro */}
      <div className="absolute inset-0">
        <VeloOscuro hueShift={0} poster="/fondos/velo-poster.webp" />
      </div>

      {/* Funde el velo hacia bg-dark, el fondo de las secciones siguientes */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg-dark" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Qué hacemos */}
          <div
            style={retraso(0)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm motion-safe:animate-aparecer"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(120,54,226,0.7)]" />
            Software a la medida para empresas
          </div>

          {/* Eslogan */}
          <h1
            style={retraso(120)}
            className="mt-7 text-balance text-[40px] font-bold leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl motion-safe:animate-aparecer"
          >
            Tu negocio es diferente.{" "}
            <span className="block bg-gradient-to-br from-primary-light from-30% to-primary bg-clip-text text-transparent">
              Tu software también debería serlo
            </span>
          </h1>

          {/* Promesa */}
          <p
            style={retraso(240)}
            className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg motion-safe:animate-aparecer"
          >
            Diseñamos software que se adapta a ti, a tu operación y a tu
            entorno.
          </p>

          <div
            style={retraso(360)}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row motion-safe:animate-aparecer"
          >
            <BotonEspecular
              href="/contacto"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] sm:w-auto"
            >
              Agendar Consulta Gratuita
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </BotonEspecular>
            <Link
              href="/#proyectos"
              className="group inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-medium text-white/85 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10 hover:text-white sm:w-auto"
            >
              Ver proyectos
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
