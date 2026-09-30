import { ArrowUpRight, Clock, MapPin } from "lucide-react"
import { EMPRESA, WHATSAPP } from "@/src/ui/marketing/datos-contacto"
import { evento } from "@/src/ui/analitica"

/*
 * Panel oscuro de la tarjeta de contacto: WhatsApp como vía rápida (el canal
 * que más usan nuestros clientes), qué pasa después de escribir y los datos.
 */

const siguientesPasos = [
  {
    titulo: "Leemos tu mensaje",
    descripcion: "Te respondemos en menos de 24 horas para entender tu necesidad.",
  },
  {
    titulo: "Diagnóstico sin costo",
    descripcion: "Revisamos contigo cómo opera tu negocio y qué conviene resolver primero.",
  },
  {
    titulo: "Recibes tu propuesta",
    descripcion: "En 48 horas tienes una propuesta personalizada, sin contrato ni compromiso.",
  },
]

const datos = [
  { icon: MapPin, label: "Ubicación", value: `${EMPRESA.ciudad}, ${EMPRESA.estado}` },
  { icon: Clock, label: "Horario", value: EMPRESA.horario },
]

export function ContactInfo() {
  return (
    <div className="relative isolate flex h-full flex-col gap-10 overflow-hidden bg-bg-deep p-6 sm:p-10">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(120,54,226,0.45),transparent_65%)] blur-2xl"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* WhatsApp: la vía más rápida */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-light">¿Prefieres WhatsApp?</p>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-white/65">
          Es la forma más rápida de platicar. Te contestamos en horario laboral.
        </p>
        <a
          href={WHATSAPP.url}
          target="_blank"
          rel="noopener noreferrer"
          {...evento("whatsapp", { origen: "contacto" })}
          className="group mt-5 flex items-center gap-4 rounded-2xl bg-success px-5 py-4 text-white shadow-lg shadow-success/25 outline-none transition-all hover:brightness-110 focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep active:scale-[0.99]"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 fill-current" aria-hidden="true">
            <path d={WHATSAPP.path} />
          </svg>
          <span className="flex-1">
            <span className="block text-sm font-semibold">Escríbenos por WhatsApp</span>
            <span className="block text-xs text-white/80">{WHATSAPP.visible}</span>
          </span>
          <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      <div className="border-t border-line-dark pt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">Qué pasa después</h2>
        <ol className="relative mt-6">
          <span
            aria-hidden="true"
            className="absolute bottom-5 left-4 top-5 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent"
          />
          {siguientesPasos.map((p, i) => (
            <li key={p.titulo} className="relative grid grid-cols-[2rem_1fr] gap-x-4 pb-6 last:pb-0">
              <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line-dark-strong bg-bg-deep font-mono text-xs tabular-nums text-primary-light">
                {i + 1}
              </span>
              <div className="pt-1">
                <h3 className="text-sm font-semibold text-white">{p.titulo}</h3>
                <p className="mt-1 text-pretty text-sm leading-relaxed text-white/60">{p.descripcion}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <dl className="mt-auto grid gap-4 border-t border-line-dark pt-8">
        {datos.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line-dark bg-surface-dark text-primary-light">
              <d.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-xs text-white/50">{d.label}</dt>
              <dd className="text-sm font-medium text-white">{d.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}
