"use client"

import { useRef, useState } from "react"

export interface PestanaSistema {
  id: string
  titulo: string
  /** Cuántos módulos o funciones trae (se muestra junto al título). */
  cuenta: number
  icono: React.ReactNode
  /** Contenido ya renderizado en el servidor. */
  panel: React.ReactNode
}

/*
 * Pestañas de la propuesta: una parte a la vez (el sistema web o la app; cada
 * fase futura), igual que el escaparate de servicios del inicio.
 */
export function PestanasSistema({
  pestanas,
  nombre,
  prefijo,
}: {
  pestanas: PestanaSistema[]
  /** Nombre accesible del grupo de pestañas. */
  nombre: string
  /** Prefijo de los id, para que dos grupos en la misma página no choquen. */
  prefijo: string
}) {
  const [activo, setActivo] = useState(0)
  const botones = useRef<(HTMLButtonElement | null)[]>([])
  const p = pestanas[activo]

  // Flechas izquierda/derecha entre pestañas (patrón de tabs accesible)
  function alTeclado(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const siguiente = (activo + (e.key === "ArrowRight" ? 1 : pestanas.length - 1)) % pestanas.length
    setActivo(siguiente)
    botones.current[siguiente]?.focus()
  }

  return (
    <div>
      {/* Se deslizan de lado en celular */}
      <div
        role="tablist"
        aria-label={nombre}
        onKeyDown={alTeclado}
        className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-surface p-1.5 shadow-card [scrollbar-width:none]"
      >
        {pestanas.map((x, i) => {
          const actual = i === activo
          return (
            <button
              key={x.id}
              ref={(el) => {
                botones.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${prefijo}-tab-${x.id}`}
              aria-selected={actual}
              aria-controls={`${prefijo}-panel-${x.id}`}
              tabIndex={actual ? 0 : -1}
              onClick={() => setActivo(i)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary sm:px-5 ${
                actual
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-text-secondary hover:bg-bg-section hover:text-text-primary"
              }`}
            >
              {x.icono}
              {x.titulo}
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[11px] tabular-nums ${
                  actual ? "bg-white/20 text-white" : "bg-primary-light text-primary"
                }`}
              >
                {x.cuenta}
              </span>
            </button>
          )
        })}
      </div>

      {/* La key reinicia la animación de entrada al cambiar de pestaña */}
      <div
        key={p.id}
        role="tabpanel"
        id={`${prefijo}-panel-${p.id}`}
        aria-labelledby={`${prefijo}-tab-${p.id}`}
        className="mt-6 motion-safe:animate-aparecer"
      >
        {p.panel}
      </div>
    </div>
  )
}
