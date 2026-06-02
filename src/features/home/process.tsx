import { Search, PenTool, Code, Rocket, LifeBuoy } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Entendimiento",
    description: "Nos metemos en tu negocio para entender cómo realmente operas",
  },
  {
    icon: PenTool,
    title: "Diseño de la solución",
    description: "Traducimos tu operación en un sistema claro y funcional",
  },
  {
    icon: Code,
    title: "Construcción",
    description: "Desarrollamos el software con entregas constantes y validación contigo",
  },
  {
    icon: Rocket,
    title: "Puesta en marcha",
    description: "Implementamos el sistema y lo adaptamos a tu operación real",
  },
  {
    icon: LifeBuoy,
    title: "Acompañamiento",
    description: "Te apoyamos en la evolución y mejora continua del sistema",
  },
]

export function ProcessSection() {
  return (
    <section className="relative overflow-hidden bg-bg-section py-16 sm:py-24">
      <div className="absolute left-1/3 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-xs font-medium text-primary">
            Nuestro Método
          </div>
          <h2 className="mt-4 text-[22px] font-bold text-text-primary sm:text-3xl">
            Tu problema + tu visión = una solución hecha a la medida de tu
            negocio
          </h2>
        </div>
        <div className="relative mt-14">
          <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/5 md:block" />
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={step.title} className="relative flex items-start gap-6">
                <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover shadow-lg shadow-primary/20">
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <div className="min-w-0 flex-1 rounded-2xl border border-border bg-surface p-6 shadow-card transition-all hover:border-primary/20 hover:shadow-hover">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Paso {i + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
