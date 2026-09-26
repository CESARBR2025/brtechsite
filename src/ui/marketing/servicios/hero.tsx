import { OndasGradiente } from "@/src/ui/primitivos/ondas-gradiente"
import { ArrowDown } from "lucide-react"
import { servicios } from "@/src/ui/marketing/servicios/datos"

export function ServiciosHero() {
  return (
    <section className="relative overflow-hidden bg-bg-dark">
      {/* Ondas de marca; el velo lateral protege la lectura del texto (alineado a la izquierda) */}
      <div className="absolute inset-0">
        <OndasGradiente />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-bg-dark/90 via-bg-dark/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-bg-dark" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 sm:pb-28 sm:pt-44 lg:px-8">
        <div className="max-w-3xl">
          <p
            style={{ animationDelay: "0ms" }}
            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75 motion-safe:animate-aparecer sm:gap-4 sm:text-xs"
          >
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary-light/70 sm:w-14" aria-hidden="true" />
            Servicios
          </p>
          <h1
            style={{ animationDelay: "120ms" }}
            className="mt-6 text-balance font-hero text-[38px] font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl motion-safe:animate-aparecer"
          >
            Soluciones hechas a la medida de{" "}
            <span>
              tu operación
            </span>
          </h1>
          <p
            style={{ animationDelay: "240ms" }}
            className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-xl motion-safe:animate-aparecer"
          >
            Sistemas de venta, control de inventarios y presencia digital,
            diseñados alrededor de cómo trabaja tu negocio, no al revés.
          </p>
        </div>

        {/* Índice: salta a cada servicio */}
        <nav
          aria-label="Servicios en esta página"
          style={{ animationDelay: "360ms" }}
          className="mt-12 flex flex-wrap gap-3 motion-safe:animate-aparecer"
        >
          {servicios.map((s, i) => (
            <a
              key={s.ancla}
              href={`#${s.ancla}`}
              className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 py-2 pl-2 pr-4 text-sm font-medium text-white/85 outline-none backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-primary/15 hover:text-white focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line-dark bg-bg-dark font-mono text-xs tabular-nums text-primary-light">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.titulo}
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
