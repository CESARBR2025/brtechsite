import { ClipboardCheck, DollarSign, CookingPot, BarChart3, Eye, CheckCircle, Table2, ListOrdered, TrendingUp } from "lucide-react"

const modulos = [
  {
    icon: Table2,
    title: "Gestión de mesas",
    desc: "Asigna, mueve y libera mesas con solo un par de toques. Visualiza el estado de cada mesa en tiempo real.",
  },
  {
    icon: DollarSign,
    title: "Control de caja",
    desc: "Registra cada transacción con total precisión. Cortes de caja diarios automáticos sin discrepancias.",
  },
  {
    icon: CookingPot,
    title: "Órdenes en cocina y barra",
    desc: "Las comandas llegan al instante a la cocina y a la barra de bebidas. Sin papeles, sin gritos, sin errores.",
  },
  {
    icon: ListOrdered,
    title: "Control de cuentas diarias",
    desc: "Cada cuenta se asigna automáticamente a su mesa. Sabes exactamente qué se consumió, quién atendió y cuánto se pagó.",
  },
  {
    icon: BarChart3,
    title: "Dashboard de datos diarios",
    desc: "Cortes diarios automáticos con totales por mesero, producto vendido, forma de pago y más.",
  },
  {
    icon: Eye,
    title: "Visualización operativa",
    desc: "Panel de control en vivo con todo lo que necesitas saber del restaurante en un solo vistazo.",
    sub: [
      "Mesas ocupadas y disponibles",
      "Pedidos en cola y en preparación",
      "Datos financieros del día",
    ],
  },
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
            Todo lo que tu restaurante necesita para operar sin fugas
          </p>
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
          <p className="mt-2 text-center text-sm text-gray-500">
            Seis pilares que eliminan la merma y te dan control total
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modulos.map((m) => (
              <div
                key={m.title}
                className="group rounded-xl border border-emerald-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-400 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
                  <m.icon className="h-5.5 w-5.5" />
                </div>
                <h4 className="mt-4 text-sm font-bold text-gray-900">
                  {m.title}
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                  {m.desc}
                </p>
                {m.sub && (
                  <ul className="mt-3 space-y-1.5">
                    {m.sub.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-xs text-gray-600">
                        <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
