import { FileText, Eraser, RefreshCw, SearchX } from "lucide-react"

const costs = [
  {
    icon: FileText,
    label: "Comandas de papel",
    value: "~$30 MXN por bloque mensual",
  },
  {
    icon: Eraser,
    label: "Errores de anotación",
    value: "Pedidos perdidos o incorrectos",
  },
  {
    icon: RefreshCw,
    label: "Re-trabajo en cocina",
    value: "Platos que se preparan dos veces",
  },
  {
    icon: SearchX,
    label: "Falta de trazabilidad",
    value: "Ventas no registradas",
  },
]

const comparacion = [
  { concepto: "Control de pedidos", actual: "Manual" },
  { concepto: "Registro de ventas", actual: "Papel" },
  { concepto: "Caja diaria", actual: "Inexacta" },
  { concepto: "Visibilidad del negocio", actual: "Limitada" },
]

export function PropHiddenCosts() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-50 to-white py-20 sm:py-28">
      <div className="absolute -right-32 bottom-1/3 h-72 w-72 rounded-full bg-red-100 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[26px] font-bold text-[#1A1A2E] sm:text-4xl">
            No solo es la merma…
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            También existen costos invisibles que nadie calcula.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {costs.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-red-100 bg-white p-5 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <c.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#1A1A2E]">
                {c.label}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-lg">
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <h3 className="text-center text-sm font-bold text-[#1A1A2E]">
              Tu situación actual
            </h3>
            <div className="mt-4 space-y-2">
              {comparacion.map((c) => (
                <div
                  key={c.concepto}
                  className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-2.5"
                >
                  <span className="text-sm text-gray-700">{c.concepto}</span>
                  <span className="rounded-md bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-600">
                    {c.actual}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
