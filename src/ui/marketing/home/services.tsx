"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { WHATSAPP } from "@/src/ui/marketing/datos-contacto"
import { servicios as frentes } from "@/src/ui/marketing/servicios/datos"
import { FotoServicio } from "@/src/ui/marketing/servicios/foto-servicio"
import { evento } from "@/src/ui/analitica"
import { ListaChecks } from "@/src/ui/primitivos/lista-checks"

/*
 * Escaparate de servicios con pestañas: un frente a la vez, en grande, con
 * su foto y "Ideal para" para mostrar que nos adaptamos a distintos giros sin
 * encasillarnos en uno. Los datos salen de `servicios/datos.ts` (los comparte
 * con /servicios).
 */

export function ServicesSection() {
  const [activo, setActivo] = useState(0)
  const pestanas = useRef<(HTMLButtonElement | null)[]>([])
  const lista = useRef<HTMLDivElement>(null)
  const f = frentes[activo]

  // Al cambiar de pestaña, si el control quedó arriba de la pantalla (el panel
  // nuevo puede ser más corto o largo), se vuelve a él para no perder el contexto.
  function seleccionar(i: number) {
    setActivo(i)
    const el = lista.current
    if (el && el.getBoundingClientRect().top < 80) {
      requestAnimationFrame(() => el.scrollIntoView({ block: "start", behavior: "smooth" }))
    }
  }

  // Flechas izquierda/derecha entre pestañas (patrón de tabs accesible)
  function alTeclado(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const siguiente = (activo + (e.key === "ArrowRight" ? 1 : frentes.length - 1)) % frentes.length
    seleccionar(siguiente)
    pestanas.current[siguiente]?.focus()
  }

  const enlaceMedida = `https://wa.me/${WHATSAPP.telefono.replace("+", "")}?text=${encodeURIComponent(
    "Hola, vi su sitio. Mi operación es distinta y me gustaría platicar un sistema a la medida.",
  )}`

  return (
    <section className="relative bg-bg-section py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Servicios
            <span className="h-px w-8 bg-primary" />
          </p>
          <h2 className="mt-4 text-balance font-display text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:mt-5 sm:text-5xl">
            Lo que construimos para tu negocio
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-text-secondary sm:mt-5 sm:text-lg">
            No forzamos tu negocio a encajar en una herramienta: construimos la herramienta que encaja
            con tu negocio.
          </p>
        </div>

        {/* Pestañas: control segmentado en celular (las 3 siempre visibles, ícono arriba);
            fila de píldoras desde sm */}
        <div className="mt-7 scroll-mt-24 sm:mt-12 sm:flex sm:justify-center" ref={lista}>
          <div
            role="tablist"
            aria-label="Servicios"
            onKeyDown={alTeclado}
            className="grid grid-cols-3 gap-1 rounded-2xl border border-border bg-surface p-1 shadow-card sm:flex sm:max-w-full sm:gap-1 sm:overflow-x-auto sm:rounded-full sm:p-1.5 sm:[scrollbar-width:none]"
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
                  onClick={() => seleccionar(i)}
                  className={`flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-xl px-1.5 py-2.5 text-center text-xs font-semibold leading-tight outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary sm:min-h-11 sm:shrink-0 sm:flex-row sm:gap-2 sm:rounded-full sm:px-5 sm:text-sm ${
                    actual
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "text-text-secondary hover:bg-bg-section hover:text-text-primary"
                  }`}
                >
                  <x.icono className="h-5 w-5 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span className="text-balance">{x.pestana}</span>
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
          className="mt-5 grid items-center gap-6 rounded-3xl border border-border bg-surface p-4 shadow-card sm:motion-safe:animate-aparecer sm:mt-8 sm:gap-8 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:p-10"
        >
          <FotoServicio foto={f.foto} />

          <div>
            <h3 className="text-balance font-display text-[22px] font-bold leading-tight tracking-tight text-text-primary sm:text-3xl">
              {f.titulo}
            </h3>
            <p className="mt-2.5 text-pretty text-[15px] leading-relaxed text-text-secondary sm:mt-3 sm:text-base">
              {f.descripcion}
            </p>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted sm:mt-6">Ideal para</p>
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

            <div className="mt-5 border-t border-border pt-5 sm:mt-6 sm:pt-6">
              <ListaChecks
                key={f.id}
                items={f.funciones}
                visibles={4}
                className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2"
              />
            </div>

            <Link
              href={`/servicios#${f.ancla}`}
              className="group mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 outline-none transition-all hover:bg-primary-hover hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] sm:mt-8 sm:inline-flex sm:w-auto"
            >
              Ver detalles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Cierre: lo que no encaja también se construye */}
        <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-2xl border border-dashed border-primary/30 px-5 py-4 text-center sm:mt-8 sm:flex-row sm:gap-4 sm:px-6 sm:py-5 sm:text-left">
          <p className="text-pretty text-sm text-text-secondary sm:text-base">
            <span className="font-semibold text-text-primary">¿Tu operación no encaja en ninguno?</span>{" "}
            También lo construimos a la medida.
          </p>
          <a
            href={enlaceMedida}
            {...evento("whatsapp", { origen: "servicios-a-la-medida" })}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary outline-none transition-all hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
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
