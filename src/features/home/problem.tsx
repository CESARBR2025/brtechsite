import Link from "next/link"
import { TrendingDown, Clock, PlugZap, ArrowRight, Archive } from "lucide-react"

const problems = [
  {
    icon: TrendingDown,
    title: "Tu negocio pierde dinero sin que lo notes",
    description:
      "Cada error administrativo, retraso operativo o proceso manual representa dinero que se escapa silenciosamente de tu empresa.",
    cta: "Ver cómo solucionarlo",
    href: "/servicios",
  }
  ,
  {
    icon: Archive,
    title: "Inventarios desactualizados",
    description:
      "Sin información en tiempo real es imposible saber qué comprar, vender o reabastecer en el momento correcto.",
    cta: "Digitalizar inventario",
    href: "/servicios",
  },
  {
    icon: PlugZap,
    title: "Tus sistemas no conversan entre sí",
    description:
      "Información duplicada, actualizaciones manuales, reportes tardíos. Decisiones basadas en datos obsoletos.",
    cta: "Descubrir integración",
    href: "/servicios",
  },
]

export function ProblemSection() {
  return (
    <section className="bg-bg-section py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            ¿Te identificas?
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-text-primary sm:text-3xl">
            ¿Tu Empresa Enfrenta Estos Retos?
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="group relative rounded-xl border border-border bg-surface p-6 shadow-card transition-all hover:border-primary/30 hover:shadow-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                <problem.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-text-primary">
                {problem.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                {problem.description}
              </p>
              <Link
                href={problem.href}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
              >
                {problem.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
