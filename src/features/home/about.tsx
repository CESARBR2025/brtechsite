import { Briefcase, DollarSign, Heart } from "lucide-react"

const stats = [
  { icon: Briefcase, value: "Flexibilidad", label: "Desarrollo de software adaptado a la escala y realidad de cada empresa" },
  { icon: DollarSign, value: "- Merma", label: "Reducción de pérdidas operativas por procesos manuales" },

  { icon: Heart, value: "100%", label: "Soluciones diseñadas alrededor del negocio del cliente" },
]

export function AboutSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Quiénes Somos
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-text-primary sm:text-3xl">
            Diseñadores de Sofware de Operación
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Transformamos tu idea de software en una solución real para tu negocio.

            Con enfoque en control operativo, eficiencia y escalabilidad.

            No forzamos tu negocio a encajar en una herramienta: construimos la herramienta que encaja con tu negocio.


          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-surface p-6 text-center shadow-card transition-all hover:border-primary/30 hover:shadow-hover"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-[28px] font-bold text-primary">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
