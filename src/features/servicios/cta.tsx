import Link from "next/link"
import { Calendar, ChevronRight, MessageCircle, Sparkles } from "lucide-react"

export function ServiciosCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-bg-dark via-bg-dark to-primary/20 py-16 sm:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute left-1/3 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>

        <h2 className="mt-6 text-[22px] font-bold text-white sm:text-3xl">
          ¿No sabes cuál elegir?
        </h2>
        <p className="mt-4 text-base text-text-muted">
          Te asesoramos sin costo. En 30 minutos identificamos qué necesita tu
          negocio y te damos una cotización clara.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contacto"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl sm:w-auto"
          >
            <Calendar className="h-4 w-4" />
            Agendar Asesoría Gratis
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/#faq"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-text-muted transition-colors hover:bg-white/10 hover:text-white sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" />
            Ver FAQ
          </Link>
        </div>
      </div>
    </section>
  )
}
