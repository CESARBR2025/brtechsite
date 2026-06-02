import { Monitor, Database, Cloud, Shield, Code2, Server, Globe, Lock } from "lucide-react"

const techs = [
  {
    icon: Monitor,
    icon2: Code2,
    label: "Frontend",
    value: "NextJS",
    desc: "velocidad, SEO, moderno",
  },
  {
    icon: Database,
    icon2: Server,
    label: "Backend",
    value: "NodeJS / PostgreSQL",
    desc: "robusto, escalable",
  },
  {
    icon: Cloud,
    icon2: Globe,
    label: "Infraestructura",
    value: "AWS / Vercel",
    desc: "confiable, respaldado",
  },
  {
    icon: Shield,
    icon2: Lock,
    label: "Seguridad",
    value: "Encriptación end-to-end",
    desc: "OWASP top 10",
  },
]

export function StackSection() {
  return (
    <section className="relative overflow-hidden bg-bg-section py-16 sm:py-24">
      <div className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-xs font-medium text-primary">
            Tecnología
          </div>
          <h2 className="mt-4 text-[22px] font-bold text-text-primary sm:text-3xl">
            Tendencias Tech Actuales
          </h2>
          <p className="mt-4 text-base text-text-secondary">
            No construimos soluciones que envejecen rápido: usamos tecnología
            que sigue vigente por años.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {techs.map((tech) => (
            <div
              key={tech.label}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 text-center shadow-card transition-all hover:border-primary/30 hover:shadow-hover"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary-light/0 to-primary-light/0 transition-all group-hover:from-primary-light/10 group-hover:to-transparent" />
              <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light to-primary/10 text-primary shadow-sm transition-all group-hover:scale-110 group-hover:from-primary group-hover:to-primary-hover group-hover:text-white">
                <tech.icon className="h-7 w-7" />
              </div>
              <p className="relative mt-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                {tech.label}
              </p>
              <p className="relative mt-1 text-base font-bold text-text-primary">
                {tech.value}
              </p>
              <p className="relative mt-0.5 text-xs text-text-secondary">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
