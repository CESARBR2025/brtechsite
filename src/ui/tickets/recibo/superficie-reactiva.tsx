"use client"

import type { PointerEvent, ReactNode } from "react"

/** Solo actualiza variables CSS; el contenido se compone en el servidor. */
export function SuperficieReactiva({ children, className = "", tipo }: { children: ReactNode; className?: string; tipo: "banco" | "medalla" | "cuadricula" }) {
  function mover(evento: PointerEvent<HTMLDivElement>, reiniciar = false) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || evento.pointerType === "touch") return
    const el = evento.currentTarget, r = el.getBoundingClientRect()
    const x = reiniciar ? 0 : (evento.clientX - r.left) / r.width - .5
    const y = reiniciar ? 0 : (evento.clientY - r.top) / r.height - .5
    const giro = tipo === "medalla" ? 30 : 10
    el.style.setProperty("--rx", `${-y * giro}deg`)
    el.style.setProperty("--ry", `${x * giro}deg`)
    el.style.setProperty("--bx", `${50 + x * 100}%`)
    el.style.setProperty("--by", `${50 + y * 100}%`)
    el.style.setProperty("--ang", `${160 + x * 160}deg`)
    el.style.setProperty("--mx", `${evento.clientX - r.left}px`)
    el.style.setProperty("--my", `${evento.clientY - r.top}px`)
  }
  return <div className={className} onPointerMove={mover} onPointerLeave={(e) => mover(e, true)}>{children}</div>
}
