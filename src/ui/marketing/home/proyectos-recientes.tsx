import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { GaleriaAcordeon } from "@/src/ui/primitivos/galeria-acordeon"
import { proyectos } from "@/src/ui/marketing/proyectos/datos"


export function ProyectosRecientesSection() {
  return (
    <section
      id="proyectos"
      className="relative scroll-mt-24 overflow-hidden bg-surface py-24 sm:py-32"
    >

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Proyectos recientes
          </p>
          <h2 className="mt-5 text-balance font-display text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-5xl">
            Lo último que hemos construido
          </h2>
        </div>

        <div className="mt-14 space-y-16">
          {proyectos.map((p) => (
            <article
              key={p.titulo}
              className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14"
            >
              {/* Galería del sistema en operación */}
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
                <GaleriaAcordeon
                  elementos={p.galeria}
                  proporcion={0.6}
                  alturas="h-[560px] sm:h-[480px] lg:h-[600px]"
                  className="relative"
                />
              </div>

              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  {p.cliente}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success-light px-2.5 py-0.5 text-[11px] font-medium normal-case tracking-normal text-success">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                    </span>
                    {p.estado}
                  </span>
                </p>
                <h3 className="mt-3 text-balance font-display text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                  {p.titulo}
                </h3>
                <p className="mt-2 text-pretty text-base font-medium text-text-primary/80 sm:text-lg">
                  {p.subtitulo}
                </p>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-text-secondary sm:text-base">
                  {p.resumen}
                </p>

                <dl className="mt-8 grid grid-cols-2 gap-4">
                  {p.datos.map((d) => (
                    <div
                      key={d.etiqueta}
                      className="flex flex-col-reverse rounded-2xl border border-border bg-bg-section p-5"
                    >
                      <dt className="mt-1 text-xs text-text-muted">{d.etiqueta}</dt>
                      <dd className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">{d.valor}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-8 divide-y divide-border border-y border-border">
                  {p.puntos.map((punto) => (
                    <li key={punto} className="flex items-start gap-3 py-4 text-sm text-text-secondary sm:text-base">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                      {punto}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link
                    href="/contacto"
                    className="group/enlace inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 outline-none transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Quiero un sistema así
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/enlace:translate-x-1" />
                  </Link>
                  <Link
                    href={`/proyectos/${p.slug}`}
                    className="group/caso inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-text-secondary outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Ver caso completo
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/caso:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
