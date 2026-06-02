import Link from "next/link"
import { ChevronRight, Calendar, MessageCircle } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-primary py-16 sm:py-24">
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          <Calendar className="h-7 w-7 text-white" />
        </div>

        <h2 className="mt-6 text-[22px] font-bold text-white sm:text-3xl">
          ¿Listo para llevar tu negocio al siguiente nivel?
        </h2>
        <p className="mt-4 text-base text-primary-light">
          Permitenos conocer tu negocio desde el interior para brindarte una solucion en el exterior.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contacto"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl sm:w-auto"
          >
            <Calendar className="h-4 w-4" />
            Agendar Ahora
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/#faq"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" />
            ¿Preguntas antes? Lee nuestro FAQ
          </Link>
        </div>
      </div>
    </section>
  )
}
