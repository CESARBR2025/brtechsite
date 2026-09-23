import { Clock, MapPin } from "lucide-react"

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
  { icon: MapPin, label: "Ubicación", value: "San Juan del Río, Querétaro, MX" },
  { icon: Clock, label: "Horario", value: "Lun — Vie, 9:00 — 18:00" },
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
