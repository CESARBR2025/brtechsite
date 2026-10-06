"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

/*
 * Bloque secundario que en celular va plegado tras un botón (como una fila de
 * ajustes) y desde sm se muestra siempre abierto, sin botón.
 */
export function PlegableMovil({
  titulo,
  children,
  className = "",
}: {
  titulo: string
  children: React.ReactNode
  className?: string
}) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl text-left text-sm font-semibold text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary sm:hidden"
      >
        {titulo}
        <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${abierto ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <div className={abierto ? "pt-2 sm:pt-0" : "max-sm:hidden"}>{children}</div>
    </div>
  )
}
