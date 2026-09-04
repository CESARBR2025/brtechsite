import Link from "next/link"
import { ChevronRight, Calendar, MessageCircle, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-hover" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm shadow-lg">
          <Sparkles className="h-8 w-8 text-white" />
        </div>

        <h2 className="mt-6 text-[22px] font-bold text-white sm:text-3xl">
          ¿Listo para llevar tu negocio al siguiente nivel?
        </h2>
        <p className="mt-4 text-base text-primary-light">
          Permitenos conocer tu negocio desde el interior para brindarte una
          solucion en el exterior.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contacto"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl active:scale-[0.98] sm:w-auto"
          >
            <Calendar className="h-4 w-4" />
            Agendar Ahora
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/#faq"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" />
            ¿Preguntas antes? Lee nuestro FAQ
          </Link>
        </div>
      </div>
    </section>
  )
}
