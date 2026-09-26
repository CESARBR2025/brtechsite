import { OndasGradiente } from "@/src/ui/primitivos/ondas-gradiente"

const garantias = ["Respuesta en menos de 24 h", "Asesoría sin costo", "Cotización en 48 h"]

export function ContactoHero() {
  return (
    <section className="relative overflow-hidden bg-bg-dark">
      {/* Ondas de marca; el velo lateral protege la lectura del texto (alineado a la izquierda) */}
      <div className="absolute inset-0">
        <OndasGradiente />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-bg-dark/90 via-bg-dark/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-bg-dark" />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-36 sm:px-6 sm:pb-16 sm:pt-44 lg:px-8">
        <div className="max-w-3xl">
          <p
            style={{ animationDelay: "0ms" }}
            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75 motion-safe:animate-aparecer sm:gap-4 sm:text-xs"
          >
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary-light/70 sm:w-14" aria-hidden="true" />
            Hablemos de tu proyecto
          </p>
          <h1
            style={{ animationDelay: "120ms" }}
            className="mt-6 text-balance font-hero text-[38px] font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl motion-safe:animate-aparecer"
          >
            Cuéntanos sobre tu negocio y{" "}
            <span>
              te proponemos la solución ideal
            </span>
          </h1>
          <p
            style={{ animationDelay: "240ms" }}
            className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-xl motion-safe:animate-aparecer"
          >
            Sin compromiso. Te asesoramos para encontrar la herramienta digital
            que tu restaurante o negocio necesita.
          </p>
          <ul
            style={{ animationDelay: "360ms" }}
            className="mt-8 flex flex-wrap gap-2 motion-safe:animate-aparecer"
          >
            {garantias.map((g) => (
              <li
                key={g}
                className="inline-flex items-center gap-2 rounded-full border border-line-dark-strong bg-white/5 px-3.5 py-1.5 text-xs text-white/80 sm:text-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(120,54,226,0.6)]" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
