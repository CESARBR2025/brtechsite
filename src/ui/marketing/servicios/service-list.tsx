import Link from "next/link"
import { ArrowRight, Check, Minus, TrendingUp } from "lucide-react"
import { servicios } from "@/src/ui/marketing/servicios/datos"
import {
  IlustracionInventario,
  IlustracionMultisucursal,
  IlustracionWeb,
} from "@/src/ui/marketing/home/ilustraciones-servicios"

const ilustraciones: Record<string, () => React.JSX.Element> = {
  "sistema-pos-para-restaurantes": IlustracionMultisucursal,
  "control-de-inventarios": IlustracionInventario,
  "tu-negocio-digital": IlustracionWeb,
}

// La rejilla cambia de lado en cada servicio para que no se repita
const mascaras = [
  "[mask-image:radial-gradient(ellipse_at_20%_30%,black_5%,transparent_60%)]",
  "[mask-image:radial-gradient(ellipse_at_80%_40%,black_5%,transparent_60%)]",
  "[mask-image:radial-gradient(ellipse_at_30%_70%,black_5%,transparent_60%)]",
]

function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-white/55">{children}</h3>
  )
}

export function ServiceList() {
  return (
    <>
      {servicios.map((s, i) => {
        const Ilustracion = ilustraciones[s.ancla]
        return (
          <section
            key={s.ancla}
            id={s.ancla}
            aria-labelledby={`${s.ancla}-titulo`}
            className="relative scroll-mt-24 overflow-clip border-t border-line-dark bg-bg-dark py-24 sm:py-32"
          >
            <div
              className={`absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.06)_1px,transparent_1px)] bg-[size:64px_64px] ${mascaras[i % mascaras.length]}`}
            />

            <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
              {/* Izquierda: qué es (fija al hacer scroll) */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <span className="font-mono text-sm tabular-nums text-primary-light/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2
                  id={`${s.ancla}-titulo`}
                  className="mt-3 text-balance text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl"
                >
                  {s.titulo}
                </h2>
                <p className="mt-5 text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
                  {s.descripcion}
                </p>
                {Ilustracion && (
                  <div className="group mt-8 max-w-md">
                    <Ilustracion />
                  </div>
                )}
                <Link
                  href="/contacto"
                  className="group/enlace mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white outline-none transition-all hover:border-primary hover:bg-primary hover:shadow-lg hover:shadow-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
                >
                  Cotiza este servicio
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/enlace:translate-x-1" />
                </Link>
              </div>

              {/* Derecha: detalle */}
              <div className="space-y-14">
                <div>
                  <Etiqueta>¿Por qué lo necesitas?</Etiqueta>
                  <ul className="mt-4 divide-y divide-line-dark border-y border-line-dark">
                    {s.necesidad.map((n) => (
                      <li key={n} className="flex items-start gap-4 py-4 text-base text-white/85">
                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(120,54,226,0.6)]" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Etiqueta>Qué incluye</Etiqueta>
                  <ul className="mt-5 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                    {s.incluye.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-white/80 sm:text-base">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-light sm:mt-1" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Etiqueta>No incluye</Etiqueta>
                  <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {s.noIncluye.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-white/55">
                        <Minus className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/35" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Etiqueta>Resultados esperados</Etiqueta>
                  <ul className="mt-5 grid grid-cols-2 gap-3">
                    {s.resultados.map((r) => (
                      <li
                        key={r}
                        className="rounded-2xl border border-line-dark bg-surface-dark p-5 transition-colors hover:border-line-dark-strong hover:bg-surface-dark-hover"
                      >
                        <TrendingUp className="h-5 w-5 text-primary-light" />
                        <p className="mt-3 text-sm font-medium leading-snug text-white">{r}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-line-dark bg-surface-dark p-6 sm:p-7">
                  <Etiqueta>Qué define la inversión</Etiqueta>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-white/65">
                    Cada proyecto se cotiza a la medida, sin costo. Estos factores
                    influyen en el alcance:
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.factores.map((f) => (
                      <li
                        key={f}
                        className="rounded-full border border-line-dark-strong px-3 py-1.5 text-xs text-white/75 sm:text-sm"
                      >
                        {f}
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
