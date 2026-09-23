import { Clock } from "lucide-react"
import { pasos } from "@/src/ui/marketing/servicios/datos"

export function ServiciosProceso() {
  return (
    <section className="relative overflow-clip border-t border-line-dark bg-bg-dark py-24 sm:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.06)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_75%_50%,black_5%,transparent_60%)]" />
      <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-white/55">
            <span className="h-px w-8 bg-primary" />
            Cómo trabajamos
          </p>
          <h2 className="mt-5 text-balance text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl">
            El mismo proceso para cada servicio
          </h2>
          <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-white/65 sm:text-lg">
            Siete pasos claros, con avances semanales, desde que conocemos tu
            negocio hasta la entrega formal de tu sistema.
          </p>
        </div>

        <ol className="relative">
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-5 top-6 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent"
          />
          {pasos.map((p, i) => (
            <li key={p.titulo} className="group relative grid grid-cols-[2.5rem_1fr] gap-x-5 pb-8 last:pb-0">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line-dark-strong bg-bg-dark font-mono text-xs tabular-nums text-primary-light transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-3 pt-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-white">{p.titulo}</h3>
                  <p className="mt-1.5 text-pretty text-sm leading-relaxed text-white/65 sm:text-base">
                    {p.descripcion}
                  </p>
                </div>
                <div className="flex-shrink-0 sm:text-right">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line-dark bg-surface-dark px-3 py-1 text-xs font-medium text-white/80">
                    <Clock className="h-3.5 w-3.5 text-primary-light" />
                    {p.tiempo}
                  </span>
                  {p.nota && <p className="mt-1.5 text-xs text-white/55">{p.nota}</p>}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
