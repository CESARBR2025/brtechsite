"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { WHATSAPP } from "@/src/ui/marketing/datos-contacto"
import { servicios as frentes } from "@/src/ui/marketing/servicios/datos"
import { FotoServicio } from "@/src/ui/marketing/servicios/foto-servicio"
import { evento } from "@/src/ui/analitica"

/*
 * Escaparate de servicios con pestañas: un frente a la vez, en grande, con
 * su foto y "Ideal para" para mostrar que nos adaptamos a distintos giros sin
 * encasillarnos en uno. Los datos salen de `servicios/datos.ts` (los comparte
 * con /servicios).
 */

export function ServicesSection() {
  const [activo, setActivo] = useState(0)
  const pestanas = useRef<(HTMLButtonElement | null)[]>([])
  const f = frentes[activo]

  // Flechas izquierda/derecha entre pestañas (patrón de tabs accesible)
  function alTeclado(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const siguiente = (activo + (e.key === "ArrowRight" ? 1 : frentes.length - 1)) % frentes.length
    setActivo(siguiente)
    pestanas.current[siguiente]?.focus()
  }

  const enlaceMedida = `https://wa.me/${WHATSAPP.telefono.replace("+", "")}?text=${encodeURIComponent(
    "Hola, vi su sitio. Mi operación es distinta y me gustaría platicar un sistema a la medida.",
  )}`

  return (
    <section className="relative bg-bg-section py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Servicios
            <span className="h-px w-8 bg-primary" />
          </p>
          <h2 className="mt-5 text-balance font-display text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-5xl">
            Lo que construimos para tu negocio
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            No forzamos tu negocio a encajar en una herramienta: construimos la herramienta que encaja
            con tu negocio.
          </p>
        </div>

        {/* Pestañas (se deslizan de lado en celular) */}
        <div className="mt-12 flex justify-center">
          <div
            role="tablist"
            aria-label="Servicios"
            onKeyDown={alTeclado}
            className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-surface p-1.5 shadow-card [scrollbar-width:none]"
          >
            {frentes.map((x, i) => {
              const actual = i === activo
              return (
                <button
                  key={x.id}
                  ref={(el) => {
                    pestanas.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`servicio-tab-${x.id}`}
                  aria-selected={actual}
                  aria-controls={`servicio-panel-${x.id}`}
                  tabIndex={actual ? 0 : -1}
                  onClick={() => setActivo(i)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary sm:px-5 ${
                    actual
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "text-text-secondary hover:bg-bg-section hover:text-text-primary"
                  }`}
                >
                  <x.icono className="h-4 w-4" aria-hidden="true" />
                  {x.pestana}
                </button>
              )
            })}
          </div>
        </div>

        {/* Panel del frente elegido; la key reinicia la animación de entrada */}
        <div
          key={f.id}
          role="tabpanel"
          id={`servicio-panel-${f.id}`}
          aria-labelledby={`servicio-tab-${f.id}`}
          className="mt-8 grid items-center gap-8 rounded-3xl border border-border bg-surface p-5 shadow-card motion-safe:animate-aparecer sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:p-10"
        >
          <FotoServicio foto={f.foto} />

          <div>
            <h3 className="text-balance font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {f.titulo}
            </h3>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-text-secondary sm:text-base">
              {f.descripcion}
            </p>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Ideal para</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {f.idealPara.map((x) => (
                <li
                  key={x}
                  className="rounded-full border border-primary/15 bg-primary-light/60 px-3 py-1 text-xs font-medium text-primary-hover"
                >
                  {x}
                </li>
              ))}
            </ul>

            <ul className="mt-6 grid gap-x-6 gap-y-2.5 border-t border-border pt-6 sm:grid-cols-2">
              {f.funciones.map((x) => (
                <li key={x} className="flex items-start gap-2.5 text-sm text-text-secondary sm:text-base">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  {x}
                </li>
              ))}
            </ul>

            <Link
              href={`/servicios#${f.ancla}`}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 outline-none transition-all hover:bg-primary-hover hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              Ver detalles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Cierre: lo que no encaja también se construye */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-primary/30 px-6 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-pretty text-sm text-text-secondary sm:text-base">
            <span className="font-semibold text-text-primary">¿Tu operación no encaja en ninguno?</span>{" "}
            También lo construimos a la medida.
          </p>
          <a
            href={enlaceMedida}
            {...evento("whatsapp", { origen: "servicios-a-la-medida" })}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary outline-none transition-all hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d={WHATSAPP.path} />
            </svg>
            Platiquemos tu caso
          </a>
        </div>
      </div>
    </section>
  )
}
