import Link from "next/link"
import { ArrowRight } from "lucide-react"

const problems = [
  {
    title: "Fugas de dinero incontrolables",
    description:
      "Errores en registros, procesos manuales y falta de control provocan pérdidas que se acumulan sin que las detectes a tiempo.",
  },
  {
    title: "Inventario sin control",
    description:
      "No sabes con precisión qué hay en stock, qué se está perdiendo o qué necesitas reabastecer hasta que ya es tarde.",
  },
  {
    title: "Tu operación está desconectada",
    description:
      "Ventas, inventario y procesos administrativos no están integrados, y terminas trabajando con información incompleta o duplicada.",
  },
]

export function ProblemSection() {
  return (
    <section className="relative overflow-clip bg-surface py-24 sm:py-32">

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            ¿Te identificas?
          </p>
          <h2 className="mt-5 text-balance font-display text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-5xl">
            Problemas que cuestan dinero todos los días
          </h2>
          <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            Si algo de esto te suena, no es normal. Es margen que se está
            escapando por procesos que se pueden resolver.
          </p>
          <Link
            href="/servicios"
            className="group mt-8 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-primary outline-none transition-colors hover:text-primary-hover focus-visible:ring-2 focus-visible:ring-primary"
          >
            Ver cómo lo resolvemos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ol className="divide-y divide-border border-y border-border">
          {problems.map((problem, i) => (
            <li key={problem.title} className="group grid grid-cols-[auto_1fr] gap-x-6 py-8 sm:gap-x-10 sm:py-10">
              <span className="pt-1 font-mono text-sm tabular-nums text-primary/50 transition-colors group-hover:text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
                  {problem.title}
                </h3>
                <p className="mt-3 max-w-lg text-pretty text-sm leading-relaxed text-text-secondary sm:text-base">
                  {problem.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
