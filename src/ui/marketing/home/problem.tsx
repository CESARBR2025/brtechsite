import Link from "next/link"
import { TrendingDown, PlugZap, Archive, ArrowRight } from "lucide-react"

const problems = [
  {
    icon: TrendingDown,
    title: "Fugas de dinero incontrolables",
    description:
      "Errores en registros, procesos manuales y falta de control provocan pérdidas que se acumulan sin que las detectes a tiempo.",
  },
  {
    icon: Archive,
    title: "Inventario sin control",
    description:
      "No sabes con precisión qué hay en stock, qué se está perdiendo o qué necesitas reabastecer hasta que ya es tarde.",
  },
  {
    icon: PlugZap,
    title: "Tu operación está desconectada",
    description:
      "Ventas, inventario y procesos administrativos no están integrados, y terminas trabajando con información incompleta o duplicada.",
  },
]

export function ProblemSection() {
  return (
    <section className="relative overflow-hidden bg-bg-section py-16 sm:py-24">
      <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-red-500/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-red-500/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-8">
        <div className="lg:pt-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-xs font-medium text-red-600">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 motion-safe:animate-pulse" />
            ¿Te identificas?
          </div>
          <h2 className="mt-4 text-balance text-[26px] font-bold tracking-tight text-text-primary sm:text-[34px]">
            Problemas que cuestan dinero todos los días
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Si algo de esto te suena, no es normal. Es margen que se está
            escapando por procesos que se pueden resolver.
          </p>
          <Link
            href="/servicios"
            className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Ver cómo lo resolvemos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="flex gap-4 p-5 transition-colors hover:bg-bg-section sm:p-6"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-red-50 text-red-500 shadow-sm">
                <problem.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-primary">
                  {problem.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
