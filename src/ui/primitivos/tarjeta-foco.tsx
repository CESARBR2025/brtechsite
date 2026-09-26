"use client"

/**
 * Tarjeta con un foco violeta que sigue al puntero (solo CSS: el puntero
 * actualiza --x/--y sin re-render). En táctil no hay hover y el foco no
 * aparece. `tono="claro"` para secciones claras (tarjeta blanca, foco sutil).
 */

import { useRef, type ReactNode } from "react"

const TONO = {
  oscuro: {
    caja: "border-line-dark bg-surface-dark hover:border-line-dark-strong",
    foco: "rgba(120,54,226,0.16)",
  },
  claro: {
    caja: "border-border bg-surface shadow-card hover:border-primary/30 hover:shadow-hover",
    foco: "rgba(120,54,226,0.07)",
  },
}

export function TarjetaFoco({
  children,
  className = "",
  tono = "oscuro",
}: {
  children: ReactNode
  className?: string
  tono?: keyof typeof TONO
}) {
  const t = TONO[tono]
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
      className={`group relative overflow-hidden rounded-2xl border transition-all ${t.caja} ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--x) var(--y), ${t.foco}, transparent 60%)` }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}
