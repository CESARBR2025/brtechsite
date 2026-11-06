import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { SuperficieReactiva } from "./recibo/superficie-reactiva"

/** CTA al final del ticket: lleva al cliente a conocer el sistema BR TECH. */
export function BloqueConoceMas() {
  return (
    <SuperficieReactiva tipo="cuadricula" className="no-print relative mt-8 overflow-hidden rounded-2xl bg-bg-dark px-6 py-10 text-center sm:py-12">
      <div aria-hidden="true" className="exp-cuadricula pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.07)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-lg">
        <div className="inline-flex items-center gap-2 rounded-full border border-line-dark bg-surface-dark px-4 py-1.5 text-xs font-medium text-primary-light">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Conoce más
        </div>

        <h2 className="mt-5 font-hero text-[22px] font-semibold leading-tight text-white sm:text-2xl">
          Esta nota la generó nuestro sistema
        </h2>
        <p className="mt-3 text-sm text-white/65">
          En BR TECH construimos software a la medida para negocios como el tuyo:
          puntos de venta, inventarios, sitios web y automatización.
        </p>

        <Link
          href="/?ref=ticket"
          className="group mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 motion-safe:transition-all hover:shadow-lg hover:shadow-primary/40 motion-safe:active:scale-[0.98]"
        >
          Ver qué hacemos
          <ArrowRight className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
        </Link>
      </div>
    </SuperficieReactiva>
  )
}
