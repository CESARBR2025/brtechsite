import { CalendarDays, Clock, DollarSign, CheckCircle, ArrowRight } from "lucide-react"

const semanas = [
  {
    semana: "Semana 1",
    title: "Entendimiento del problema y arranque de proyecto",
    horas: 15,
    overflow: "Semana 2",
    color: "border-sky-200 bg-sky-50",
    badge: "bg-sky-100 text-sky-700",
  },
  {
    semana: "Semana 2 - Revisión",
    title: "Sistema de captura de órdenes (mesero)",
    horas: 40,
    overflow: "Semana 3",
    color: "border-indigo-200 bg-indigo-50",
    badge: "bg-indigo-100 text-indigo-700",
  },
  {
    semana: "Semana 3",
    title: "Envío de órdenes a cocina  y barra+ visualización",
    horas: 15,
    overflow: "Semana 4",
    color: "border-purple-200 bg-purple-50",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    semana: "Semana 4 - Revisión",
    title: "Sistema de caja + Impresión térmica",
    horas: 20,
    overflow: "Semana 5",
    color: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    semana: "Semana 5",
    title: "Generación de Dashboards KPIs finanzas",
    horas: 20,
    overflow: "Semana 6",
    color: "border-amber-200 bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    semana: "Semana 6 - Entrega",
    title: "Capacitación de sistema + Despliegue Online",
    horas: 8,
    overflow: 'Entrega y Cierre',
    color: "border-rose-200 bg-rose-50",
    badge: "bg-rose-100 text-rose-700",
  },
]

const pagos = [
  {
    etapa: "Semana 1",
    monto: 2000,
    label: "Etapa 1",
  },
  {
    etapa: "Semana 4",
    monto: 2000,
    label: "Etapa 2",
  },
  {
    etapa: "Semana 6",
    monto: 3000,
    label: "Etapa 3",
  },
]

export function PropTimeline() {
  return (
    <section id="timeline" className="relative overflow-hidden bg-gradient-to-b from-[#1A1A2E] to-[#16213E] py-20 sm:py-28">
      <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -right-32 bottom-1/3 h-72 w-72 rounded-full bg-[#E1430E]/5 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-sm">
            <CalendarDays className="h-3.5 w-3.5" />
            Tiempo estimado
          </div>
          <h2 className="mt-4 text-[26px] font-bold text-white sm:text-4xl">
            4 a 6 semanas
          </h2>
          <p className="mt-3 text-lg text-gray-400">
            Desarrollo ágil con entregas quincenales y revisiones de avance vía virtual
          </p>
        </div>

        {/* Timeline cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {semanas.map((s) => (
            <div
              key={s.semana}
              className={`rounded-xl border ${s.color} p-5 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${s.badge}`}>
                  {s.semana}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                  <Clock className="h-3 w-3" />
                  {s.horas}h
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-900">
                {s.title}
              </p>
              {s.overflow && (
                <p className="mt-1.5 text-[11px] text-gray-400">
                  Overflow a {s.overflow}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Payment schedule */}
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="flex items-center justify-center gap-2 text-center">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              Plan de pagos
            </h3>
          </div>
          <p className="mt-1 text-center text-sm text-gray-400">
            3 etapas — pagas conforme avanza el proyecto
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {pagos.map((p, i) => (
              <div
                key={p.etapa}
                className="rounded-xl border border-emerald-900/30 bg-emerald-950/30 p-5 text-center backdrop-blur-sm"
              >
                <div className="flex items-center justify-center gap-1.5">
                  {i > 0 && (
                    <ArrowRight className="hidden h-4 w-4 text-emerald-600 sm:block" />
                  )}
                  <span className="rounded-md bg-emerald-900/50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                    {p.etapa}
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-emerald-400">
                  ${p.monto.toLocaleString("es-MX")} MXN
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {p.label}
                </p>

              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mx-auto mt-6 max-w-md rounded-xl border border-emerald-800/40 bg-emerald-900/20 p-4 text-center backdrop-blur-sm">
            <p className="text-xs font-medium text-gray-400">Total</p>
            <p className="text-xl font-bold text-emerald-400">
              $7,000 MXN
            </p>
          </div>
        </div>

        {/* Review note */}
        <div className="mx-auto mt-10 max-w-2xl text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <CheckCircle className="mx-auto h-5 w-5 text-emerald-400" />
            <p className="mt-2 text-sm font-medium text-gray-300">
              Revisiones de avance cada semana o quincena vía virtual
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Siempre sabrás en qué etapa está tu proyecto
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
