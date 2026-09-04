import { Users, Coffee, Receipt, Store, Ban as Banknote } from "lucide-react"

const fugas = [
  {
    icon: Users,
    title: "Errores humanos al tomar comandas",
    desc: "Pedidos mal anotados que nunca llegan a cocina o llegan incompletos.",
  },
  {
    icon: Coffee,
    title: "Productos que se regalan",
    desc: "Consumos internos, cortesías y errores que nadie registra y se convierten en pérdida.",
  },
  {
    icon: Receipt,
    title: "Meseros olvidan capturar pedidos",
    desc: "Se atiende al cliente pero el pedido nunca entra al sistema de cobro.",
  },
  {
    icon: Banknote,
    title: "Cierres de caja sin claridad",
    desc: "No sabes exactamente cuánto se vendió vs cuánto debería haber en caja.",
  },
]

export function PropProblem() {
  return (
    <section id="problema" className="relative overflow-hidden bg-gradient-to-b from-white to-red-50 py-20 sm:py-28">
      <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-red-100 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-red-100 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-xs font-semibold text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            El problema real
          </div>
          <h2 className="mt-4 text-[26px] font-bold text-[#1A1A2E] sm:text-4xl">
            Lo que está pasando hoy en tu restaurante
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            El problema no es vender más.
          </p>
          <p className="mt-1 text-xl font-bold text-red-600">
            El problema es que se está perdiendo dinero sin darse cuenta.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fugas.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition-all hover:border-red-200 hover:shadow-lg"
            >
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-red-50 transition-all group-hover:scale-150" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="relative mt-4 text-sm font-bold text-[#1A1A2E]">
                {f.title}
              </h3>
              <p className="relative mt-1.5 text-sm leading-relaxed text-gray-500">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
            <p className="text-lg font-semibold italic text-gray-700">
              &ldquo;Cada error parece pequeño…
            </p>
            <p className="text-lg font-bold italic text-red-600">
              hasta que lo sumas al final del mes.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
