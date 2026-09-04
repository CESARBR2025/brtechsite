import { Smartphone, BarChart3, Table2, Eye } from "lucide-react"

const activities = [
  { icon: Smartphone, desc: "Abrir el sistema desde el celular" },
  { icon: BarChart3, desc: "Ver caja en tiempo real" },
  { icon: Table2, desc: "Ver mesas ocupadas" },
  { icon: Eye, desc: "Saber exactamente cómo va tu restaurante" },
]

export function PropLifeWith() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,67,14,0.08)_0%,transparent_60%)]" />
      <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[#E1430E]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[26px] font-bold text-white sm:text-4xl">
            Así cambia tu día a día
          </h2>
          <p className="mt-3 text-lg text-gray-400">
            En lugar de preocuparte por errores o dinero perdido…
          </p>
          <p className="mt-1 text-xl font-semibold text-[#FF6B35]">
            puedes estar en tu casa, tranquilo, viendo el partido:
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((a) => (
            <div
              key={a.desc}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all hover:border-[#E1430E]/30 hover:bg-white/10"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E1430E]/20 text-[#E1430E]">
                <a.icon className="h-7 w-7" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-300">
                {a.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-[#E1430E]/10 p-6 text-center backdrop-blur-sm">
            <p className="text-xl font-bold text-white">
              Tu restaurante sigue trabajando…
            </p>
            <p className="mt-1 text-xl font-bold text-[#FF6B35]">
              aunque tú no estés ahí.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
