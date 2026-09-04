import Link from "next/link"
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from "lucide-react"

export function PropCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E1430E] to-[#C93A0C] py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-[26px] font-bold text-white sm:text-4xl">
          ¿Listo para tomar el control de tu restaurante?
        </h2>
        <p className="mt-4 text-lg text-orange-100">
          El sistema que elimina pérdidas y te da visibilidad total de tu
          negocio.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link
            href="/contacto"
            className="group flex flex-col items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-xl"
          >
            <CheckCircle className="h-8 w-8 text-emerald-300" />
            <span className="text-sm font-bold">Aceptar propuesta</span>
            <span className="flex items-center gap-1 text-xs text-orange-200 group-hover:underline">
              Quiero empezar
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/60 backdrop-blur-sm">
            <XCircle className="h-8 w-8" />
            <span className="text-sm font-bold">Rechazar propuesta</span>
            <span className="text-xs">No por ahora</span>
          </div>
          <Link
            href="/contacto"
            className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
          >
            <HelpCircle className="h-8 w-8" />
            <span className="text-sm font-bold">Tengo dudas</span>
            <span className="flex items-center gap-1 text-xs text-orange-200 group-hover:underline">
              Quiero saber más
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        <p className="mt-8 text-xs text-orange-200">
          Esta propuesta tiene vigencia de 15 dias - 15 Junio del 2026. Después de ese tiempo,
          los precios y condiciones pueden cambiar.
        </p>
      </div>
    </section>
  )
}
