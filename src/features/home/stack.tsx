import { Monitor, Database, Cloud, Shield } from "lucide-react"

const techs = [
  { icon: Monitor, label: "Frontend", value: "NextJS", desc: "velocidad, SEO, moderno" },
  { icon: Database, label: "Backend", value: "NodeJS / PostgreSQL", desc: "robusto, escalable" },
  { icon: Cloud, label: "Infraestructura", value: "AWS / Vercel", desc: "confiable, respaldado" },
  { icon: Shield, label: "Seguridad", value: "Encriptación end-to-end", desc: "OWASP top 10" },
]

export function StackSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Tecnología
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-text-primary sm:text-3xl">
            Tendencias Tech Actuales
          </h2>
          <p className="mt-4 text-base text-text-secondary">
            No construimos soluciones que envejecen rápido: usamos tecnología que sigue vigente por años.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {techs.map((tech) => (
            <div
              key={tech.label}
              className="group rounded-xl border border-border bg-surface p-6 text-center shadow-card transition-all hover:border-primary/30 hover:shadow-hover"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <tech.icon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                {tech.label}
              </p>
              <p className="mt-1 text-base font-semibold text-text-primary">
                {tech.value}
              </p>
              <p className="mt-0.5 text-xs text-text-secondary">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
