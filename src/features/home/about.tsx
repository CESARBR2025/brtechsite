import { Briefcase, DollarSign, Heart } from "lucide-react"

const stats = [
  {
    icon: Briefcase,
    value: "Flexibilidad",
    label:
      "Desarrollo de software adaptado a la escala y realidad de cada empresa",
  },
  {
    icon: DollarSign,
    value: "- Merma",
    label:
      "Reducción de pérdidas operativas por procesos manuales",
  },
  {
    icon: Heart,
    value: "100%",
    label:
      "Soluciones diseñadas alrededor del negocio del cliente",
  },
]

export function AboutSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-xs font-medium text-primary">
            Quiénes Somos
          </div>
          <h2 className="mt-4 text-[22px] font-bold text-text-primary sm:text-3xl">
            Diseñadores de Software de Operación
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Transformamos tu idea de software en una solución real para tu
            negocio.
          </p>
          <p className="mt-2 text-base leading-relaxed text-text-secondary">
            Con enfoque en control operativo, eficiencia y escalabilidad.
          </p>
          <p className="mt-2 text-base font-medium leading-relaxed text-primary">
            No forzamos tu negocio a encajar en una herramienta: construimos la
            herramienta que encaja con tu negocio.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 text-center shadow-card transition-all hover:border-primary/30 hover:shadow-hover"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-light/50 transition-all group-hover:scale-150" />
              <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light to-primary/10 text-primary shadow-sm">
                <stat.icon className="h-7 w-7" />
              </div>
              <p className="relative mt-4 text-[28px] font-bold text-primary">
                {stat.value}
              </p>
              <p className="relative mt-1 text-sm text-text-secondary">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
