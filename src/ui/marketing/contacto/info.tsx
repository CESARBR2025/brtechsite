import { ArrowUpRight, Clock, MapPin } from "lucide-react"
import { EMPRESA, WHATSAPP } from "@/src/ui/marketing/datos-contacto"

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
  { icon: MapPin, label: "Ubicación", value: `${EMPRESA.ciudad}, ${EMPRESA.estado}, ${EMPRESA.pais}` },
  { icon: Clock, label: "Horario", value: EMPRESA.horario },
]

export function ContactInfo() {
  return (
    <div className="space-y-10 lg:pt-4">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/55">
          Qué pasa después
        </h2>
        <ol className="relative mt-6">
          <span
            aria-hidden="true"
            className="absolute bottom-5 left-4 top-5 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent"
          />
          {siguientesPasos.map((p, i) => (
            <li key={p.titulo} className="relative grid grid-cols-[2rem_1fr] gap-x-4 pb-7 last:pb-0">
              <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line-dark-strong bg-bg-dark font-mono text-xs tabular-nums text-primary-light">
                {i + 1}
              </span>
              <div className="pt-1">
                <h3 className="text-base font-semibold text-white">{p.titulo}</h3>
                <p className="mt-1 text-pretty text-sm leading-relaxed text-white/65">
                  {p.descripcion}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <dl className="divide-y divide-line-dark border-y border-line-dark">
        {/* WhatsApp: la vía más rápida; el enlace cubre toda la fila */}
        <div className="group relative flex items-center gap-4 py-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-line-dark bg-surface-dark text-primary-light transition-colors group-hover:border-line-dark-strong group-hover:bg-surface-dark-hover">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d={WHATSAPP.path} />
            </svg>
          </span>
          <div className="flex-1">
            <dt className="text-xs text-white/55">WhatsApp</dt>
            <dd className="text-sm font-medium text-white">
              <a
                href={WHATSAPP.url}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-primary"
              >
                {WHATSAPP.visible}
              </a>
            </dd>
          </div>
          <ArrowUpRight className="h-4 w-4 text-white/55 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
        </div>
        {datos.map((d) => (
          <div key={d.label} className="flex items-center gap-4 py-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-line-dark bg-surface-dark text-primary-light">
              <d.icon className="h-5 w-5" />
            </span>
            <div>
              <dt className="text-xs text-white/55">{d.label}</dt>
              <dd className="text-sm font-medium text-white">{d.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}
