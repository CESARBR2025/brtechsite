import { X, Check } from "lucide-react"

const rows = [
  { concepto: "Merma", sin: "Alta", con: "Reducida hasta 80%", conColor: true },
  { concepto: "Control de pedidos", sin: "Manual", con: "Digital", conColor: true },
  { concepto: "Caja", sin: "Inexacta", con: "Precisa", conColor: true },
  { concepto: "Visibilidad", sin: "Nula", con: "Total en tiempo real", conColor: true },
  { concepto: "Decisiones", sin: "Intuición", con: "Datos reales", conColor: true },
]

export function PropComparison() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white py-20 sm:py-28">
      <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-purple-100 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[26px] font-bold text-[#1A1A2E] sm:text-4xl">
            Sin sistema vs Parrilla Norteña Soft
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-lg">
          <div className="grid grid-cols-3 gap-px bg-purple-200">
            <div className="bg-purple-100 p-4">
              <p className="text-xs font-bold uppercase text-purple-800">
                Concepto
              </p>
            </div>
            <div className="bg-red-50 p-4 text-center">
              <p className="text-xs font-bold uppercase text-red-600">
                Sin sistema
              </p>
            </div>
            <div className="bg-emerald-50 p-4 text-center">
              <p className="text-xs font-bold uppercase text-emerald-600">
                Con sistema
              </p>
            </div>
          </div>
          <div className="divide-y divide-purple-100">
            {rows.map((r) => (
              <div key={r.concepto} className="grid grid-cols-3">
                <div className="flex items-center p-4">
                  <p className="text-sm font-medium text-gray-700">
                    {r.concepto}
                  </p>
                </div>
                <div className="flex items-center justify-center bg-red-50/50 p-4">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                    <X className="h-4 w-4" />
                    {r.sin}
                  </span>
                </div>
                <div className="flex items-center justify-center bg-emerald-50/50 p-4">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                    <Check className="h-4 w-4" />
                    {r.con}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
