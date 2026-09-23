import { ArrowDown } from "lucide-react"
import { servicios } from "@/src/ui/marketing/servicios/datos"

export function ServiciosHero() {
  return (
    <section className="relative overflow-hidden bg-bg-dark">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.07)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_30%_40%,black_5%,transparent_65%)]" />
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 sm:pb-28 sm:pt-44 lg:px-8">
        <div className="max-w-3xl">
          <p
            style={{ animationDelay: "0ms" }}
            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-white/55 motion-safe:animate-aparecer"
          >
            <span className="h-px w-8 bg-primary" />
            Servicios
          </p>
          <h1
            style={{ animationDelay: "120ms" }}
            className="mt-6 text-balance text-[38px] font-bold leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl motion-safe:animate-aparecer"
          >
            Soluciones hechas a la medida de{" "}
            <span className="bg-gradient-to-br from-primary-light from-30% to-primary bg-clip-text text-transparent">
              tu operación
            </span>
          </h1>
          <p
            style={{ animationDelay: "240ms" }}
            className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg motion-safe:animate-aparecer"
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
