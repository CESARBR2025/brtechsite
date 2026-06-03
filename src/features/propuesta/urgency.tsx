import { AlertTriangle, Server, Wrench, Users } from "lucide-react"

const reasons = [
  { icon: Server, label: "Costos de alojamiento del sistema" },
  { icon: Wrench, label: "Mantenimiento de infraestructura" },
  { icon: Users, label: "Capacidad de implementación limitada" },
]

export function PropUrgency() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-yellow-50 to-white py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(234,179,8,0.06)_0%,transparent_50%)]" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-[26px] font-bold text-[#1A1A2E] sm:text-4xl">
            Disponibilidad limitada
          </h2>
          <p className="mt-4 text-lg font-semibold text-yellow-700">
            Esta propuesta tiene vigencia hasta el{" "}
            <span className="text-[#E1430E]">15 Junio del 2026</span>
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-yellow-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-700">Motivo:</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {reasons.map((r) => (
              <div
                key={r.label}
                className="flex items-center gap-3 rounded-lg bg-yellow-50 px-4 py-3"
              >
                <r.icon className="h-5 w-5 shrink-0 text-yellow-600" />
                <span className="text-sm text-gray-600">{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
