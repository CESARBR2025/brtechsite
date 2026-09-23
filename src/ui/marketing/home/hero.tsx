import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { BotonEspecular } from "@/src/ui/primitivos/boton-especular"
import { VeloOscuro } from "@/src/ui/primitivos/velo-oscuro"

// Entrada escalonada (clase motion-safe:animate-aparecer + retraso);
// con reduced-motion todo aparece de inmediato.
const retraso = (ms: number) => ({ animationDelay: `${ms}ms` })

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-bg-deep">
      {/* Velo animado (WebGL) con sus colores originales sobre negro puro */}
      <div className="absolute inset-0">
        <VeloOscuro hueShift={0} />
      </div>

      {/* Funde el velo hacia el borde inferior */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg-deep" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-36 sm:px-6 sm:pb-32 sm:pt-44 lg:px-8">
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
            <span className="bg-gradient-to-br from-primary-light from-30% to-primary bg-clip-text text-transparent">
              Tu software también debería de serlo
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
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </BotonEspecular>
            <Link
              href="/#proyectos"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-medium text-white/85 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10 hover:text-white sm:w-auto"
            >
              Ver proyectos
            </Link>
          </div>

          {/* Prueba social discreta */}
          <p
            style={retraso(480)}
            className="mt-10 inline-flex items-center gap-2 text-xs text-white/55 sm:text-sm motion-safe:animate-aparecer"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            <span>
              <span className="font-medium text-white/80">Parrilla Norteña Soft</span>, nuestro primer
              sistema, opera hoy en 2 sucursales
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
