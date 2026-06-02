import { Smartphone, ClipboardCheck, CookingPot, Banknote, Eye, CheckCircle } from "lucide-react"

const modulos = [
  { icon: Smartphone, label: "Captura digital de pedidos" },
  { icon: ClipboardCheck, label: "Gestión de mesas" },
  { icon: CookingPot, label: "Pantalla de cocina en tiempo real" },
  { icon: Banknote, label: "Control de caja diaria" },
  { icon: Eye, label: "Visibilidad de ocupación del restaurante" },
]

const beneficios = [
  "Todo pedido sea digital",
  "Nada salga si no está registrado",
  "Cocina reciba órdenes en tiempo real",
  "Caja tenga control exacto del dinero",
  "Tú tengas visibilidad total del negocio",
]

export function PropSolution() {
  return (
    <section id="solucion" className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white py-20 sm:py-28">
      <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-emerald-100 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle className="h-3.5 w-3.5" />
            La solución
          </div>
          <h2 className="mt-4 text-[26px] font-bold text-[#1A1A2E] sm:text-4xl">
            Parrilla Norteña Soft
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Un sistema diseñado para que:
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {beneficios.slice(0, 3).map((b) => (
            <div
              key={b}
              className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-sm"
            >
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <span className="text-sm text-gray-700">{b}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {beneficios.slice(3).map((b) => (
            <div
              key={b}
              className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-sm"
            >
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <span className="text-sm text-gray-700">{b}</span>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          <div className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-100 to-emerald-50 p-6 text-center shadow-md">
            <p className="text-lg font-bold italic text-emerald-900">
              &ldquo;Si no está en el sistema, no existe.&rdquo;
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-center text-lg font-bold text-[#1A1A2E]">
            Módulos principales
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {modulos.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-emerald-200 bg-white p-5 text-center shadow-sm transition-all hover:border-emerald-400 hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <m.icon className="h-6 w-6" />
                </div>
                <p className="mt-3 text-xs font-medium text-gray-700">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
