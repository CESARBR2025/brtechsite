import Link from "next/link"
import { ChevronRight, Sparkles } from "lucide-react"

/** CTA al final del ticket: lleva al cliente a conocer el sistema BR TECH. */
export function BloqueConoceMas() {
  return (
    <section className="no-print relative mt-8 overflow-hidden rounded-2xl bg-bg-dark px-6 py-10 text-center sm:py-12">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-lg">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-white/5 to-primary/10 px-4 py-1.5 text-xs font-medium text-text-muted shadow-lg">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Conoce más
        </div>

        <h2 className="mt-5 text-[22px] font-bold leading-tight text-white sm:text-2xl">
          Este ticket lo generó{" "}
          <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            nuestro sistema
          </span>
        </h2>
        <p className="mt-3 text-sm text-text-muted">
          En BR TECH construimos software a la medida para negocios como el tuyo:
          puntos de venta, inventarios, sitios web y automatización.
        </p>

        <Link
          href="/?ref=ticket"
          className="group mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-hover px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98]"
        >
          Ver qué hacemos
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  )
}
