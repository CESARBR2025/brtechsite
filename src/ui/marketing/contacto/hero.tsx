const garantias = ["Respuesta en menos de 24 h", "Asesoría sin costo", "Cotización en 48 h"]

export function ContactoHero() {
  return (
    <section className="relative overflow-hidden bg-bg-dark">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.07)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_25%_40%,black_5%,transparent_65%)]" />
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-36 sm:px-6 sm:pb-16 sm:pt-44 lg:px-8">
        <div className="max-w-3xl">
          <p
            style={{ animationDelay: "0ms" }}
            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-white/55 motion-safe:animate-aparecer"
          >
            <span className="h-px w-8 bg-primary" />
            Hablemos de tu proyecto
          </p>
          <h1
            style={{ animationDelay: "120ms" }}
            className="mt-6 text-balance text-[38px] font-bold leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl motion-safe:animate-aparecer"
          >
            Cuéntanos sobre tu negocio y{" "}
            <span className="bg-gradient-to-br from-primary-light from-30% to-primary bg-clip-text text-transparent">
              te proponemos la solución ideal
            </span>
          </h1>
          <p
            style={{ animationDelay: "240ms" }}
            className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg motion-safe:animate-aparecer"
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
