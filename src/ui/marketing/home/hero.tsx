import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"
import { BotonEspecular } from "@/src/ui/primitivos/boton-especular"
import { OndasGradiente } from "@/src/ui/primitivos/ondas-gradiente"
import { TextoDesenfocado } from "@/src/ui/primitivos/texto-desenfocado"

// Entrada escalonada (clase motion-safe:animate-aparecer + retraso);
// con reduced-motion todo aparece de inmediato.
const retraso = (ms: number) => ({ animationDelay: `${ms}ms` })

export function HeroSection() {
  return (
    // Al menos una pantalla completa (svh: descuenta la barra del navegador móvil)
    <section className="relative flex min-h-svh items-center overflow-hidden bg-bg-deep">
      {/* Ondas de gradiente violeta (WebGL): el efecto de marca del sitio */}
      <div className="absolute inset-0">
        <OndasGradiente />
      </div>

      {/* Oscurece el borde inferior: el hero cierra en oscuro y el contenido abre en claro */}
      <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-b from-transparent to-bg-deep/80" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Qué hacemos: rótulo en versalitas, mismo lenguaje que la propuesta */}
          <p
            style={retraso(0)}
            className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75 motion-safe:animate-aparecer sm:gap-4 sm:text-xs"
          >
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary-light/70 sm:w-14" aria-hidden="true" />
            Software a la medida para empresas
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary-light/70 sm:w-14" aria-hidden="true" />
          </p>

          {/* Eslogan */}
          <h1 className="mt-7 text-balance font-hero text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-white [text-shadow:0_0_60px_rgba(120,54,226,0.35)] sm:text-6xl lg:text-7xl">
            <TextoDesenfocado texto="Tu negocio es diferente." retrasoMs={120} />{" "}
            <span className="block">
              <TextoDesenfocado texto="Tu software también debería serlo" retrasoMs={460} />
            </span>
          </h1>

          <div
            style={retraso(900)}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row motion-safe:animate-aparecer"
          >
            <BotonEspecular
              href="/contacto"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] sm:w-auto"
            >
              Agendar consulta gratuita
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </BotonEspecular>
            <Link
              href="/#proyectos"
              className="group inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-primary/60 hover:bg-primary/20 sm:w-auto"
            >
              Ver proyectos
              <ArrowDown className="h-4 w-4 text-primary-light transition-transform group-hover:translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
