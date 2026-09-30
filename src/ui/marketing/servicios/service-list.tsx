import Link from "next/link"
import { ArrowRight, Check, Minus } from "lucide-react"
import { servicios } from "@/src/ui/marketing/servicios/datos"
import { FotoServicio } from "@/src/ui/marketing/servicios/foto-servicio"

/*
 * Un servicio por sección, alternando fondo claro y gris y el lado de la foto
 * (zig-zag). Arriba: qué es y para quién; abajo: dolores que resuelve y qué
 * incluye; al pie, alcance e inversión en una franja discreta.
 */

function Etiqueta({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted ${className}`}>{children}</p>
  )
}

export function ServiceList() {
  return (
    <>
      {servicios.map((s, i) => {
        const par = i % 2 === 1
        const incluye = [...s.funciones, ...s.entregables]

        return (
          <section
            key={s.ancla}
            id={s.ancla}
            aria-labelledby={`${s.ancla}-titulo`}
            className={`relative scroll-mt-24 py-24 sm:py-32 ${par ? "bg-bg-section" : "bg-surface"}`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Qué es y para quién */}
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={par ? "lg:order-last" : ""}>
                  <FotoServicio foto={s.foto} prioridad={i === 0} />
                </div>

                <div>
                  <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light">
                      <s.icono className="h-4 w-4 text-primary" aria-hidden="true" />
                    </span>
                    {s.pestana}
                  </p>
                  <h2
                    id={`${s.ancla}-titulo`}
                    className="mt-5 text-balance font-display text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-[44px]"
                  >
                    {s.titulo}
                  </h2>
                  <p className="mt-5 text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
                    {s.descripcion}
                  </p>

                  <Etiqueta className="mt-7">Ideal para</Etiqueta>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {s.idealPara.map((x) => (
                      <li
                        key={x}
                        className="rounded-full border border-primary/15 bg-primary-light/60 px-3 py-1 text-xs font-medium text-primary-hover"
                      >
                        {x}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/contacto?interes=${s.id}`}
                    className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 outline-none transition-all hover:bg-primary-hover hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]"
                  >
                    Cotiza este servicio
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Dolores que resuelve + qué incluye */}
              <div className="mt-14 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="relative isolate overflow-hidden rounded-3xl border border-line-dark bg-bg-deep p-6 shadow-[0_40px_80px_-40px_rgba(71,31,163,0.55)] sm:p-8">
                  <div
                    aria-hidden="true"
                    className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(120,54,226,0.4),transparent_65%)] blur-2xl"
                  />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-light">
                    ¿Te suena familiar?
                  </p>
                  <ul className="mt-6 space-y-4">
                    {s.necesidad.map((n) => (
                      <li key={n} className="flex items-start gap-3 text-base leading-relaxed text-white/85">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(120,54,226,0.6)]" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
                  <Etiqueta>Qué incluye</Etiqueta>
                  <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {incluye.map((x) => (
                      <li key={x} className="flex items-start gap-2.5 text-sm text-text-secondary sm:text-base">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success sm:mt-1" aria-hidden="true" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Alcance e inversión */}
              <div className="mt-4 grid gap-6 rounded-2xl border border-dashed border-primary/30 px-6 py-5 lg:grid-cols-2 lg:gap-10">
                <div>
                  <Etiqueta>No incluye</Etiqueta>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                    {s.noIncluye.map((x) => (
                      <li key={x} className="flex items-center gap-1.5 text-sm text-text-muted">
                        <Minus className="h-3.5 w-3.5 shrink-0 text-text-muted/60" aria-hidden="true" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Etiqueta>La inversión depende de</Etiqueta>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {s.factores.map((x) => (
                      <li
                        key={x}
                        className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary"
                      >
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}
