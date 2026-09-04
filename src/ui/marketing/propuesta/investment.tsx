import { Coins, Cloud, Store, CheckCircle } from "lucide-react"

export function PropInvestment() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-white py-20 sm:py-28">
      <div className="absolute -right-32 bottom-1/3 h-72 w-72 rounded-full bg-amber-100 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[26px] font-bold text-[#1A1A2E] sm:text-4xl">
            Inversión
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Coins className="h-8 w-8" />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500">
              Costo inicial
            </p>
            <p className="mt-2 text-4xl font-bold text-[#1A1A2E]">$7,000</p>
            <p className="text-sm text-gray-400">MXN</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Cloud className="h-8 w-8" />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500">
              Mensualidad
            </p>
            <p className="mt-2 text-4xl font-bold text-[#1A1A2E]">$400</p>
            <p className="text-sm text-gray-400">MXN / mes</p>
            <p className="mt-1 text-xs text-gray-400">
              Despliegue en internet + operación del sistema
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-lg">
          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#1A1A2E]">
              <Store className="h-4 w-4 text-amber-600" />
              Condiciones
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>Válido para <strong>1 restaurante</strong></span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>
                  Restaurantes adicionales:{" "}
                  <strong className="text-[#E1430E]">$1,200 MXN</strong> cada uno
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
