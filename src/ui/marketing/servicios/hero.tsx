import Image from "next/image"
import { OndasGradiente } from "@/src/ui/primitivos/ondas-gradiente"
import { ArrowDown } from "lucide-react"
import { servicios } from "@/src/ui/marketing/servicios/datos"

export function ServiciosHero() {
  return (
    <section className="relative overflow-hidden bg-bg-dark">
      {/* Ondas de marca; el velo lateral protege la lectura del texto (alineado a la izquierda) */}
      <div className="absolute inset-0">
        <OndasGradiente />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-bg-dark/90 via-bg-dark/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-bg-dark" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 sm:pb-28 sm:pt-44 lg:px-8">
        <div className="max-w-3xl">
          <p
            style={{ animationDelay: "0ms" }}
            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75 motion-safe:animate-aparecer sm:gap-4 sm:text-xs"
          >
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary-light/70 sm:w-14" aria-hidden="true" />
            Servicios
          </p>
          <h1
            style={{ animationDelay: "120ms" }}
            className="mt-6 text-balance font-hero text-[38px] font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl motion-safe:animate-aparecer"
          >
            Soluciones hechas a la medida de tu operación
          </h1>
          <p
            style={{ animationDelay: "240ms" }}
            className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-xl motion-safe:animate-aparecer"
          >
            Software para restaurantes, control de inventarios y presencia digital,
            diseñados alrededor de cómo trabaja tu negocio, no al revés.
          </p>
        </div>

        {/* Índice: una tarjeta con foto por servicio, salta a su sección */}
        <nav
          aria-label="Servicios en esta página"
          style={{ animationDelay: "360ms" }}
          className="mt-14 grid gap-4 motion-safe:animate-aparecer sm:grid-cols-3"
        >
          {servicios.map((s) => (
            <a
              key={s.ancla}
              href={`#${s.ancla}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] outline-none backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="relative block aspect-[3/1] overflow-hidden sm:aspect-[16/9]">
                <Image
                  src={s.foto.src}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 400px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg-deep/70 to-transparent" />
              </span>
              <span className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <s.icono className="h-4 w-4 text-primary-light" aria-hidden="true" />
                </span>
                <span className="flex-1 text-sm font-semibold text-white">{s.pestana}</span>
                <ArrowDown className="h-4 w-4 text-white/60 transition-transform group-hover:translate-y-0.5 group-hover:text-white" aria-hidden="true" />
              </span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
