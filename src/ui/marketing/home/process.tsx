import { Search, PenTool, Code, Rocket, LifeBuoy } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Entendimiento",
    description: "Nos metemos en tu negocio para entender cómo realmente operas.",
  },
  {
    icon: PenTool,
    title: "Diseño de la solución",
    description: "Traducimos tu operación en un sistema claro y funcional.",
  },
  {
    icon: Code,
    title: "Construcción",
    description: "Desarrollamos el software con entregas constantes y validación contigo.",
  },
  {
    icon: Rocket,
    title: "Puesta en marcha",
    description: "Implementamos el sistema y lo adaptamos a tu operación real.",
  },
  {
    icon: LifeBuoy,
    title: "Acompañamiento",
    description: "Te apoyamos en la evolución y mejora continua del sistema.",
  },
]

export function ProcessSection() {
  return (
    <section className="relative overflow-hidden bg-bg-section py-24 sm:py-32">

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Nuestro método
          </p>
          <h2 className="mt-5 text-balance font-display text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-5xl">
            Así construimos tu sistema
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            Tu problema y tu visión, convertidos en una solución hecha a la
            medida de tu negocio.
          </p>
        </div>

        <ol className="relative mt-16 grid gap-10 lg:grid-cols-5 lg:gap-6">
          {/* Línea que une los pasos: vertical en móvil, horizontal en escritorio */}
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-6 top-6 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent lg:bottom-auto lg:left-6 lg:right-0 lg:top-6 lg:h-px lg:w-auto lg:bg-gradient-to-r"
          />
          {steps.map((step, i) => (
            <li key={step.title} className="group relative grid grid-cols-[3rem_1fr] gap-x-5 lg:block">
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-sm transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                <step.icon className="h-5 w-5" />
              </span>
              <div className="lg:mt-6">
                <span className="font-mono text-xs tabular-nums text-primary/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
