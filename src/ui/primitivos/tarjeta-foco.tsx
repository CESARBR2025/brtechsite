"use client"

/**
 * Tarjeta oscura con un foco violeta que sigue al puntero (solo CSS: el
 * puntero actualiza --x/--y sin re-render). En táctil no hay hover y el foco
 * no aparece.
 */

import { useRef, type ReactNode } from "react"

export function TarjetaFoco({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty("--x", `${e.clientX - r.left}px`)
        el.style.setProperty("--y", `${e.clientY - r.top}px`)
      }}
      className={`group relative overflow-hidden rounded-2xl border border-line-dark bg-surface-dark transition-colors hover:border-line-dark-strong ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(420px_circle_at_var(--x)_var(--y),rgba(120,54,226,0.16),transparent_60%)]"
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}
