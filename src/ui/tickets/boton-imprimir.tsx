"use client"

import { Printer } from "lucide-react"

export function BotonImprimir({
  variante = "claro",
}: {
  variante?: "claro" | "oscuro"
}) {
  const clase =
    variante === "oscuro"
      ? "border-white/20 bg-white/5 text-text-muted backdrop-blur-sm hover:bg-white/10 hover:text-white"
      : "border-border bg-surface text-text-secondary hover:bg-bg-section"

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`no-print inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all active:scale-[0.98] ${clase}`}
    >
      <Printer className="h-4 w-4" />
      Descargar / Imprimir
    </button>
  )
}
