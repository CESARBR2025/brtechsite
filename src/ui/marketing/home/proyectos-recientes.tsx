import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { GaleriaAcordeon } from "@/src/ui/primitivos/galeria-acordeon"
import { proyectos } from "@/src/ui/marketing/proyectos/datos"


export function ProyectosRecientesSection() {
  return (
    <section
      id="proyectos"
      className="relative scroll-mt-24 overflow-hidden bg-bg-dark py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.06)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_30%_50%,black_5%,transparent_65%)]" />
      <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-white/55">
            <span className="h-px w-8 bg-primary" />
            Proyectos recientes
          </p>
          <h2 className="mt-5 text-balance text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl">
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
                <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl" />
                <GaleriaAcordeon
                  elementos={p.galeria}
                  proporcion={0.6}
                  alturas="h-[560px] sm:h-[480px] lg:h-[600px]"
                  className="relative"
                />
              </div>

              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-light/80">
                  {p.cliente}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line-dark bg-surface-dark px-2.5 py-0.5 text-[11px] font-medium normal-case tracking-normal text-white/75">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                    </span>
                    {p.estado}
                  </span>
                </p>
                <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {p.titulo}
                </h3>
                <p className="mt-2 text-pretty text-base font-medium text-white/80 sm:text-lg">
                  {p.subtitulo}
                </p>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-white/65 sm:text-base">
                  {p.resumen}
                </p>

                <dl className="mt-8 grid grid-cols-2 gap-4">
                  {p.datos.map((d) => (
                    <div
                      key={d.etiqueta}
                      className="flex flex-col-reverse rounded-2xl border border-line-dark bg-surface-dark p-5"
                    >
                      <dt className="mt-1 text-xs text-white/55">{d.etiqueta}</dt>
                      <dd className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{d.valor}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-8 divide-y divide-line-dark border-y border-line-dark">
                  {p.puntos.map((punto) => (
                    <li key={punto} className="flex items-start gap-3 py-4 text-sm text-white/75 sm:text-base">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-light" />
                      {punto}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link
                    href="/contacto"
                    className="group/enlace inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white outline-none transition-all hover:border-primary hover:bg-primary hover:shadow-lg hover:shadow-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
                  >
                    Quiero un sistema así
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/enlace:translate-x-1" />
                  </Link>
                  <Link
                    href={`/proyectos/${p.slug}`}
                    className="group/caso inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-white/80 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary"
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
