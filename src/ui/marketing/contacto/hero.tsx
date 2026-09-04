import { MessageCircle, Clock, BadgeCheck, Zap } from "lucide-react"

export function ContactoHero() {
  return (
    <section className="relative overflow-hidden bg-bg-dark">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.07)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-text-muted">
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
            Hablemos de tu proyecto
          </div>
          <h1 className="mt-6 text-[28px] font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Cuéntanos sobre tu negocio y{" "}
            <span className="text-primary">te proponemos la solución ideal</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base text-text-muted sm:text-lg">
            Sin compromiso. Te asesoramos para encontrar la herramienta digital
            que tu restaurante o negocio necesita.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Respuesta en menos de 24 h
            </div>
            <div className="flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5 text-success" />
              Asesoría sin costo
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-warning" />
              Cotización en 48 h
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
