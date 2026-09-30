import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { GaleriaAcordeon } from "@/src/ui/primitivos/galeria-acordeon"
import { proyectos } from "@/src/ui/marketing/proyectos/datos"
import { iconoModulo } from "@/src/ui/marketing/proyectos/iconos"

/*
 * Caso destacado del home: tarjeta oscura compacta (galería + resumen) sobre
 * sección clara. La historia completa (antes → después, fases) vive en
 * /proyectos/[slug]. Todo sale de `proyectos/datos.ts`; nada inventado. Con
 * más proyectos, cada uno repite la tarjeta.
 */

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"

export function ProyectosRecientesSection() {
  return (
    <section id="proyectos" className="relative scroll-mt-24 bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Proyecto destacado
            <span className="h-px w-8 bg-primary" />
          </p>
          <h2 className="mt-5 text-balance font-display text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-5xl">
            Lo último que hemos construido
          </h2>
        </div>

        <div className="mt-14 space-y-8">
          {proyectos.map((p) => {
            // Ficha en una sola línea: giro · alcance · plataformas
            const meta = ["giro", "alcance", "plataforma"]
              .map((clave) => p.ficha.find((f) => f.etiqueta.toLowerCase().startsWith(clave))?.valor)
              .filter(Boolean)
              .join(" · ")

            return (
              /* Tarjeta oscura sobre sección clara, como la del CTA final */
              <article
                key={p.slug}
                className="relative isolate overflow-hidden rounded-3xl border border-line-dark bg-bg-deep shadow-[0_40px_80px_-40px_rgba(71,31,163,0.55)]"
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-32 -top-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(120,54,226,0.35),transparent_65%)] blur-2xl"
                />
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                <div className="grid items-center gap-8 p-4 sm:p-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:p-8">
                  <GaleriaAcordeon
                    elementos={p.galeria}
                    proporcion={0.6}
                    alturas="h-[440px] sm:h-[360px] lg:h-[480px]"
                  />

                  <div className="px-2 pb-4 sm:px-2 lg:py-4 lg:pr-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {p.logo && (
                        <span className="flex h-12 items-center rounded-xl bg-white px-3.5">
                          <Image src={p.logo} alt={p.cliente} width={659} height={379} className="h-8 w-auto object-contain" />
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                        </span>
                        {p.estado}
                      </span>
                    </div>

                    <h3 className="mt-6 text-balance font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {p.titulo}
                    </h3>
                    <p className="mt-2 text-pretty text-base text-white/70">{p.subtitulo}</p>
                    {meta && <p className="mt-3 text-sm text-white/45">{meta}</p>}

                    <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                      {p.puntos.slice(0, 3).map((x) => (
                        <li key={x} className="flex gap-3 text-sm leading-relaxed text-white/85 sm:text-base">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20">
                            <Check className="h-3 w-3 text-success" strokeWidth={3} aria-hidden="true" />
                          </span>
                          {x}
                        </li>
                      ))}
                    </ul>

                    {p.modulos.length > 0 && (
                      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Lo que incluye">
                        {p.modulos.map((m) => {
                          const Icono = iconoModulo(m.titulo)
                          return (
                            <li
                              key={m.titulo}
                              title={m.descripcion}
                              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white/75"
                            >
                              <Icono className="h-3.5 w-3.5 text-primary-light" aria-hidden="true" />
                              {m.titulo}
                            </li>
                          )
                        })}
                      </ul>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/proyectos/${p.slug}`}
                        className={`group/caso inline-flex whitespace-nowrap items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover active:scale-[0.98] ${focusRing}`}
                      >
                        Ver caso completo
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/caso:translate-x-1" />
                      </Link>
                      <Link
                        href="/contacto"
                        className={`group/enlace inline-flex whitespace-nowrap items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition-all hover:border-primary/60 hover:bg-primary/20 ${focusRing}`}
                      >
                        Quiero un sistema así
                        <ArrowRight className="h-4 w-4 text-primary-light transition-transform group-hover/enlace:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
