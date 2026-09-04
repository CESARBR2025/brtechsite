"use client"

import { Printer } from "lucide-react"

export function BotonImprimir() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:bg-bg-section"
    >
      <Printer className="h-4 w-4" />
      Descargar / Imprimir
    </button>
  )
}
