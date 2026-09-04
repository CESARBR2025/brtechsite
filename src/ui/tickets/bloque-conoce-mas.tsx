import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

/** CTA al final del ticket: lleva al cliente a conocer el sistema BR TECH. */
export function BloqueConoceMas() {
  return (
    <section className="no-print relative mt-10 overflow-hidden rounded-2xl bg-bg-dark px-6 py-10 text-center">
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-lg">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-text-muted">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Conoce más
        </div>
        <h2 className="mt-4 text-[22px] font-bold text-white sm:text-2xl">
          Este ticket lo generó nuestro sistema
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          En BR TECH construimos software a la medida para negocios como el tuyo:
          POS, inventarios, sitios web y automatización. Mira lo que hacemos.
        </p>
        <Link
          href="/?ref=ticket"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-hover px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl active:scale-[0.98]"
        >
          Ver qué hacemos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
